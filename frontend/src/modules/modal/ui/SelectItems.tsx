import {Controller, type FieldError, useFieldArray, useFormContext} from "react-hook-form"
import { Input } from "@/shared/ui"
import { SelectInput } from "@/widgets/SelectInput.tsx"
import { MAINTENANCE_CATEGORIES, REPAIR_CATEGORIES } from "@/modules/modal/modals/ServiceForm/settings/staticConsts.ts"
import type {Service} from "@/shared/types/types.ts";


interface SelectItemsProps {
    mode: "maintenance" | "repair"
}

export const SelectItems = ({ mode }: SelectItemsProps) => {
    const { register, control, clearErrors, formState: { errors } } = useFormContext<Service>()
    const { fields, append, remove } = useFieldArray({ control, name: "items" })

    const categories = mode === "maintenance" ? MAINTENANCE_CATEGORIES : REPAIR_CATEGORIES

    const handleAdd = () => {
        clearErrors("items")
        append({ id: undefined, type: '', name: undefined, cost: undefined })
    }

    return (
        <div className="select-wrapper">
            {fields.length > 0 && (
                <div className="select-items__list">
                    {fields.map((field, index) => (
                        <div key={field.id} className="service-modal-card">
                            <div className="service-modal-card__header">
                                <Controller
                                    control={control}
                                    name={`items.${index}.type`}
                                    rules={{ required: "Выберите категорию" }}
                                    render={({ field }) => (
                                        <SelectInput
                                            placeholder="Категория"
                                            options={categories.map(c => ({ value: c.type, label: c.name }))}
                                            error={errors.items?.[index]?.type?.message}
                                            name={field.name}
                                            value={field.value}           // ← контролируемый
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                        />
                                    )}
                                />
                                <button
                                    type="button"
                                    className="service-modal-card__remove"
                                    onClick={() => remove(index)}
                                >✕</button>
                            </div>

                            <Input
                                placeholder="Описание работы"
                                type="text"
                                error={errors.items?.[index]?.name?.message}
                                {...register(`items.${index}.name`, {
                                    required: "Укажите наименование",
                                })}
                            />

                            <Input
                                placeholder="Стоимость"
                                type="number"
                                error={errors.items?.[index]?.cost?.message}
                                {...register(`items.${index}.cost`, {
                                    required: "Укажите стоимость",
                                    valueAsNumber: true,
                                    min: { value: 0, message: "Стоимость не может быть отрицательной" },
                                    validate: value => !value || !isNaN(value) || "Укажите корректную стоимость"
                                })}
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className="input-wrapper">
                <button
                    type="button"
                    className="btn-add-category"
                    onClick={handleAdd}
                >
                    + Добавить запчасть
                </button>
                {(errors.items as FieldError)?.message && (
                    <span className="input-error" style={{textAlign: 'end'}}>{(errors.items as FieldError).message}</span>
                )}
            </div>

        </div>
    )
}