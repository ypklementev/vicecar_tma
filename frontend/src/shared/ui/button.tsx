import React, {type ButtonHTMLAttributes} from "react";


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const Button: React.FC<ButtonProps> = ({ label, ...rest }) => {
  return (
    <button {...rest} className="default-button">
      {label}
    </button>
  )
}