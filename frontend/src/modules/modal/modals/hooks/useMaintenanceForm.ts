import type {Service} from "@/shared/types/types.ts";
import {useAppContext} from "@/app/context/AppContext.tsx";
import {useForm} from "react-hook-form";


interface UseMaintenanceFormOptions {
    defaultValues?: Partial<Service>
}

export const useMaintenanceForm = (options?: UseMaintenanceFormOptions) => {
    const { car } = useAppContext()

    return useForm<Service>({
        mode: "onChange",
        delayError: 500,
        defaultValues: options?.defaultValues ?? {
            mileage: car?.current_mileage,
            items: [],
        },
    })
}