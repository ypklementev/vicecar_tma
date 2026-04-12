import { useForm } from "react-hook-form";
import { Button, Input, Loader } from "@/shared/ui";
import { useAddCar } from "@/api/api.ts";
import type { CarApi } from "@/types/types.ts";
import {useModal} from "@/context/ModalContext.tsx";
import {Success} from "@/shared/ui/Success.tsx";

interface CarFormValues {
    brand: string;
    model: string;
    year: number;
    vin?: string;
    current_mileage: number;
}

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1900;

export default function AddCarContent() {
    const addCar = useAddCar();
    const { closeModal } = useModal();

    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm<CarFormValues>({
        mode: "onChange",
        delayError: 500,
        defaultValues: { vin: "" },
    });

    const onSubmit = (data: CarFormValues) => {
        const payload: CarApi = {
            brand: data.brand,
            model: data.model,
            year: Number(data.year),
            current_mileage: Number(data.current_mileage),
        };

        addCar.mutate(payload, {
            onSuccess: () => {
                setTimeout(() => closeModal(), 500)
            },
        });
    };

    return (
        <form className={"modal-content"} onSubmit={handleSubmit(onSubmit)}>
            <h2>Добавить авто</h2>

            <Input
                label="Марка*"
                placeholder="Toyota"
                type="text"
                error={errors.brand?.message}
                onInput={() => clearErrors('brand')}
                {...register("brand", {
                    required: "Укажите марку",
                })}
            />

            <Input
                label="Модель*"
                placeholder="Camry"
                type="text"
                error={errors.model?.message}
                onInput={() => clearErrors('model')}
                {...register("model", {
                    required: "Укажите модель",
                })}
            />

            <Input
                label="Год*"
                placeholder={String(CURRENT_YEAR)}
                type="number"
                error={errors.year?.message}
                onInput={() => clearErrors('year')}
                {...register("year", {
                    valueAsNumber: true,
                    required: "Укажите год",
                    min: { value: MIN_YEAR, message: `Год не раньше ${MIN_YEAR}` },
                    max: { value: CURRENT_YEAR, message: `Год не позднее ${CURRENT_YEAR}` },
                })}
            />

            <Input
                label="ВИН-номер"
                placeholder="ВИН-номер"
                type="text"
                name={"vin"}
            />

            <Input
                label="Пробег*"
                placeholder="0"
                type="number"
                error={errors.current_mileage?.message}
                onInput={() => clearErrors('current_mileage')}
                {...register("current_mileage", {
                    valueAsNumber: true,
                    required: "Укажите пробег",
                    min: { value: 0, message: "Пробег не может быть отрицательным" },
                })}
            />

            <Button
                name="addCar"
                label={addCar.isPending
                    ? <Loader />
                    : addCar.isSuccess
                        ? <Success />
                        : "Добавить"
                }
                disabled={addCar.isPending || addCar.isSuccess}
                customClass={addCar.isSuccess ? "btn-success" : ''}
                type="submit"
                style={{ marginTop: "1rem" }}
            />
        </form>
    );
}