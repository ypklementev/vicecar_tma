import axios from "axios"
import { initData } from "./telegram"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import type { CarApi, Cars, User } from "@/shared/types/types.ts"


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

export async function api<T = unknown>(
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

