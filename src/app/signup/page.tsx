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
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    const { email, password, nickname } = data;

    try {
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
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
          nickname: nickname,
        },
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
        <div className="w-20 h-20 sm:w-24 sm:h-24 relative">
          <Image src="/logo.png" alt="Logo" layout="fill" objectFit="contain" />
          <h2 className="text-center font-['Lucida_Sans'] text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6">
            회원가입
          </h2>
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

        {/* 소셜 로그인 버튼 */}
        <div className="w-full flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-5">
          <button
            type="button"
            className="flex items-center justify-center gap-2 p-2 sm:p-3 rounded-full bg-black text-white border-2 border-black shadow-lg hover:shadow-md transition-shadow font-['Lucida_Sans'] text-xs sm:text-sm"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth={0}
              className="text-base sm:text-lg"
              viewBox="0 0 1024 1024"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M747.4 535.7c-.4-68.2 30.5-119.6 92.9-157.5-34.9-50-87.7-77.5-157.3-82.8-65.9-5.2-138 38.4-164.4 38.4-27.9 0-91.7-36.6-141.9-36.6C273.1 298.8 163 379.8 163 544.6c0 48.7 8.9 99 26.7 150.8 23.8 68.2 109.6 235.3 199.1 232.6 46.8-1.1 79.9-33.2 140.8-33.2 59.1 0 89.7 33.2 141.9 33.2 90.3-1.3 167.9-153.2 190.5-221.6-121.1-57.1-114.6-167.2-114.6-170.7zm-105.1-305c50.7-60.2 46.1-115 44.6-134.7-44.8 2.6-96.6 30.5-126.1 64.8-32.5 36.8-51.6 82.3-47.5 133.6 48.4 3.7 92.6-21.2 129-63.7z" />
            </svg>
            <span>Apple로 가입</span>
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-2 p-2 sm:p-3 rounded-full border-2 border-gray-500 shadow-lg hover:shadow-md transition-shadow font-['Lucida_Sans'] text-xs sm:text-sm"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth={0}
              version="1.1"
              className="text-base sm:text-lg"
              viewBox="0 0 48 48"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
      	c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
      	c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
      	C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
      	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
      	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
            <span>Google로 가입</span>
          </button>
        </div>
      </form>
    </div>
  );
}
