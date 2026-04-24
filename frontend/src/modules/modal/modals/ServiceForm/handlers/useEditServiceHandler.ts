import {useModal} from "@/modules/modal/context/ModalContext.tsx";
import type {Service} from "@/shared/types/types.ts";
import {useEditService} from "@/modules/modal/modals/ServiceForm/api";


interface useEditServiceHandlerProps {
    serviceId: number,
}

export const useEditServiceHandler = ({serviceId}: useEditServiceHandlerProps) => {
    const mutation = useEditService(serviceId)
    const { closeModal } = useModal()

    const onSubmit = (data: Service) => {
        const payload: Partial<Service> = {
            service_type: data.service_type,
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