import { type InputHTMLAttributes, useRef } from "react";
import {useInputGsap} from "@/shared/hooks/useInputGsap.tsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  error?: string;
}

export const Input = ({ label, name, error, ...rest }: InputProps) => {
  const errorRef = useRef<HTMLSpanElement>(null);
  useInputGsap({ error, errorRef })

  return (
      <div className="input-wrapper">
        <div className="label">{label}</div>
        <input
            name={name}
            {...rest}
            className={`custom-input ${error ? "error" : ""}`}
            autoComplete="off"
        />
        {error && (
            <span className="input-error" ref={errorRef}>
              {error}
            </span>
        )}
      </div>
  );
};