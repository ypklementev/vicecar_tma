import type { Maintenances } from "@/types/types.ts"

// TODO: подключить useEditRepair когда появится в api.ts
export const useEditRepairHandler = () => {
    const onSubmit = (_data: Maintenances) => {
        console.warn("useEditRepairHandler: not implemented")
    }

    return { onSubmit, mutation: { isPending: false, isSuccess: false } }
}