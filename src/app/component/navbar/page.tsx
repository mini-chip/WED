"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Logo from "@/images/logo.svg";
import Sidebar from "../sidebar/page";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
        setIsLogin(false);
      } else {
        setUser(data.user);
        setIsLogin(true);
      }
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      console.log("성공적으로 로그아웃되었습니다.");
      setUser(null);
      setIsLogin(false);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <nav className="flex justify-between items-center px-16 text-[#4f9e5b]">
      <div
        className="relative w-[30px] h-[25px] cursor-pointer transition-all duration-300 ease-in-out"
        onClick={toggleMenu}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`absolute w-full h-[3px] bg-green transition-all duration-300 ease-in-out ${
            isOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
          }`}
        />
        <div
          className={`absolute w-full h-[3px] bg-green transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-0" : "top-1/2 -translate-y-1/2"
          }`}
        />
        <div
          className={`absolute w-full h-[3px] bg-green transition-all duration-300 ease-in-out ${
            isOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
          }`}
        />
      </div>

      <div className="flex items-center">
        <Logo width={100} height={100} />
      </div>

      {isLogin ? (
        <div className="flex items-center space-x-4">
          <span>{user?.email}</span>
          <button
            onClick={handleLogout}
            className="rounded-2xl bg-green p-4 text-white"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <a href="/signin" className="hover:text-green-500">
            로그인
          </a>
          <a href="/signup" className="hover:text-green-500">
            회원가입
          </a>
        </div>
      )}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
    </nav>
  );
}
