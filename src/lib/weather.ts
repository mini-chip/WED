import axios from "axios";

const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

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

// 통합된 현재 날씨 데이터 함수
export async function getCurrentWeather({
  city,
  lat,
  lon
}: {
  city?: string;
  lat?: number;
  lon?: number;
}) {
  let url: string;

  if (city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  } else if (lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  } else {
    throw new Error("도시 이름 또는 좌표를 제공해야 합니다.");
  }

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

// 5일 예보 데이터 함수
export async function getMultiDayWeather({
  city,
  lat,
  lon
}: {
  city?: string;
  lat?: number;
  lon?: number;
}): Promise<WeatherData[]> {
  let url: string;

  if (city) {
    url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  } else if (lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  } else {
    throw new Error("도시 이름 또는 좌표를 제공해야 합니다.");
  }

  try {
    const response = await axios.get(url);
    const data = response.data;

    // 5일 예보 데이터에서 매일 12:00:00 데이터만 추출 (3일치로 제한)
    const dailyData = data.list
      .filter((item: any) => item.dt_txt.includes("12:00:00"))
      .slice(0, 5);

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
