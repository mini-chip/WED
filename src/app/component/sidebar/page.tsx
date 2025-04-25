"use client";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* 사이드바 */}
      <div
        className={`absolute top-0 left-0 h-full bg-green text-white w-64 transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40`}
      >
        <div className="p-4">
          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-3 p-2 rounded hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <span>홈</span>
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-3 p-2 rounded hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <span>프로필</span>
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 p-2 rounded hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <span>설정</span>
            </Link>
            <Link
              href="/logout"
              className="flex items-center gap-3 p-2 rounded hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <span>로그아웃</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* 오버레이: 모바일에서 사이드바가 열렸을 때 배경 어두워짐 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}
