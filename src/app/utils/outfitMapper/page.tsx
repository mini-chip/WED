"use client";
import { useEffect, useState } from "react";
import { getWeather, getWeatherByCoords } from "@/lib/weather";

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
  spring: [
    "얇은 스웨터 또는 맨투맨",
    "가디건",
    "청바지 또는 면바지",
    "스니커즈"
  ],
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
  const [weather, setWeather] = useState<any>(null); // 날씨 정보 저장
  const [city, setCity] = useState("Seoul"); // 초기값
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      setLoading(true);
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const weatherData = await getWeatherByCoords(latitude, longitude);
              if (weatherData) {
                setCity(weatherData.city); // 현재 위치의 도시 이름 설정
                setWeather(weatherData);
                setRecommendations(
                  await getOutfitRecommendations(weatherData.city)
                );
              } else {
                console.error("날씨 데이터를 가져오는 데 실패했습니다.");
                setRecommendations([]);
              }
            },
            (error) => {
              console.error("위치 정보를 가져오는 데 실패했습니다:", error);
              setRecommendations([]);
              fetchWeatherForCity("Seoul");
            }
          );
        } else {
          console.error("위치 지원이 불가합니다. Seoul로 설정됩니다.");
          fetchWeatherForCity("Seoul");
        }
      } catch (error) {
        console.error("날씨 정보를 가져오는 중 오류 발생:", error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    }
    async function fetchWeatherForCity(city: string) {
      try {
        const weatherData = await getWeather(city);
        if (weatherData) {
          setCity(weatherData.city);
          setWeather(weatherData);
          setRecommendations(await getOutfitRecommendations(weatherData.city));
        } else {
          console.error("날씨 데이터를 가져오는 데 실패했습니다.");
          setRecommendations([]);
        }
      } catch (error) {
        console.error("날씨 정보를 가져오는 중 오류 발생:", error);
        setRecommendations([]);
      }
    }
    fetchWeather();
  }, []);
  useEffect(() => {
    async function fetchOutfitRecommendations() {
      setLoading(true);
      try {
        const outfit = await getOutfitRecommendations(city);
        setRecommendations(outfit);
      } catch (error) {
        console.error("Error fetching outfit recommendations:", error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOutfitRecommendations();
  }, [city]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="[perspective:1000px]">
        <div className="relative w-[480px] h-[400px] transition-transform duration-1000 [transform-style:preserve-3d] hover:[transform:rotateY(180deg)]">
          <div className="absolute w-full h-full [backface-visibility:hidden] rounded-lg p-3 bg-gradient-to-r from-[rgb(183,255,177)] to-[rgb(200,245,138)] text-black">
            <h1 className="text-2xl font-bold mb-4">오늘의 옷차림 추천</h1>
            <p className="mb-2">현재 도시: {city}</p>
            <p className="mb-2">
              현재 기온: {weather ? `${weather.temperature}°C` : "정보 없음"}
            </p>

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
              위의 추천은 현재 날씨와 계절에 따라 달라질 수 있습니다. 항상
              날씨를 확인하고 적절한 옷차림을 선택하세요!
            </p>
          </div>
          <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-lg p-3 bg-gradient-to-r from-[rgb(200,245,138)] to-[rgb(183,255,177)] text-black">
            <h2 className="text-xl font-bold mb-4">PlayList 추천</h2>
            {/* 뒷면에 추가 콘텐츠를 넣을 수 있습니다 */}
          </div>
        </div>
      </div>
    </div>
  );
}
