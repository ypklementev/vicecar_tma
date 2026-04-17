import type {Maintenances} from "@/types/types.ts";
import {useAppContext} from "@/context/AppContext.tsx";
import {useForm} from "react-hook-form";


interface UseMaintenanceFormOptions {
    defaultValues?: Partial<Maintenances>
}

export const useMaintenanceForm = (options?: UseMaintenanceFormOptions) => {
    const { car } = useAppContext()

    return useForm<Maintenances>({
        mode: "onChange",
        delayError: 500,
        defaultValues: options?.defaultValues ?? {
            mileage: car?.current_mileage,
            items: [],
        },
    })
}