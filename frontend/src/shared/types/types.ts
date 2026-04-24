export interface User {
  first_name: string,
  id: number,
  telegramId: number,
  username: string
}

export interface CarApi {
  brand: string,
  model: string,
  year: number,
  vin?: string | null,
  current_mileage: number,
}

export interface Car extends CarApi{
  created_at: string,
  id: number
  last_oil_notification_mileage: number | null,
  oil_change_interval_km: number | null,
  user_id: number
}

export type Cars = Car[]

export interface ServiceItem {
  id: number | undefined,
  type: string,
  name: string | undefined,
  cost: number | undefined
}

export interface Service {
  id: number,
  car_id: number,
  service_type: "maintenance" | "repair",
  date: string,
  mileage: number,
  total_cost: number,
  comment: string,
  items: ServiceItem[]
}