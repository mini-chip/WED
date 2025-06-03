"use client";
import { useEffect, useState } from "react";
import { getWeather } from "@/lib/weather";

// 옷차림 추천 객체 (컴포넌트 외부에 정의)
const outfitRecommendations: Record<string, string[]> = {
  winter: [
    "Heavy coat",
    "Thermal sweater",
    "Wool scarf",
    "Insulated boots",
    "Warm hat"
  ],
  autumn: [
    "Light jacket",
    "Long-sleeve shirt",
    "Jeans",
    "Ankle boots",
    "Beanie"
  ],
  spring: ["Light sweater", "Cardigan", "Chinos", "Sneakers", "Light scarf"],
  summer: ["T-shirt", "Shorts", "Sandals", "Sunglasses", "Cap"],
  casual: ["Comfortable jeans", "Casual shirt or blouse", "Sneakers or loafers"]
};

// 비동기 함수로 날씨 데이터를 기반으로 옷차림 추천 반환
async function getOutfitRecommendations(city: string) {
  const weatherData = await getWeather(city);

  if (!weatherData) {
    throw new Error("Failed to fetch weather data");
  }

  const { temperature, description } = weatherData;

  let outfitType = "casual"; // 기본값

  if (temperature < 0) {
    outfitType = "winter";
  } else if (temperature >= 0 && temperature < 15) {
    outfitType = "autumn";
  } else if (temperature >= 15 && temperature < 25) {
    outfitType = "spring";
  } else if (temperature >= 25) {
    outfitType = "summer";
  }

  // 날씨 설명에 따라 추가적인 추천
  if (description.includes("rain")) {
    outfitType = "casual"; // 비 오는 날은 캐주얼 추천
  } else if (description.includes("snow")) {
    outfitType = "winter"; // 눈 오는 날은 겨울 옷 추천
  }

  return outfitRecommendations[outfitType];
}

export default function OutfitMapperPage() {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [city, setCity] = useState("Seoul"); // 예시 도시
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOutfitRecommendations() {
      setLoading(true);
      try {
        const outfit = await getOutfitRecommendations(city);
        setRecommendations(outfit);
      } catch (error) {
        console.error("Error fetching outfit recommendations:", error);
        setRecommendations([]); // 오류 시 빈 배열 설정
      } finally {
        setLoading(false);
      }
    }

    fetchOutfitRecommendations();
  }, [city]); // city가 변경될 때마다 데이터를 다시 가져옴

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">오늘의 옷차림 추천</h1>
      <p className="mb-2">현재 도시: {city}</p>

      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <>
          <p className="mb-2">추천 옷차림:</p>
          {recommendations.length > 0 ? (
            <ul className="list-disc pl-5">
              {recommendations.map((item, index) => (
                <li key={index} className="mb-1">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p>옷차림 추천 정보를 불러오지 못했습니다.</p>
          )}
        </>
      )}

      <p className="mt-4 text-gray-600">
        위의 추천은 현재 날씨와 계절에 따라 달라질 수 있습니다. 항상 날씨를
        확인하고 적절한 옷차림을 선택하세요!
      </p>
    </div>
  );
}
