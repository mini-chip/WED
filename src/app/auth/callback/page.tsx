"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const {
          data: { session },
          error
        } = await supabase.auth.getSession();

        if (error) {
          setError("세션 확인 중 에러가 발생했습니다.");
          console.error("세션 확인 에러:", error.message);
          return;
        }

        if (session) {
          router.push("/");
        } else {
          setError("로그인에 실패했습니다. 다시 시도해주세요.");
          setTimeout(() => {
            router.push("/signin");
          }, 2000);
        }
      } catch (err) {
        setError("예상치 못한 에러가 발생했습니다.");
        console.error("AuthCallback 에러:", err);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p>로그인 중입니다..</p>
      )}
    </div>
  );
}
