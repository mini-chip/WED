"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Logo from "@/images/logo.svg";
import Button from "@/app/component/buttons/page";
import GoogleButton from "@/app/component/oauthButton/page";
import { useState } from "react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const hanleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        alert(error.message);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      alert("로그인 실패");
    }
  };
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4">
      <Logo width={100} height={100} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          hanleSignIn();
        }}
        className="flex flex-col gap-3 w-full max-w-xs"
      >
        <input
          type="Email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2  border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-2  border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="bg-green-500 hover:text-green-500">
          로그인
        </Button>

        <p className="text-center text-gray-600">
          계정이 아직 없으신가요?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            회원가입
          </a>
        </p>

        <GoogleButton> Google 계정으로 로그인</GoogleButton>
      </form>
    </div>
  );
}
