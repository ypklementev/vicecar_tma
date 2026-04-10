export const tg = window.Telegram?.WebApp;

export const initData: string | undefined = tg?.initData;

export const initTelegram = () => {
  if (!tg) return;

  tg.ready();
  tg.expand();
};

export const closeApp = () => tg?.close();

export const haptic = {
  success: () => tg?.HapticFeedback?.notificationOccurred("success"),
  error: () => tg?.HapticFeedback?.notificationOccurred("error"),
  impact: () => tg?.HapticFeedback?.impactOccurred("medium")
};

export const tgUser = tg?.initDataUnsafe?.user;
export const tgTheme = tg?.themeParams;