import axios from "axios";
import { initData } from "./telegram";
import {useQuery} from "@tanstack/react-query";
import type {Cars, CarsService, User} from "@/types/types.ts";


export const apiClient = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json"
  }
})

apiClient.interceptors.request.use((config) => {
  if (initData) {
    config.headers["X-Telegram-Init-Data"] = initData;
  }

  return config;
})

async function api<T = unknown>(
  url: string,
  config?: any
): Promise<T> {
  const res = await apiClient(url, config);
  return res.data;
}

export const useGetCars = () => {
  return useQuery<Cars>({
    queryKey: ["cars"],
    queryFn: () => api("/cars")
  });
}

export const useGetUser = () => {
  return useQuery<User>({
    queryKey: ["user"],
    queryFn: () => api("/users/me")
  });
}

export const useGetMaintenance = (id: number) => {
  return useQuery<CarsService>({
    queryKey: ["car", id],
    queryFn: () => api(`/maintenance/${id}`),
  })
}