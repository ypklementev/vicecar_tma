import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "@/api/api.ts";


export const useDeleteService = (serviceId: number) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["deleteService", serviceId],
        mutationFn: () => api(`/v2/service/${serviceId}`, { method: "DELETE" }),

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["maintenance"] }),
                queryClient.invalidateQueries({ queryKey: ["repairs"] }),
            ])
        }
    })
}