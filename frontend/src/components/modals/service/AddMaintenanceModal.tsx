import React, { useState } from "react";
import { Input, Button, Loader } from "@/shared/ui";
import { useServiceForm } from "./useServiceForm.ts";
import { useAddMaintenance } from "@/api/api.ts";
import type {ModalState} from "@/types/types.ts";


interface AddMaintenanceModalProps {
  carId: number | undefined
  setModal: React.Dispatch<React.SetStateAction<ModalState>>
}

type MaintenanceType = {
  type: string
  name: string
}

export const AddMaintenanceModal = ({ carId, setModal }: AddMaintenanceModalProps) => {
  const { values, errors, selected, setSelected, handleChange, validateAll } = useServiceForm();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const maintenances = [
    { type: "oil", name: "Замена масла" },
    { type: "oil_filter", name: "Замена масляного фильтра" },
    { type: "air_filter_engine", name: "Замена воздушного фильтра (двигатель)" },
    { type: "brake_fluid", name: "Замена тормозной жидкости" },
    { type: "coolant", name: "Замена охлаждающей жидкости" },
    { type: "gear_oil", name: "Замена масла КПП" },
    { type: "gear_oil_filter", name: "Замена масляного фильтра КПП" },
    { type: "fuel_filter", name: "Замена топливного фильтра" },
    { type: "spark_plug", name: "Замена свечей зажигания" },
    { type: "air_filter_cabin", name: "Замена салонного фильтра" }
  ];
  const filtered = maintenances.filter(m => m.name.toLowerCase().includes(query.toLowerCase()));
  const mutation = useAddMaintenance(carId);

  const addMaintenance = (item: MaintenanceType) => {
    setSelected(prev => [
      ...prev,
      { ...item, cost: 0 }
    ])
    setQuery("")
  }

  const handleSubmit = () => {
    if (!validateAll()) return
    mutation.mutate({
      date: new Date().toISOString(),
      mileage: values.mileage,
      comment: values.comment,
      items: selected
    }, {
      onSuccess: () => setModal((prev) => ({...prev, type: null}))
    })
  }

  const createMaintenance = () => {
    if (modal.type === 'addMaintenance') return
    const type = "other"

    addMaintenance({
      type,
      name: query
    })

    setErrors((prev) => ({
      ...prev,
      ["types"]: ""
    }))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()

      if (filtered.length > 0) {
        addMaintenance(filtered[0])
      } else if (query.trim()) {
        createMaintenance()
      }
    }
  }

  return (
    <>
      <h3>Новое ТО</h3>

      <Input
        name="comment"
        label="Комментарий*"
        value={values.comment}
        onChange={handleChange}
        error={errors.comment}
      />

      <Input
        name="mileage"
        label="Пробег*"
        value={values.mileage}
        onChange={handleChange}
        error={errors.mileage}
      />

      <div className='input-wrapper'>
        <div className='label'>Добавьте минимум одно ТО*</div>
        <div className="autocomplete">

          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Введите тип ТО" name={"maintenance-add"}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            error={errors.types}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {query && isFocused && (
            <div className="suggestions">
              {filtered.map(item => (
                <span
                  key={item.type}
                  onClick={() => addMaintenance(item)}
                >
                  {item.name}
                </span>
              ))}

              {filtered.length === 0 && <span>Ничего не найдено</span>}
            </div>
          )}
        </div>
      </div>

      {selected.length > 0 && (
        <div className="maintenance-list">
          {selected.map((item, i) => (
            <div key={i} className="maintenance-item">

              <Input
                name={item.name}
                type="number"
                label={item.name}
                placeholder="Стоимость, ₽"
                value={item.cost ? item.cost : ""}
                onChange={(e) => {
                  const cost = +e.target.value
                  setSelected(prev =>
                    prev.map((m, index) =>
                      index === i ? {...m, cost} : m
                    )
                  )
                }}
              />

              <button
                onClick={() =>
                  setSelected(prev => prev.filter((_, index) => index !== i))
                }
              >×</button>

            </div>
          ))}
        </div>
      )}

      <Button label={mutation.isPending ? <Loader /> : "Добавить"} onClick={handleSubmit} />
    </>
  )
}