export const useFormatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ru-RU")
}