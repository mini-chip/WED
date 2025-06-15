import axios from "axios";
import { useState } from "react";
const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

/**

 * @param city - 검색할 도시 이름 (예: "Seoul", "New York")
 * @returns 기온, 날씨 설명, 아이콘 URL 반환
 */
export async function getWeather(city: string) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    return {
      city: data.name, // 도시 이름
      temperature: data.main.temp, // 현재 기온 (섭씨)
      description: data.weather[0].description, // 날씨 설명
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png` // 날씨 아이콘
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
}

/**
 * 사용자의 현재 위치 기반으로 날씨 데이터를 가져오는 함수 (위도, 경도 사용)
 * @param lat - 위도
 * @param lon - 경도
 * @returns 기온, 날씨 설명, 아이콘 URL 반환
 */
export async function getWeatherByCoords(lat: number, lon: number) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    return {
      city: data.name,
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
}

export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  date: string;
  dayName: string;
}
interface ForecastItem {
  dt: number;
  dt_txt: string;
  main: { temp: number; humidity: number };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
}

// 한국어 요일 및 날짜 포맷팅 함수
function formatKoreanDate(dateOffset: number = 0): {
  date: string;
  dayName: string;
} {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + dateOffset);

  const dayNames = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일"
  ];
  const dayName = dayNames[targetDate.getDay()];

  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();
  const date = `${month}월 ${day}일`;

  return { date, dayName };
}

export async function getMultiDayWeather(city: string): Promise<WeatherData[]> {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  try {
    const response = await axios.get(url);
    const data = response.data;

    // 5일 예보 데이터에서 매일 12:00:00 데이터만 추출 (3일치로 제한)
    const dailyData = data.list
      .filter((item: any) => item.dt_txt.includes("12:00:00"))
      .slice(0, 3);

    const weatherData: WeatherData[] = dailyData.map((day: any) => {
      const date = new Date(day.dt * 1000); // UNIX 타임스탬프를 날짜로 변환
      const dayNames = [
        "일요일",
        "월요일",
        "화요일",
        "수요일",
        "목요일",
        "금요일",
        "토요일"
      ];
      const dayName = dayNames[date.getDay()];
      const month = date.getMonth() + 1;
      const dayOfMonth = date.getDate();
      const formattedDate = `${month}월 ${dayOfMonth}일`;

      return {
        city: data.city.name,
        country: data.city.country,
        temperature: Math.round(day.main.temp),
        description: day.weather[0].description,
        humidity: day.main.humidity,
        windSpeed: day.wind.speed,
        icon: `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`,
        date: formattedDate,
        dayName: dayName
      };
    });

    return weatherData;
  } catch (error) {
    console.error("Error fetching multi-day weather:", error);
    return [];
  }
}

export async function getMultiDayWeatherByCoords(
  lat: number,
  lon: number
): Promise<WeatherData[]> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For demo, generate 3 days of weather data
    const baseTemp = Math.floor(Math.random() * 20) + 10;
    const descriptions = ["sunny", "cloudy", "partly cloudy", "rainy"];

    return Array.from({ length: 3 }, (_, index) => {
      const dateFormat = formatKoreanDate(index);
      return {
        city: "현재 위치",
        country: "Local",
        temperature: baseTemp + Math.floor(Math.random() * 10) - 5,
        description:
          descriptions[Math.floor(Math.random() * descriptions.length)],
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        icon: "partly-cloudy",
        ...dateFormat
      };
    });
  } catch (error) {
    console.error("Error fetching multi-day weather by coordinates:", error);
    return [];
  }
}
