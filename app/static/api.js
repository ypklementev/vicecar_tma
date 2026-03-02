const tg = window.Telegram?.WebApp;
const initData = window.Telegram.WebApp.initData;

async function api(url, options = {}) {
    options.headers = {
        ...(options.headers || {}),
        "Content-Type": "application/json"
    };

    if (initData) {
        options.headers["X-Telegram-Init-Data"] = initData;
    }

    const res = await fetch(url, options);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}