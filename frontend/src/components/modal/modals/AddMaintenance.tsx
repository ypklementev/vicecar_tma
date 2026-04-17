import {useAddMaintenance} from "@/api/api.ts";
import {useModal} from "@/context/ModalContext.tsx";
import {FormProvider, useForm} from "react-hook-form";
import type {Maintenances} from "@/types/types.ts";
import {Button, Input, Loader} from "@/shared/ui";
import {Success} from "@/shared/ui/Success.tsx";
import {useCarId} from "@/hooks/useCarId.tsx";
import {useAppContext} from "@/context/AppContext.tsx";
import {SelectItems} from "@/components/modal/modals/components/SelectItems.tsx";


export default function AddMaintenance () {
    const carId = useCarId()
    const addMaintenance = useAddMaintenance(carId);
    const { car } = useAppContext()
    const { closeModal } = useModal()

    const methods = useForm<Maintenances>({
        mode: "onChange",
        delayError: 500,
        defaultValues: {
            mileage: car?.current_mileage,
            items: [],
        },
    })

    const { register, handleSubmit, formState: { errors } } = methods

    const onSubmit = (data: Maintenances) => {
        const payload: Maintenances = {
            service_type: "maintenance",
            date: new Date(),
            mileage: data.mileage,
            comment: data.comment,
            items: data.items && data.items.length > 0 ? data.items : null,
        }
        console.log(payload)
        addMaintenance.mutate(payload, {
            onSuccess: () => setTimeout(() => closeModal(), 500),
        })
    }

    return (
        <FormProvider {...methods}>
            <form className={"modal-content"} onSubmit={handleSubmit(onSubmit)}>
                <h2>Добавить авто</h2>

                <Input
                    label="Комментарий"
                    placeholder="..."
                    type="text"
                    {...register('comment')}
                />

                <Input
                    label="Пробег*"
                    placeholder="Camry"
                    type="text"
                    error={errors.mileage?.message}
                    {...register("mileage", {
                        required: "Укажите пробег",
                    })}
                />

                <SelectItems mode="maintenance" />

                <Button
                    name="addMaintenance"
                    label={addMaintenance.isPending
                        ? <Loader />
                        : addMaintenance.isSuccess
                            ? <Success />
                            : "Добавить"
                    }
                    disabled={addMaintenance.isPending || addMaintenance.isSuccess}
                    customClass={addMaintenance.isSuccess ? "btn-success" : ""}
                    type="submit"
                    style={{ marginTop: "1rem" }}
                />
            </form>
        </FormProvider>
    );
}