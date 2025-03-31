import Image from "next/image";
import { supabase } from "@/lib/supabase";
import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  textColor?: string;
}
const GoogleButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  className = "",
  textColor = "text-gray-900"
}) => {
  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error("Google 로그인 에러:", error.message);
        alert(`Google 로그인 실패: ${error.message}`);
      }
    } catch (err) {
      console.error("예상치 못한 에러:", err);
      alert("Google 로그인 중 문제가 발생했습니다.");
    }
  };
  return (
    <button
      type="button"
      onClick={handleGoogleSignUp}
      className={`select-none appearance-none bg-white border-[2px] rounded-2xl border-green cursor-pointer font-roboto text-sm h-10 tracking-[0.25px] outline-none overflow-hidden relative text-center transition-colors duration-200 align-middle whitespace-nowrap w-auto max-w-[400px] min-w-fit disabled:cursor-default disabled:bg-white/40 disabled:border-gray-900/10 hover:shadow-md ${className}`}
    >
      <div className="flex items-center flex-row flex-nowrap h-full justify-between relative w-full px-[25px] py-2">
        <div className="h-5 mr-3 min-w-5 w-5 disabled:opacity-40">
          <Image
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google Icon"
            width={20}
            height={20}
          />
        </div>
        <span className="flex-grow font-roboto font-medium overflow-hidden text-ellipsis align-top disabled:opacity-40">
          {children}
        </span>
      </div>
    </button>
  );
};
export default GoogleButton;
