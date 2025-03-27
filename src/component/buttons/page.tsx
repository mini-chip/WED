import React, { ReactNode } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
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
    <button type={type} onClick={onClick} className={`btn ${className}`}>
      <span className="btn-span">{children}</span>
      <div className="btn-after"></div>
    </button>
  );
};

export default Button;
