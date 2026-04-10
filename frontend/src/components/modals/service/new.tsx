import React, { useState } from "react";
import { Input, Button, Loader } from "@/shared/ui";
import { useServiceForm } from "./useServiceForm.ts";
import { useAddRepair } from "@/api/api.ts";
import type {ModalState} from "@/types/types.ts";

interface AddServiceModalProps {
  carId: number | undefined
  setModal: React.Dispatch<React.SetStateAction<ModalState>>
}

export const New = ({ carId, setModal }: AddServiceModalProps) => {
  const { values, errors, selected, setSelected, handleChange, validateAll } = useServiceForm();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const repairs = [
    { type: "engine", name: "Двигатель" },
    { type: "transmission", name: "Трансмиссия" },
    { type: "brakes", name: "Тормозная система" },
    { type: "suspension", name: "Подвеска" },
    { type: "electrical", name: "Электрика" },
    { type: "cooling", name: "Система охлаждения" },
    { type: "climate", name: "Климат и отопление" },
    { type: "body", name: "Кузовные работы" }
  ]
  const filtered = repairs.filter(m => m.name.toLowerCase().includes(query.toLowerCase()));
  const mutation = useAddRepair(carId);

  const addItem = (item: { type: string; name: string }) => {
    setSelected(prev => [...prev, { ...item, cost: 0 }]);
    setQuery("");
  };

  const handleSubmit = () => {
    if (!validateAll()) return;
    mutation.mutate({
      date: new Date().toISOString(),
      mileage: values.mileage,
      comment: values.comment,
      items: selected
    }, {
      onSuccess: () => setModal((prev) => ({...prev, type: null}))
    });
  };

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

      <div className="input-wrapper">
        <div className="label">Добавьте минимум одно ТО*</div>
        <Input
          name={"service-add"}
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          placeholder="Введите тип ТО"
          error={errors.types}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {query && isFocused && (
          <div className="suggestions">
            {filtered.map(item => (
              <span key={item.type} onClick={() => addItem(item)}>{item.name}</span>
            ))}
            {filtered.length === 0 && <span>Ничего не найдено</span>}
          </div>
        )}
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
                value={item.cost}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const cost = +e.target.value;
                  setSelected(prev => prev.map((m, idx) => idx === i ? { ...m, cost } : m));
                }}
              />
              <button onClick={() => setSelected(prev => prev.filter((_, idx) => idx !== i))}>×</button>
            </div>
          ))}
        </div>
      )}

      <Button label={mutation.isPending ? <Loader /> : "Добавить"} onClick={handleSubmit} />
    </>
  )
}