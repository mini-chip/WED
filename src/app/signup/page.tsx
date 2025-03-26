"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Logo from "@/images/logo.svg";
import Button from "@/component/button/page";
const signupSchema = z
  .object({
    email: z.string().email("유효한 이메일을 입력해주세요."),
    username: z.string().min(3, "아이디는 최소 3자 이상이어야 합니다."),
    password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
    confirmPassword: z.string(),
    nickname: z.string().min(2, "닉네임은 최소 2자 이상이어야 합니다.")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"]
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const { email, username, password, nickname } = data;
      const { data: userData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username, nickname }
        }
      });

      if (error) {
        console.error("회원가입 에러:", error.message);
        alert(`회원가입 실패: ${error.message}`);
        return;
      }

      console.log("회원가입 성공:", userData);
      alert("회원가입이 완료되었습니다!");
      router.push("/");
    } catch (err) {
      console.error("다시 시도해주세요:", err);
      alert("회원가입 중 문제가 발생했습니다.");
    }
  };

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
    <div className="flex flex-col items-center min-h-screen p-4">
      <Logo width={100} height={100} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-full max-w-xs"
      >
        <input
          type="email"
          placeholder="이메일"
          {...register("email")}
          className="p-2 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <input
          type="text"
          placeholder="아이디"
          {...register("username")}
          className="p-2 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username.message}</p>
        )}

        <input
          type="password"
          placeholder="비밀번호"
          {...register("password")}
          className="p-2 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        <input
          type="password"
          placeholder="비밀번호 확인"
          {...register("confirmPassword")}
          className="p-2 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}

        <input
          type="text"
          placeholder="닉네임"
          {...register("nickname")}
          className="p-2 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.nickname && (
          <p className="text-red-500 text-sm">{errors.nickname.message}</p>
        )}

        <Button type="submit" className="bg-green-500 hover:text-green-500">
          가입
        </Button>

        <p className="text-center text-gray-600">
          이미 계정이 있으신가요?{" "}
          <a href="/signin" className="text-blue-500 hover:underline">
            로그인
          </a>
        </p>

        <Button
          type="button"
          onClick={handleGoogleSignUp}
          className="p-2 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition-colors"
        >
          Google로 가입
        </Button>
      </form>
    </div>
  );
}
