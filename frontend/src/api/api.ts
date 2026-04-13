import axios from "axios"
import { initData } from "./telegram"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import type { CarApi, Cars, Maintenances, RepairsApi, User } from "@/types/types.ts"


const apiClient = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json"
  }
})

apiClient.interceptors.request.use((config) => {

  if (initData) {
    config.headers["X-Telegram-Init-Data"] = initData
  }

  return config;
})

async function api<T = unknown>(
  url: string,
  config?: any
): Promise<T> {
  const res = await apiClient(url, config)
  return res.data
}

export const useGetCars = () => {
  return useQuery<Cars>({
    queryKey: ["cars"],
    queryFn: () => api("/cars")
  })
}

export const useGetUser = () => {
  return useQuery<User>({
    queryKey: ["user"],
    queryFn: () => api("/users/me")
  });
}

export const useGetMaintenance = (carId?: number | undefined) => {
  return useQuery<Maintenances[]>({
    queryKey: ["maintenance", carId],
    queryFn: () => api(`/maintenance/${carId}`),
    enabled: !!carId
  })
}

export const useGetRepairs = (carId?: number) => {
  return useQuery<RepairsApi>({
    queryKey: ["repairs", carId],
    queryFn: () => api(`/repairs/${carId}`),
    enabled: !!carId
  })
}

export const useAddCar = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["addCar"],
    mutationFn: (car: CarApi) => api("/cars", { data: car, method: "POST" }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ["cars"]})
    }
  })
}

export const useAddMaintenance = (carId: number | undefined) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["addMaintenance"],
    mutationFn: (maintenance: Maintenances) => api(`/maintenance/${carId}`, { data: maintenance, method: "POST" }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ["maintenance"]})
    }
  })
}

export const useAddRepair = (carId: number | undefined) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["addMaintenance"],
    mutationFn: (repair: Maintenances) => api(`/repairs/${carId}`, { data: repair, method: "POST" }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ["repairs"]})
    }
  })
}