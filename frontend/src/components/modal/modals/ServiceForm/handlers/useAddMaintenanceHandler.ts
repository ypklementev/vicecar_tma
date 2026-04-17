import { useAddMaintenance } from "@/api/api.ts"
import { useModal } from "@/context/ModalContext.tsx"
import { useCarId } from "@/shared/hooks/useCarId.tsx"
import type { Maintenances } from "@/types/types.ts"

export const useAddMaintenanceHandler = () => {
    const carId = useCarId()
    const mutation = useAddMaintenance(carId)
    const { closeModal } = useModal()

    const onSubmit = (data: Maintenances) => {
        const payload: Omit<Maintenances, 'id'> = {
            service_type: "maintenance",
            date: new Date(),
            mileage: data.mileage,
            comment: data.comment,
            items: data.items,
        }
        mutation.mutate(payload, {
            onSuccess: () => setTimeout(() => closeModal(), 500),
        })
    }

    return { onSubmit, mutation }
}