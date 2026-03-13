import React, {type ChangeEvent, type RefObject, useState} from "react"
import {Input} from "@/shared/ui/input.tsx"
import {Button} from "@/shared/ui/button.tsx"
import {useAppContext} from "@/context/AppContext.tsx"
import type {Maintenance} from "@/types/types.ts";
import {useAddMaintenance, useAddRepair} from "@/api/api.ts";
import {useMatch} from "react-router-dom";
import {Loader} from "@/components/Loader.tsx";
import {useCarPage} from "@/hooks/useCarPage.tsx";


type MaintenanceType = {
  type: string
  name: string
}

interface AddServiceModalProps {
  debounceRef: RefObject<number | null>
}

export const AddServiceModal = ({ debounceRef } : AddServiceModalProps) => {
  const { car, setIsModalOpen } = useAppContext()
  const { activePage } = useCarPage()
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Maintenance[]>([])
  const match = useMatch("/car/:id")
  const carId = match ? Number(match.params.id) : undefined
  const useMutation = activePage === 'maintenance' ? useAddMaintenance(carId) : useAddRepair(carId)

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
  ]

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

  const filtered = (activePage === 'maintenance' ? maintenances : repairs).filter(m =>
    m.name.toLowerCase().includes(query.toLowerCase())
  )

  const addMaintenance = (item: MaintenanceType) => {
    setSelected(prev => [
      ...prev,
      { ...item, cost: 0 }
    ])
    setQuery("")
  }

  const [values, setValues] = useState({
    mileage: 0,
    comment: ""
  });

  const [errors, setErrors] = useState({
    mileage: "",
    comment: "",
    types: ""
  });

  const createMaintenance = () => {
    const type = query
      .toLowerCase()
      .replace(/\s+/g, "_")

    addMaintenance({
      type,
      name: query
    })

    setErrors((prev) => ({
      ...prev,
      ["types"]: ""
    }))
  }

  const validate = (name: string, value: string | number | Maintenance[]) => {
    switch (name) {
      case "mileage":
        return (value && (Number(value) < 0))
          ? "Пробег не может быть отрицательным"
          : Number(value) === 0
            ? "Введите пробег"
            : ""
      case "comment":
        return (typeof value === "string" && value.trim().length === 0)
          ? "Введите комментарий"
          : ''
      case "types":
        return (typeof value === "object" && value.length === 0)
          ? "Выберите хотя бы один тип"
          : ''
    }
  }

  const validateAll = () => {
    const newErrors: typeof errors = {
      mileage: validate("mileage", values.mileage) || "",
      comment: validate("comment", values.comment) || "",
      types: validate("types", selected) || "",
    };

    setErrors(newErrors);

    return Object.values(newErrors).every((e) => !e);
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value
    }));

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const error = validate(name, value);

      setErrors((prev) => ({
        ...prev,
        [name]: error
      }));
    }, 650);
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

  const clickAddMaintenance = () => {
    const isValid = validateAll();

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (!isValid) return

    useMutation.mutate({
      date: new Date().toISOString(),
      mileage: values.mileage,
      comment: values.comment,
      items: selected
    }, {
      onSuccess: () => {
        setValues({
          mileage: 0,
          comment: "",
        })
        setSelected([])
        setIsModalOpen(false)
      },
      onError: (e) => {
        console.error(e)
      }
    })
  }

  return (
    <>
      <h3>
        {activePage === 'maintenance'
          ? 'Новое ТО'
          : 'Новый ремонт'
        }
      </h3>

      <Input
        name="comment"
        label="Комментарий*"
        value={values.comment}
        onChange={handleChange}
        error={errors.comment}
      />

      <Input
        name="mileage"
        label="Пробег (км)*"
        type={"number"}
        placeholder={car && car.current_mileage ? car.current_mileage.toString() : ''}
        value={values.mileage ? values.mileage : ""}
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
          />

          {query && (
            <div className="suggestions">
              {filtered.map(item => (
                <span
                  key={item.type}
                  onClick={() => addMaintenance(item)}
                >
                  {item.name}
                </span>
              ))}

              {filtered.length === 0 && (
                <span onClick={createMaintenance}>
                  Создать "{query}"
                </span>
              )}
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

      <Button
        label={useMutation.isPending
          ? <Loader />
          : useMutation.error
            ? "Произошла ошибка"
            : "Добавить"
        }
        onClick={clickAddMaintenance}
        style={{ marginTop: "16px" }}
        disabled={ useMutation.isPending }
        className={ useMutation.isPending
          ? "default-button active"
          : useMutation.error
            ? "default-button error"
            : "default-button"
        }
      />
    </>
  );
}