import { useForm } from "react-hook-form"
import type { Maintenances } from "@/types/types.ts"
import { useAppContext } from "@/context/AppContext.tsx"

interface UseServiceFormOptions {
    defaultValues?: Partial<Maintenances>
}

export const useServiceForm = (options?: UseServiceFormOptions) => {
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