import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  className = ""
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`custom-button ${className}`}
    >
      <span>{children}</span>
    </button>
  );
};

export default Button;
