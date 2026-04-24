import { useModal } from "@/modules/modal/context/ModalContext.tsx"
import { useCarId } from "@/shared/hooks/useCarId.tsx"
import type { Service } from "@/shared/types/types.ts"
import {useAddRepair} from "@/modules/modal/modals/ServiceForm/api";


export const useAddRepairHandler = () => {
    const carId = useCarId()
    const mutation = useAddRepair(carId)
    const { closeModal } = useModal()

    const onSubmit = (data: Service) => {
        const payload: Partial<Service> = {
            service_type: "repair",
            date: data.date.split('T')[0],
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