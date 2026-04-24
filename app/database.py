import socket
import select
import socketserver
import threading
import paramiko
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import settings

_ssh: paramiko.SSHClient | None = None
_local_port: int | None = None
_forward_server = None


def _forward_tunnel(local_port: int, remote_host: str, remote_port: int, transport: paramiko.Transport):
    class Handler(socketserver.BaseRequestHandler):
        def handle(self):
            try:
                chan = transport.open_channel(
                    "direct-tcpip",
                    (remote_host, remote_port),
                    self.request.getpeername(),
                )
            except Exception:
                return
            while True:
                r, _, _ = select.select([self.request, chan], [], [])
                if self.request in r:
                    data = self.request.recv(1024)
                    if not data:
                        break
                    chan.send(data)
                if chan in r:
                    data = chan.recv(1024)
                    if not data:
                        break
                    self.request.send(data)
            chan.close()

    server = socketserver.ThreadingTCPServer(("127.0.0.1", local_port), Handler)
    server.daemon_threads = True
    t = threading.Thread(target=server.serve_forever, daemon=True)
    t.start()
    return server


def get_local_port() -> int:
    global _ssh, _local_port, _forward_server
    if _local_port is None:
        with socket.socket() as s:
            s.bind(("127.0.0.1", 0))
            _local_port = s.getsockname()[1]

        _ssh = paramiko.SSHClient()
        _ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        _ssh.connect(
            hostname=settings.SSH_HOST,
            port=settings.SSH_PORT,
            username=settings.SSH_USER,
            key_filename=settings.SSH_KEY_PATH,
            look_for_keys=False,
        )
        _forward_server = _forward_tunnel(
            _local_port,
            settings.DB_HOST,
            settings.DB_PORT,
            _ssh.get_transport(),
        )
    return _local_port


def get_database_url() -> str:
    port = get_local_port()
    return (
        f"postgresql+psycopg2://{settings.DB_USER}:{settings.DB_PASSWORD}"
        f"@127.0.0.1:{port}/{settings.DB_NAME}"
    )


engine = create_engine(get_database_url(), echo=False)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()