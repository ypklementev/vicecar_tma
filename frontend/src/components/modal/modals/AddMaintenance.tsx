import {useAddMaintenance} from "@/api/api.ts";
import {useModal} from "@/context/ModalContext.tsx";
import {useForm} from "react-hook-form";
import {useEffect} from "react";
import type {Maintenances} from "@/types/types.ts";
import {Button, Input, Loader} from "@/shared/ui";
import {Success} from "@/shared/ui/Success.tsx";
import {useCarId} from "@/hooks/useCarId.tsx";
import {useAppContext} from "@/context/AppContext.tsx";


export default function AddMaintenance () {
    const carId = useCarId()
    const addMaintenance = useAddMaintenance(carId);
    const { car } = useAppContext()
    const { closeModal } = useModal();

    const {
        register,
        handleSubmit,
        trigger,
        formState,
    } = useForm<Maintenances>({
        mode: "onChange",
        defaultValues: {mileage: car?.current_mileage}
    });

    const { errors, touchedFields } = formState;

    useEffect(() => {
        const fields = Object.keys(touchedFields) as (keyof Maintenances)[];
        if (fields.length > 0) trigger(fields);
    }, [trigger]);

    const onSubmit = (data: Maintenances) => {
        const payload: Maintenances = {
            date: data.date,
            mileage: data.mileage,
            comment: data.comment,
            items: data.items,
        };

        addMaintenance.mutate(payload, {
            onSuccess: () => {
                setTimeout(() => closeModal(), 500)
            },
        });
    };

    return (
        <form className={"modal-content"} onSubmit={handleSubmit(onSubmit)}>
            <h2>Добавить авто</h2>

            <Input
                label="Комментарий"
                placeholder="..."
                type="text"
                error={errors.comment?.message}
                name={"comment"}
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

            <Input
                label="ВИН-номер"
                placeholder="ВИН-номер"
                type="text"
                name={"vin"}
            />

            <Button
                name="addMaintenance"
                label={addMaintenance.isPending
                    ? <Loader />
                    : addMaintenance.isSuccess
                        ? <Success />
                        : "Добавить"
                }
                disabled={addMaintenance.isPending || addMaintenance.isSuccess}
                customClass={addMaintenance.isSuccess ? "btn-success" : ''}
                type="submit"
                style={{ marginTop: "1rem" }}
            />
        </form>
    );
}