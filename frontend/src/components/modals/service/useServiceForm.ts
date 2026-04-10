import { useState, type ChangeEvent } from "react"
import type { Maintenance } from "@/types/types.ts"
import {useAppContext} from "@/context/AppContext.tsx";

export const useServiceForm = (initialValues = { mileage: 0, comment: "" }) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({ mileage: "", comment: "", types: "" })
  const [selected, setSelected] = useState<Maintenance[]>([])
  const { modal } = useAppContext()

  const validate = (name: string, value: string | number | Maintenance[]) => {
    switch (name) {
      case "mileage":
        return (value && Number(value) < 0)
          ? "Пробег не может быть отрицательным"
          : Number(value) === 0
            ? "Введите пробег"
            : ""
      case "comment":
        return (typeof value === "string" && value.trim().length === 0)
          ? "Введите комментарий"
          : ""
      case "types":
        return (Array.isArray(value) && value.length === 0)
          ? "Выберите хотя бы один тип"
          : ""
      default:
        return ""
    }
  }

  const validateAll = () => {
    const newErrors = {
      mileage: validate("mileage", values.mileage) || "",
      comment: validate("comment", values.comment) || "",
      types: validate("types", selected) || "",
    }
    setErrors(newErrors)
    return Object.values(newErrors).every(e => !e)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
  }

  return { values, setValues, errors, selected, setSelected, handleChange, validateAll, setErrors };
}