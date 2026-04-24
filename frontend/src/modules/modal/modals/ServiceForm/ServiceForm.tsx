import { FormProvider } from "react-hook-form"
import { Button, Input, Loader } from "@/shared/ui"
import { Success } from "@/shared/ui/Success.tsx"
import { SelectItems } from "@/modules/modal/ui/SelectItems.tsx"
import { useServiceForm } from "./hooks/useServiceForm.ts"
import type {Service} from "@/shared/types/types.ts";
import {useHandler} from "@/modules/modal/modals/ServiceForm/hooks/useHandler.ts";
import type {ServiceFormMode} from "@/modules/modal/modals/types";
import {SELECT_MODE, TITLES} from "@/modules/modal/modals/ServiceForm/settings";


export interface ServiceFormProps {
    mode: ServiceFormMode
    defaultValues?: Partial<Service>,
    id: number,
    type?: 'edit' | 'add'
}

export const ServiceForm = ({ mode, defaultValues, id, type }: ServiceFormProps) => {
    const methods = useServiceForm({ defaultValues })
    const { onSubmit, mutation } = useHandler(mode, id)

    const { register, handleSubmit, setError, formState: { errors } } = methods

    const handleFormSubmit = (data: Service) => {
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
                                type === 'edit'
                                    ? "Изменить" : "Добавить"
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