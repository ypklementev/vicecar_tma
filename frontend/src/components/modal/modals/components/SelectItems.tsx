import { useFieldArray, useFormContext } from "react-hook-form"
import type { Maintenances } from "@/types/types.ts"
import { Input } from "@/shared/ui"
import { MAINTENANCE_CATEGORIES, REPAIR_CATEGORIES } from "@/components/staticConsts.ts"
import React from "react"

interface SelectItemsProps {
    mode: "maintenance" | "repair"
}

export const SelectItems = ({ mode }: SelectItemsProps) => {
    const { register, control, formState: { errors } } = useFormContext<Maintenances>()
    const { fields, append, remove } = useFieldArray({ control, name: "items" })

    const categories = mode === "maintenance" ? MAINTENANCE_CATEGORIES : REPAIR_CATEGORIES

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value
        if (!value) return

        const preset = categories.find(p => p.type === value)
        if (preset) append({ type: preset.type, name: undefined, cost: undefined })  // ← name не в форму

        e.target.value = ""
    }

    return (
        <div className="select-wrapper">
            <div className="input-wrapper">
                <div className="label">Категория*</div>
                <select className="custom-input" defaultValue="" onChange={handleSelect}>
                    <option value="" disabled hidden>Добавить...</option>
                    {categories.map(item => (
                        <option key={item.type} value={item.type}>{item.name}</option>
                    ))}
                </select>
            </div>

            {fields.length > 0 && (
                <div className="select-items__list">
                    {fields.map((field, index) => {
                        const label = categories.find(c => c.type === field.type)?.name  // ← берём из константы

                        return (
                            <div key={field.id} className="maintenance-card">
                                <div className="maintenance-card__header">
                                    <span className="maintenance-card__type">{label}</span>  {/* ← из константы */}
                                    <button
                                        type="button"
                                        className="maintenance-card__remove"
                                        onClick={() => remove(index)}
                                    >✕</button>
                                </div>

                                <Input
                                    label="Наименование*"
                                    placeholder="Описание работы"
                                    type="text"
                                    error={errors.items?.[index]?.name?.message}
                                    {...register(`items.${index}.name`, {
                                        required: "Укажите наименование",
                                    })}
                                />

                                <Input
                                    label="Стоимость"
                                    placeholder="0"
                                    type="number"
                                    error={errors.items?.[index]?.cost?.message}
                                    {...register(`items.${index}.cost`, {
                                        valueAsNumber: true,
                                        min: { value: 0, message: "Стоимость не может быть отрицательной" },
                                        validate: value => !value || !isNaN(value) || "Укажите корректную стоимость"
                                    })}
                                />

                        </div>
                    )})}
                </div>
            )}
        </div>
    )
}