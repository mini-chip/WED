"use client";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={`fixed top-20 left-0 h-full bg-[#f8f9fa] text-green w-64 transition-transform duration-300 ease-in-out transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } z-40`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="py-10 px-4 ">
        <nav className="flex flex-col gap-4 ">
          <Link
            href="/"
            className="flex items-center gap-3 p-2 rounded hover:bg-gray-700"
          >
            홈
          </Link>
          <Link
            href="/mypage"
            className="flex items-center gap-3 p-2 rounded hover:bg-gray-700"
          >
            마이페이지
          </Link>
          <Link
            href="/weather"
            className="flex items-center gap-3 p-2 rounded hover:bg-gray-700"
          >
            날씨 체크하기
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 p-2 rounded hover:bg-gray-700"
          >
            설정
          </Link>
        </nav>
      </div>
    </div>
  );
}
