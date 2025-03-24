"use client";

import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchemaType, registerSchema } from "./registerSchema";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [signupError, setSignupError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur"
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    const { email, password, nickname } = data;

    try {
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password
        });

      if (signUpError) {
        setSignupError(`Sign Up Error: ${signUpError.message}`);
        return;
      }

      const user = signUpData.user;
      if (!user) {
        setSignupError("회원가입 실패. 다시 시도해주세요.");
        return;
      }

      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: user.id,
          nickname: nickname
        }
      ]);

      if (profileError) {
        setSignupError(`Profile Insert Error: ${profileError.message}`);
        return;
      }

      router.push("/");
    } catch (error: any) {
      setSignupError(`Unexpected Error: ${error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[350px] bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg flex flex-col items-center gap-4 sm:gap-5 md:gap-6"
      >
        <div className="flex flex-col items-center w-20 h-auto sm:w-24 relative">
          <div className="relative w-full h-20 sm:h-24">
            <Image src="/logo.svg" alt="Logo" width={100} height={100} />
          </div>
          {/* <h2 className="text-center font-['Lucida_Sans'] text-2xl sm:text-3xl font-extrabold mt-2 sm:mt-4">
            회원가입
          </h2> */}
        </div>

        <div className="w-full">
          <input
            {...register("email")}
            type="email"
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-sm sm:text-base"
            placeholder="이메일"
          />
          {errors.email && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="w-full">
          <input
            {...register("userId")}
            type="text"
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-sm sm:text-base"
            placeholder="아이디"
          />
          {errors.userId && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.userId.message}
            </p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="w-full">
          <input
            {...register("password")}
            type="password"
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-sm sm:text-base"
            placeholder="비밀번호"
          />
          {errors.password && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div className="w-full">
          <input
            {...register("passwordCheck")}
            type="password"
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-sm sm:text-base"
            placeholder="비밀번호 확인"
          />
          {errors.passwordCheck && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.passwordCheck.message}
            </p>
          )}
        </div>

        {/* 닉네임 */}
        <div className="w-full">
          <input
            {...register("nickname")}
            type="text"
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-sm sm:text-base"
            placeholder="닉네임"
          />
          {errors.nickname && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.nickname.message}
            </p>
          )}
        </div>

        {/* 이용약관 동의 */}
        <div className="w-full flex items-center gap-2">
          <input
            {...register("agree")}
            type="checkbox"
            className="h-3 w-3 sm:h-4 sm:w-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
          />
          <label className="text-gray-700 text-xs sm:text-sm font-['Lucida_Sans']">
            서비스 이용약관에 동의합니다.
          </label>
          {errors.agree && (
            <p className="text-red-500 text-xs sm:text-sm">
              {errors.agree.message}
            </p>
          )}
        </div>

        {/* 가입 버튼 */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-teal-500 text-white rounded-full font-['Lucida_Sans'] font-medium text-sm sm:text-base hover:bg-teal-600 transition-colors shadow-md hover:shadow-none"
        >
          가입
        </button>

        {/* 에러 메시지 */}
        {signupError && (
          <p className="text-red-500 text-xs sm:text-sm mt-2">{signupError}</p>
        )}

        {/* 로그인 링크 */}
        <p className="text-center text-gray-500 text-xs sm:text-sm font-['Lucida_Sans']">
          이미 계정이 있으신가요?{" "}
          <span
            className="text-teal-500 underline underline-offset-2 font-bold cursor-pointer"
            onClick={() => router.push("/login")}
          >
            로그인
          </span>
        </p>

        <div className="w-full flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-5">
          <button
            type="button"
            className="flex items-center justify-center gap-2 p-2 sm:p-3 rounded-full border-2 border-gray-500 shadow-lg hover:shadow-md transition-shadow font-['Lucida_Sans'] text-xs sm:text-sm"
          >
            <span>Google로 가입</span>
          </button>
        </div>
      </form>
    </div>
  );
}
