import React, {type ButtonHTMLAttributes, type ReactNode} from "react";


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string | ReactNode,
  customClass?: string,
}

export const Button: React.FC<ButtonProps> = ({ label, customClass, ...rest }) => {
  return (
    <button className={"default-button " + customClass} {...rest}>
      {label}
    </button>
  )
}