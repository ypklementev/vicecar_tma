import { FormProvider } from "react-hook-form"
import { Button, Input, Loader } from "@/shared/ui"
import { Success } from "@/shared/ui/Success.tsx"
import { SelectItems } from "@/components/modal/modals/ServiceForm/components/SelectItems.tsx"
import { useServiceForm } from "./hooks/useServiceForm.ts"
import { useAddMaintenanceHandler } from "./handlers/useAddMaintenanceHandler.ts"
import { useAddRepairHandler } from "./handlers/useAddRepairHandler.ts"
import { useEditMaintenanceHandler } from "./handlers/useEditMaintenanceHandler.ts"
import { useEditRepairHandler } from "./handlers/useEditRepairHandler.ts"
import type { Maintenances } from "@/types/types.ts"

type ServiceFormMode = "addMaintenance" | "addRepair" | "editMaintenance" | "editRepair"

const TITLES: Record<ServiceFormMode, string> = {
    addMaintenance:  "Добавить ТО",
    addRepair:       "Добавить ремонт",
    editMaintenance: "Изменить ТО",
    editRepair:      "Изменить ремонт",
}

const SELECT_MODE: Record<ServiceFormMode, "maintenance" | "repair"> = {
    addMaintenance:  "maintenance",
    addRepair:       "repair",
    editMaintenance: "maintenance",
    editRepair:      "repair",
}

interface ServiceFormProps {
    mode: ServiceFormMode
    defaultValues?: Partial<Maintenances>
}

const useHandler = (mode: ServiceFormMode) => {
    const handlers = {
        addMaintenance:  useAddMaintenanceHandler(),
        addRepair:       useAddRepairHandler(),
        editMaintenance: useEditMaintenanceHandler(),
        editRepair:      useEditRepairHandler(),
    }
    return handlers[mode]
}

export const ServiceForm = ({ mode, defaultValues }: ServiceFormProps) => {
    const methods = useServiceForm({ defaultValues })
    const { onSubmit, mutation } = useHandler(mode)

    const { register, handleSubmit, setError, formState: { errors } } = methods

    const handleFormSubmit = (data: Maintenances) => {
        if (data.items.length === 0) {
            setError("items", { message: "Добавьте хотя бы одну деталь" })
            return
        }
        onSubmit(data)
    }

    return (
        <FormProvider {...methods}>
            <form className="modal-content" onSubmit={handleSubmit(handleFormSubmit)}>
                <h2>{TITLES[mode]}</h2>

                <Input
                    label="Комментарий"
                    placeholder="..."
                    type="text"
                    {...register("comment")}
                />

                <Input
                    label="Пробег*"
                    placeholder="Введите пробег"
                    type="text"
                    error={errors.mileage?.message}
                    {...register("mileage", {
                        required: "Укажите пробег",
                    })}
                />

                <SelectItems mode={SELECT_MODE[mode]} />

                <Button
                    name="serviceForm"
                    label={
                        mutation.isPending ? <Loader /> :
                            mutation.isSuccess ? <Success /> :
                                "Добавить"
                    }
                    disabled={mutation.isPending || mutation.isSuccess}
                    customClass={mutation.isSuccess ? "btn-success" : ""}
                    type="submit"
                    style={{ marginTop: "1rem" }}
                />
            </form>
        </FormProvider>
    )
}