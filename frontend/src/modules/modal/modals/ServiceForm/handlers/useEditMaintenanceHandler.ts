import type { Service } from "@/shared/types/types.ts"

// TODO: подключить useEditMaintenance когда появится в api.ts
export const useEditMaintenanceHandler = () => {
    const onSubmit = (_data: Service) => {
        console.warn("useEditMaintenanceHandler: not implemented")
    }

    return { onSubmit, mutation: { isPending: false, isSuccess: false } }
}