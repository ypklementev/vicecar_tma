import { type InputHTMLAttributes, useEffect, useRef } from "react";
import gsap from "gsap";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  error?: string;
}

export const Input = ({ label, name, error, ...rest }: InputProps) => {
  const errorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!errorRef.current) return;

    if (error) {
      gsap.fromTo(
        errorRef.current,
        { opacity: 0, y: -6 },
        { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }
      );
    } else {
      gsap.to(errorRef.current, {
        opacity: 0,
        y: -6,
        duration: 0.2
      });
    }
  }, [error]);

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