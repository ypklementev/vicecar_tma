import { useForm } from "react-hook-form"
import { useAppContext } from "@/app/context/AppContext.tsx"
import type {Service} from "@/shared/types/types.ts";

interface UseServiceFormOptions {
    defaultValues?: Partial<Service>
}

export const useServiceForm = (options?: UseServiceFormOptions) => {
    const { car } = useAppContext()

    return useForm<Service>({
        mode: "onChange",
        delayError: 500,
        defaultValues: options?.defaultValues ?? {
            mileage: car?.current_mileage,
            date: new Date().toISOString().split('T')[0],
            items: [],
        },
    })
}