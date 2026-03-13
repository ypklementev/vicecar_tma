import { Input } from "@/shared/ui/input.tsx";
import {type ChangeEvent, type RefObject, useState} from "react";
import {Button} from "@/shared/ui/button.tsx";
import {Loader} from "@/components/Loader.tsx";
import {useAddCar} from "@/api/api.ts";
import type {AddCar} from "@/types/types.ts";
import {useAppContext} from "@/context/AppContext.tsx";


interface AddCarModalProps {
  debounceRef: RefObject<number | null>
}

const currentYear = new Date().getFullYear();

export const AddCarModal = ({ debounceRef } : AddCarModalProps) => {
  const { setIsModalOpen } = useAppContext()
  const addCarMutation = useAddCar()

  const [values, setValues] = useState<AddCar>({
    brand: "",
    model: "",
    year: 0,
    current_mileage: 0,
    vin: ""
  })

  const [errors, setErrors] = useState({
    brand: "",
    model: "",
    year: "",
    current_mileage: "",
  });

  const validate = (name: string, value: string | number) => {
    const currentYear = new Date().getFullYear();

    switch (name) {
      case "brand":
      case "model":
        if (!value.toString().trim()) return "Обязательное поле";
        break;

      case "year":
        const year = Number(value);
        if (!year) return "Введите год";
        if (year < 1900 || year > currentYear)
          return `Год должен быть 1900–${currentYear}`;
        break;

      case "current_mileage":
        if (!value) return "Введите пробег"
        if (value && Number(value) < 0)
          return "Пробег не может быть отрицательным";
        break;
    }

    return "";
  }

  const validateAll = () => {
    const newErrors: typeof errors = {
      brand: validate("brand", values.brand),
      model: validate("model", values.model),
      year: validate("year", values.year),
      current_mileage: validate("current_mileage", values.current_mileage),
    };

    setErrors(newErrors);

    return Object.values(newErrors).every((e) => !e);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

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

  const clickAddCar = async () => {
    const isValid = validateAll()

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (!isValid) return

    addCarMutation.mutate(values, {
      onSuccess: () => {
        setIsModalOpen(false)
        setValues({
          brand: "",
          model: "",
          year: 0,
          current_mileage: 0,
          vin: ""
        })
      },
      onError: (e) => {
        console.error(e)
      }
    })
  }

  return (
    <>
      <h3>Новый автомобиль</h3>

      <Input
        name={"brand"}
        label={"Марка*"}
        placeholder={"Toyota"}
        value={values.brand}
        onChange={handleChange}
        error={errors.brand}
      />

      <Input
        name={"model"}
        label={"Название*"}
        placeholder={"Camry"}
        value={values.model}
        onChange={handleChange}
        error={errors.model}
      />

      <div className="row">
        <Input
          name={"year"}
          label={"Год*"}
          type={"number"}
          placeholder={"2020"}
          value={values.year ? values.year : ""}
          onChange={handleChange}
          min={1900}
          max={currentYear}
          step={1}
          error={errors.year}
        />

        <Input
          name={"current_mileage"}
          label={"Пробег (км)*"}
          type={"number"}
          placeholder={"150000"}
          value={values.current_mileage ? values.current_mileage : ""}
          onChange={handleChange}
          error={errors.current_mileage}
        />
      </div>

      <Input
        name={"vin"}
        label={"VIN номер"}
        placeholder={"XTA210990Y2765432"}
        value={values.vin}
        onChange={handleChange}
      />

      <Button
        label={
          addCarMutation.isPending
            ? <Loader />
            : addCarMutation.error
              ? "Произошла ошибка"
              : "Добавить"
        }
        style={{ marginTop: "16px" }}
        onClick={clickAddCar}
        disabled={ addCarMutation.isPending }
        className={ addCarMutation.isPending
            ? "default-button active"
            : addCarMutation.error
              ? "default-button error"
              : "default-button"
        }
      />
    </>
  );
};