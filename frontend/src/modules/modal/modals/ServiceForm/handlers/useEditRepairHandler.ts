import type { Service } from "@/shared/types/types.ts"

// TODO: подключить useEditRepair когда появится в api.ts
export const useEditRepairHandler = () => {
    const onSubmit = (_data: Service) => {
        console.warn("useEditRepairHandler: not implemented")
    }

    return { onSubmit, mutation: { isPending: false, isSuccess: false } }
}