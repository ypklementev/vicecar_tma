import {type ChangeEvent, type RefObject, useState} from "react";
import {Input} from "@/shared/ui/input.tsx";
import {Button} from "@/shared/ui/button.tsx";


interface AddServiceModalProps {
  debounceRef: RefObject<number | null>
}

export const AddServiceModal = ({ debounceRef } : AddServiceModalProps) => {
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
}