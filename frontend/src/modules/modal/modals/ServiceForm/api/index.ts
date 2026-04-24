import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import type {ServicesApi} from "@/modules/modal/modals/types";
import {api} from "@/api/api.ts";
import type {Service} from "@/shared/types/types.ts";


export const useGetMaintenance = (carId?: number | undefined) => {
    return useQuery<ServicesApi>({
        queryKey: ["maintenance", carId],
        queryFn: () => api(`/maintenance/${carId}`),
        enabled: !!carId
    })
}

export const useGetRepairs = (carId?: number) => {
    return useQuery<ServicesApi>({
        queryKey: ["repairs", carId],
        queryFn: () => api(`/repairs/${carId}`),
        enabled: !!carId
    })
}

export const useAddMaintenance = (carId: number | undefined) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["addMaintenance", carId],
        mutationFn: (maintenance: Partial<Service>) => api(`/maintenance/${carId}`, { data: maintenance, method: "POST" }),

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({queryKey: ["cars"]}),
                queryClient.invalidateQueries({queryKey: ["maintenance"]}),
            ])

        }
    })
}

export const useAddRepair = (carId: number | undefined) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["addRepair", carId],
        mutationFn: (repair: Partial<Service>) => api(`/repairs/${carId}`, { data: repair, method: "POST" }),

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({queryKey: ["cars"]}),
                queryClient.invalidateQueries({queryKey: ["repairs"]}),
            ])
        }
    })
}

export const useEditService = (serviceId: number | undefined) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["editService", serviceId],
        mutationFn: (repair: Partial<Service>) => api(`/v2/service/${serviceId}`, { data: repair, method: "PATCH" }),

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["cars"] }),
                queryClient.invalidateQueries({ queryKey: ["maintenance"] }),
                queryClient.invalidateQueries({ queryKey: ["repairs"] }),
            ])
        }
    })
}