import { Input } from "@/shared/ui/input.tsx";
import {type ChangeEvent, useRef, useState} from "react";
import {Button} from "@/shared/ui/button.tsx";


const currentYear = new Date().getFullYear();

export const AddCarModal = () => {
  const debounceRef = useRef<number | null>(null);

  const [values, setValues] = useState({
    type: "",
    name: "",
    year: "",
    run: "",
    vin: "",
    oil: ""
  });

  const [errors, setErrors] = useState({
    type: "",
    name: "",
    year: "",
    run: "",
  });

  const validate = (name: string, value: string) => {
    const currentYear = new Date().getFullYear();

    switch (name) {
      case "type":
      case "name":
        if (!value.trim()) return "Обязательное поле";
        break;

      case "year":
        const year = Number(value);
        if (!year) return "Введите год";
        if (year < 1900 || year > currentYear)
          return `Год должен быть 1900–${currentYear}`;
        break;

      case "run":
        if (value && Number(value) < 0)
          return "Пробег не может быть отрицательным";
        break;
    }

    return "";
  };

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
  };

  return (
    <>
      <h3>Новый автомобиль</h3>

      <Input
        name="type"
        label="Марка*"
        placeholder="Toyota"
        value={values.type}
        onChange={handleChange}
        error={errors.type}
      />

      <Input
        name="name"
        label="Название*"
        placeholder="Camry"
        value={values.name}
        onChange={handleChange}
        error={errors.name}
      />

      <div className="row">
        <Input
          name="year"
          label="Год*"
          type="number"
          placeholder="2020"
          value={values.year}
          onChange={handleChange}
          min={1900}
          max={currentYear}
          step={1}
          error={errors.year}
        />

        <Input
          name="run"
          label="Пробег (км)*"
          type="number"
          placeholder="150000"
          value={values.run}
          onChange={handleChange}
          error={errors.run}
        />
      </div>

      <Input
        name="vin"
        label="VIN номер"
        placeholder="XTA210990Y2765432"
        value={values.vin}
        onChange={handleChange}
      />

      <Input
        name="oil"
        label="Интервал замены масла (км)"
        type="number"
        placeholder="10000"
        value={values.oil}
        onChange={handleChange}
      />

      <Button label={"Добавить"} style={{ marginTop: "16px" }}/>
    </>
  );
};