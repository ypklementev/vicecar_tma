Vicecar
Vicecar --- Telegram Mini App для учета обслуживания автомобилей. Приложение позволяет хранить информацию о машинах, проводить учет технического обслуживания и ремонтов, а также получать уведомления о необходимости замены масла.

Backend написан на FastAPI, база данных --- PostgreSQL. Приложение интегрируется с Telegram Mini App через проверку initData.

Функциональность
учет автомобилей пользователя
журнал технического обслуживания (ТО)
сервисная книга (ремонты)
хранение пробега
расчет необходимости замены масла
уведомления через Telegram
авторизация через Telegram WebApp
Стек технологий
Python
FastAPI
SQLAlchemy
PostgreSQL
Alembic
APScheduler
Nginx
Telegram WebApp API
Требования
Python 3.11+
PostgreSQL
Telegram Bot Token
Установка
1. Клонировать репозиторий
   git clone https://github.com/ypklementev/vicecar_tma.git cd vicecar_tma

2. Создать виртуальное окружение
   python -m venv .venv source .venv/bin/activate

3. Установить зависимости
   pip install -r requirements.txt

<h3>Запуск фронта:</h2>

1. <code>cd frontend</code>
2. <code>yarn</code>
3. <code>yarn run dev</code>

Настройка
Создать файл .env в корне проекта:

DATABASE_URL=postgresql://user:password@localhost:5432/vicecar BOT_TOKEN=your_telegram_bot_token DEV_MODE=true

Миграции базы данных
alembic upgrade head

Запуск приложения
Локальный запуск:

uvicorn app.main:app --reload

Приложение будет доступно по адресу:

http://localhost:8000

Запуск планировщика
Планировщик используется для проверки необходимости замены масла. Он запускается автоматически при старте приложения.

Деплой
На сервере используется:

systemd для запуска uvicorn
nginx как reverse proxy
GitHub Actions для автоматического деплоя
После push в ветку main выполняется:

обновление кода
установка зависимостей
выполнение миграций
перезапуск сервиса
Авторизация
Авторизация происходит через Telegram Mini App.

Frontend отправляет Telegram.WebApp.initData в заголовке:

X-Telegram-Init-Data

Backend проверяет подпись данных через HMAC-SHA256.