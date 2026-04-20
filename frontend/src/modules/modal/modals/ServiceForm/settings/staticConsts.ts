export const MAINTENANCE_CATEGORIES = [
    { type: "oil", name: "Замена масла" },
    { type: "oil_filter", name: "Замена масляного фильтра" },
    { type: "air_filter_engine", name: "Замена воздушного фильтра (двигатель)" },
    { type: "brake_fluid", name: "Замена тормозной жидкости" },
    { type: "coolant", name: "Замена охлаждающей жидкости" },
    { type: "gear_oil", name: "Замена масла КПП" },
    { type: "gear_oil_filter", name: "Замена масляного фильтра КПП" },
    { type: "fuel_filter", name: "Замена топливного фильтра" },
    { type: "spark_plug", name: "Замена свечей зажигания" },
    { type: "air_filter_cabin", name: "Замена салонного фильтра" }
] as const

export const REPAIR_CATEGORIES = [
    { type: "engine", name: "Двигатель" },
    { type: "transmission", name: "Трансмиссия" },
    { type: "brakes", name: "Тормозная система" },
    { type: "suspension", name: "Подвеска" },
    { type: "electrical", name: "Электрика" },
    { type: "cooling", name: "Система охлаждения" },
    { type: "climate", name: "Климат и отопление" },
    { type: "body", name: "Кузовные работы" },
    { type: "other", name: "Другое" }
] as const