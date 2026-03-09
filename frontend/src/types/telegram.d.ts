// src/types/telegram.d.ts
interface TelegramWebAppHapticFeedback {
  notificationOccurred: (type: "success" | "error" | "warning") => void;
  impactOccurred: (style: "light" | "medium" | "heavy") => void;
}

interface TelegramWebApp {
  initData?: string;
  initDataUnsafe?: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
    };
    chat?: any;
  };
  themeParams?: Record<string, string>;
  ready: () => void;
  expand: () => void;
  close: () => void;
  HapticFeedback?: TelegramWebAppHapticFeedback;
}

interface Telegram {
  WebApp: TelegramWebApp;
}

interface Window {
  Telegram?: Telegram;
}