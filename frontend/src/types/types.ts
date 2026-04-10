import type {UseQueryResult} from "@tanstack/react-query";
import React, {type SetStateAction} from "react";


type isEditing = {
  open: boolean
  id: number | null
}

export type ModalType =
  | "addCar"
  | "addService"
  | "addMaintenance"
  | "editRepair"
  | null

export type ModalState = {
  type: ModalType
  data?: any
}

export interface AppContextProps {
  theme: 'light' | 'dark'
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>

  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>

  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>

  isBtnLoading: boolean
  setIsBtnLoading: React.Dispatch<React.SetStateAction<boolean>>

  user: UseQueryResult<User, Error>
  cars: UseQueryResult<Cars, Error>

  car: Car | null
  setCar: React.Dispatch<React.SetStateAction<Car | null>>

  activeCar: number | null
  setActiveCar: React.Dispatch<React.SetStateAction<number>>

  isEditing: isEditing
  setIsEditing: React.Dispatch<React.SetStateAction<isEditing>>

  menuId: number | null
  setMenuId: React.Dispatch<SetStateAction<number | null>>

  modal: ModalState
  setModal: React.Dispatch<React.SetStateAction<ModalState>>
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
  cost: number,
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