import {type ChangeEvent, useRef, useState} from "react"
import {Input} from "@/shared/ui/input.tsx"
import {Button} from "@/shared/ui/button.tsx"
import {useAppContext} from "@/context/AppContext.tsx"


type MaintenanceType = {
  type: string
  name: string
}

type SelectedMaintenance = {
  type: string
  name: string
  cost: string
}

export const AddMaintenanceModal = () => {
  const { car } = useAppContext();
  const debounceRef = useRef<number | null>(null)
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<SelectedMaintenance[]>([])

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

  const filtered = maintenances.filter(m =>
    m.name.toLowerCase().includes(query.toLowerCase())
  )

  const addMaintenance = (item: MaintenanceType) => {
    setSelected(prev => [
      ...prev,
      { ...item, cost: "" }
    ])
    setQuery("")
  }

  const createMaintenance = () => {
    const type = query
      .toLowerCase()
      .replace(/\s+/g, "_")

    addMaintenance({
      type,
      name: query
    })
  }

  const [values, setValues] = useState({
    mileage: "",
    comment: ""
  });

  const [errors, setErrors] = useState({
    mileage: ""
  });

  const validate = (name: string, value: string) => {
    return (name === "mileage") && value && (Number(value) < 0)
      ? "Пробег не может быть отрицательным"
      : null
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

  return (
    <>
      <h3>Новое ТО</h3>

      <Input
        name="mileage"
        label="Пробег (км)*"
        placeholder={car && car.current_mileage ? car.current_mileage.toString() : ''}
        value={values.mileage}
        onChange={handleChange}
        error={errors.mileage}
      />

      <Input
        name="comment"
        label="Комментарий"
        value={values.comment}
        onChange={handleChange}
      />

      <div className='input-wrapper'>
        <div className='label'>Добавьте минимум одно ТО</div>
        <div className="autocomplete">

          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Введите тип ТО" name={"maintenance-add"}
            onKeyDown={handleKeyDown}
            autoComplete="off"
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
                placeholder="Стоимость (₽)"
                value={item.cost}
                onChange={(e) => {
                  const cost = e.target.value
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

      <Button label={"Добавить"} style={{ marginTop: "16px" }}/>
    </>
  );
}