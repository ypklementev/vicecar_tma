import type {UseQueryResult} from "@tanstack/react-query";

export interface AppContextProps {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void

  isLoading: boolean
  setIsLoading: (value: boolean) => void

  isModalOpen: boolean
  setIsModalOpen: (value: boolean) => void

  isBtnLoading: boolean
  setIsBtnLoading: (value: boolean) => void

  user: UseQueryResult<User, Error>
  cars: UseQueryResult<Cars, Error>
  car: Car | null
  setCar: (value: Car | null) => void

  activeCar: number | undefined
  setActiveCar: (value: number) => void

  // activePage: "maintenance" | "service",
  // setActivePage: (value: "maintenance" | "service") => void
}

export interface User {
  first_name: string,
  id: number,
  telegramId: number,
  username: string
}

export interface Car {
  brand: string,
  created_at: string,
  current_mileage: number,
  id: number
  last_oil_notification_mileage: number | null,
  model: string,
  oil_change_interval_km: number | null,
  user_id: number
  vin: string | null
  year: number
}

export type Cars = Car[]

export interface CarService {
  id: number
  car_id: number
  date: string
  total_cost: number
  mileage: number
  comment: string
}

export type CarsService = CarService[]

export interface AddCar {
  "brand": string,
  "model": string,
  "year": number,
  "vin": string,
  "current_mileage": number,
}

export interface Repair {
  id: number,
  name: string,
  cost: string,
  type: string,
}

export interface Repairs {
  id: number,
  car_id: number,
  date: string,
  mileage: number,
  total_cost: number,
  comment: string,
  items: Repair[]
}

export type RepairsApi = Repairs[]

export interface Maintenance {
  type: string,
  name: string,
  cost: number
}

export interface Maintenances {
  date: string,
  mileage: number,
  comment: string,
  items: Maintenance[]
}