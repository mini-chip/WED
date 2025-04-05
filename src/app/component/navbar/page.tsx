"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Logo from "@/images/logo.svg";

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
      {/* 햄버거 메뉴 */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`hamburger ${isOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <div
          className={` absolute w-full h-[3px] transition-all duration-300 ${
            isOpen ? "rotate-45 translate-y-0" : "top-0"
          }`}
        />
        <div
          className={`absolute w-full h-[3px] transition-all duration-300 ${
            isOpen ? "translate-x-1" : "top-1/2 -translate-y-1/2"
          }`}
        />
        <div
          className={` absolute w-full h-[3px] transition-all duration-300 ${
            isOpen ? "-rotate-45 translate-y-0" : "bottom-0"
          }`}
        />
      </div>
      <div className="flex items-center">
        <Logo width={100} height={100} />
      </div>
      {/* 
      <div
        className={`absolute top-16 right-16 bg-white shadow-lg rounded-lg p-4 transition-all duration-300 ${
          isOpen ? "block" : "hidden"
        }`}
      > */}
      {isLogin ? (
        <div className="flex items-center space-x-4">
          <span>{user?.email}</span> {/* 유저 이메일 표시 */}
          <button className="group relative flex justify-center items-center rounded-[10px] bg-custom-green font-montserrat shadow-[0_6px_24px_0_rgba(0,0,0,0.2)] overflow-hidden cursor-pointer border-0">
            <span className="text-center no-underline w-full px-[25px] py-2 bg-[#4f9e5b] text-white text-lg tracking-[0.3em] z-20 transition-all duration-300 ease-in-out group-hover:text-custom-green group-hover:animate-scaleUp">
              로그아웃
            </span>
            {/* <div className="w-0 h-full bg-custom-yellow absolute transition-all duration-400 ease-in-out right-0 group-hover:w-full group-hover:left-0 group-hover:right-auto"></div> */}
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
      {/* </div> */}
    </nav>
  );
}
