import { type SelectHTMLAttributes, useRef } from "react"
import {useInputGsap} from "@/shared/hooks/useInputGsap.tsx";

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    placeholder?: string
    name: string
    error?: string
    options: { value: string; label: string }[]
}

export const SelectInput = ({ label, placeholder, name, error, options, value, onChange, ...rest }: SelectInputProps) => {
    const errorRef = useRef<HTMLSpanElement>(null)
    useInputGsap({ error, errorRef })

    const isEmpty = !value || value === ""

    return (
        <div className="input-wrapper">
            {label && <div className="label">{label}</div>}
            <select
                name={name}
                value={value}
                onChange={onChange}
                {...rest}
                data-empty={isEmpty}
                className={`custom-input ${error ? "error" : ""}`}
            >
                {placeholder && (
                    <option value="" disabled hidden>{placeholder}</option>
                )}
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            {error && <span className="input-error" ref={errorRef}>{error}</span>}
        </div>
    )
}