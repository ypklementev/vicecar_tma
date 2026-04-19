import {useDeleteService} from "@/modules/alert/alerts/DeleteAlert/api";
import {useCallback} from "react";
import {useAlert} from "@/modules/alert/context/AlertsContext.tsx";


export const useHandler = (serviceId: number) => {
    const mutation = useDeleteService(serviceId)
    const { closeAlert } = useAlert()

    const onSubmit = useCallback(() => {
        mutation.mutate(undefined, {
            onSuccess: () => setTimeout(() => closeAlert(), 500)
        })
    }, [serviceId])

    return { onSubmit, mutation }
}