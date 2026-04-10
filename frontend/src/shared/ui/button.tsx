import React, {type ButtonHTMLAttributes, type ReactNode} from "react";


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string | ReactNode
}

export const Button: React.FC<ButtonProps> = ({ label, ...rest }) => {
  return (
    <button className="default-button" {...rest}>
      {label}
    </button>
  )
}