"use client";
import { useEffect, useState } from "react";
import { getCurrentWeather, getMultiDayWeather } from "@/lib/weather";
import { WeatherIcon } from "../WeatherIcon";
import {
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Music,
  Clock
} from "lucide-react";
import { LoadingSpinner } from "../LoadingSpinner";

// WeatherData 타입 정의
interface WeatherData {
  city: string;
  country: string;
  date: string;
  dayName: string;
  description: string;
  humidity: number;
  temperature: number;
  windSpeed: number;
}

// CurrentWeatherData 타입 정의
interface CurrentWeatherData {
  city: string;
  temperature: number;
  description: string;
  icon: string;
}

const outfitRecommendationsKo: Record<string, string[]> = {
  winter: [
    "두꺼운 패딩이나 코트",
    "보온 내의",
    "울 스웨터나 후드티",
    "방한 부츠",
    "따뜻한 모자와 장갑",
    "목도리로 보온 강화"
  ],
  cold: [
    "가벼운 재킷이나 바람막이",
    "긴팔 셔츠",
    "청바지나 따뜻한 바지",
    "운동화나 단화",
    "가벼운 목도리 (선택사항)"
  ],
  mild: [
    "가디건이나 얇은 스웨터",
    "티셔츠나 블라우스",
    "편안한 바지",
    "운동화나 캐주얼 신발"
  ],
  warm: [
    "가벼운 티셔츠나 탱크톱",
    "반바지나 얇은 바지",
    "샌들이나 통기성 좋은 신발",
    "선글라스",
    "햇빛 차단용 모자"
  ],
  hot: [
    "가볍고 통기성 좋은 옷",
    "반바지와 티셔츠",
    "샌들이나 슬리퍼",
    "햇빛 차단 모자",
    "자외선 차단제 (필수!)"
  ]
};

// 영어 추천 데이터
const outfitRecommendationsEn: Record<string, string[]> = {
  winter: [
    "Heavy padded jacket or coat",
    "Thermal underwear",
    "Wool sweater or hoodie",
    "Winter boots",
    "Warm hat and gloves",
    "Scarf for extra warmth"
  ],
  cold: [
    "Light jacket or windbreaker",
    "Long-sleeve shirt",
    "Jeans or warm pants",
    "Sneakers or casual shoes",
    "Light scarf (optional)"
  ],
  mild: [
    "Cardigan or light sweater",
    "T-shirt or blouse",
    "Comfortable pants",
    "Sneakers or casual shoes"
  ],
  warm: [
    "Light T-shirt or tank top",
    "Shorts or light pants",
    "Sandals or breathable shoes",
    "Sunglasses",
    "Sun hat"
  ],
  hot: [
    "Light and breathable clothing",
    "Shorts and T-shirt",
    "Sandals or flip-flops",
    "Sun hat",
    "Sunscreen (essential!)"
  ]
};

// 한국어 플레이리스트 데이터
const playlistRecommendationsKo: Record<
  string,
  { title: string; songs: string[] }
> = {
  sunny: {
    title: "☀️ 맑은 날 기분 좋은 음악",
    songs: [
      "Good 4 U - Olivia Rodrigo",
      "Blinding Lights - The Weeknd",
      "Levitating - Dua Lipa",
      "Heat Waves - Glass Animals",
      "As It Was - Harry Styles"
    ]
  },
  cloudy: {
    title: "☁️ 흐린 날 차분한 음악",
    songs: [
      "Lovely - Billie Eilish",
      "Skinny Love - Bon Iver",
      "Mad World - Gary Jules",
      "The Night We Met - Lord Huron",
      "Someone Like You - Adele"
    ]
  },
  rainy: {
    title: "🌧️ 비 오는 날 감성 음악",
    songs: [
      "Rainy Days and Mondays - The Carpenters",
      "Purple Rain - Prince",
      "Umbrella - Rihanna",
      "I Can See Clearly Now - Johnny Nash",
      "Rain on Me - Lady Gaga & Ariana Grande"
    ]
  },
  cold: {
    title: "❄️ 추운 날 따뜻한 음악",
    songs: [
      "Sweater Weather - The Neighbourhood",
      "Winter Song - Sara Bareilles",
      "Let It Snow - Frank Sinatra",
      "Baby It's Cold Outside - Various",
      "Fireplace - LANY"
    ]
  }
};

// 영어 플레이리스트 데이터
const playlistRecommendationsEn: Record<
  string,
  { title: string; songs: string[] }
> = {
  sunny: {
    title: "☀️ Sunny Day Vibes",
    songs: [
      "Good 4 U - Olivia Rodrigo",
      "Blinding Lights - The Weeknd",
      "Levitating - Dua Lipa",
      "Heat Waves - Glass Animals",
      "As It Was - Harry Styles"
    ]
  },
  cloudy: {
    title: "☁️ Cloudy Day Chill",
    songs: [
      "Lovely - Billie Eilish",
      "Skinny Love - Bon Iver",
      "Mad World - Gary Jules",
      "The Night We Met - Lord Huron",
      "Someone Like You - Adele"
    ]
  },
  rainy: {
    title: "🌧️ Rainy Day Mood",
    songs: [
      "Rainy Days and Mondays - The Carpenters",
      "Purple Rain - Prince",
      "Umbrella - Rihanna",
      "I Can See Clearly Now - Johnny Nash",
      "Rain on Me - Lady Gaga & Ariana Grande"
    ]
  },
  cold: {
    title: "❄️ Cold Day Warmth",
    songs: [
      "Sweater Weather - The Neighbourhood",
      "Winter Song - Sara Bareilles",
      "Let It Snow - Frank Sinatra",
      "Baby It's Cold Outside - Various",
      "Fireplace - LANY"
    ]
  }
};

function getOutfitCategory(temperature: number, description: string): string {
  if (temperature < 0) return "winter";
  if (temperature < 10) return "cold";
  if (temperature < 20) return "mild";
  if (temperature < 28) return "warm";
  return "hot";
}

function getPlaylistCategory(temperature: number, description: string): string {
  if (description.includes("rain")) return "rainy";
  if (temperature < 10) return "cold";
  if (description.includes("cloud")) return "cloudy";
  return "sunny";
}

function getTemperatureColor(temp: number): string {
  if (temp < 0) return "text-blue-600";
  if (temp < 10) return "text-blue-400";
  if (temp < 20) return "text-green-500";
  if (temp < 28) return "text-yellow-500";
  return "text-red-500";
}

function getGradientByWeather(
  description: string,
  temperature: number
): string {
  if (!description || temperature === undefined) {
    return "from-gray-200 via-gray-300 to-gray-400"; // 기본 그라디언트
  }
  if (description.includes("rain"))
    return "from-slate-400 via-blue-500 to-slate-600";
  if (description.includes("snow"))
    return "from-white via-gray-100 to-blue-200";
  if (temperature < 5) return "from-blue-200 via-blue-300 to-indigo-400";
  if (temperature < 15) return "from-emerald-200 via-teal-300 to-cyan-400";
  if (temperature < 25) return "from-green-200 via-emerald-300 to-teal-400";
  return "from-yellow-200 via-orange-300 to-pink-400";
}

function formatDate(date: Date, language: string): string {
  return date.toLocaleDateString(language === "ko" ? "ko-KR" : "en-US", {
    month: "long",
    day: "numeric",
    weekday: "long"
  });
}

export default function OutfitMapperPage() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [currentWeather, setCurrentWeather] =
    useState<CurrentWeatherData | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [language, setLanguage] = useState<"ko" | "en">("ko");

  useEffect(() => {
    async function fetchWeather() {
      setLoading(true);
      setError(null);
      try {
        const langParam = language === "ko" ? "ko" : "en";
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const forecastData = await getMultiDayWeather({
                lat: latitude,
                lon: longitude,
                lang: langParam
              });
              const currentData = await getCurrentWeather({
                lat: latitude,
                lon: longitude,
                lang: langParam
              });
              if (forecastData && forecastData.length > 0 && currentData) {
                setWeatherData(forecastData);
                setCurrentWeather(currentData);
              } else {
                throw new Error(
                  language === "ko"
                    ? "날씨 데이터를 가져오는데 실패했습니다"
                    : "Failed to fetch weather data"
                );
              }
            },
            async (geoError) => {
              console.error("Geolocation 오류:", geoError.message);
              const forecastData = await getMultiDayWeather({
                city: "Seoul",
                lang: langParam
              });
              const currentData = await getCurrentWeather({
                city: "Seoul",
                lang: langParam
              });
              if (forecastData && forecastData.length > 0 && currentData) {
                setWeatherData(forecastData);
                setCurrentWeather(currentData);
              } else {
                throw new Error(
                  language === "ko"
                    ? "날씨 데이터를 가져오는데 실패했습니다"
                    : "Failed to fetch weather data"
                );
              }
            },
            { timeout: 10000 }
          );
        } else {
          const forecastData = await getMultiDayWeather({
            city: "Seoul",
            lang: langParam
          });
          const currentData = await getCurrentWeather({
            city: "Seoul",
            lang: langParam
          });
          if (forecastData && forecastData.length > 0 && currentData) {
            setWeatherData(forecastData);
            setCurrentWeather(currentData);
          } else {
            throw new Error(
              language === "ko"
                ? "날씨 데이터를 가져오는데 실패했습니다"
                : "Failed to fetch weather data"
            );
          }
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : language === "ko"
            ? "오류가 발생했습니다"
            : "An error occurred"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, [language]);

  const displayWeather: WeatherData =
    currentWeather && selectedDayIndex === -1
      ? {
          city: currentWeather.city,
          country: language === "ko" ? "현재" : "Current",
          temperature: currentWeather.temperature,
          description: currentWeather.description,
          humidity: 0,
          windSpeed: 0,
          date: language === "ko" ? "지금" : "Now",
          dayName: language === "ko" ? "현재" : "Current"
        }
      : weatherData[selectedDayIndex] || {
          city: "Unknown",
          country: "Unknown",
          temperature: 0,
          description: "No data",
          humidity: 0,
          windSpeed: 0,
          date: "N/A",
          dayName: "N/A"
        };

  const outfitCategory = getOutfitCategory(
    displayWeather.temperature,
    displayWeather.description
  );
  const playlistCategory = getPlaylistCategory(
    displayWeather.temperature,
    displayWeather.description
  );
  const gradientClass = getGradientByWeather(
    displayWeather.description,
    displayWeather.temperature
  );
  const outfitRecommendations =
    language === "ko" ? outfitRecommendationsKo : outfitRecommendationsEn;
  const playlistRecommendations =
    language === "ko" ? playlistRecommendationsKo : playlistRecommendationsEn;

  const handleDayClick = (index: number) => {
    setSelectedDayIndex(index);
    setIsFlipped(false);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "ko" ? "en" : "ko"));
  };
  console.log("displayWeather", displayWeather);
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <LoadingSpinner size="lg" color="text-blue-600" />
          <p className="mt-4 text-gray-600 text-center">
            {language === "ko"
              ? "날씨 정보를 가져오는 중..."
              : "Loading weather data..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl text-center">
          <p className="text-red-600 mb-4">
            {language === "ko" ? "오류:" : "Error:"} {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            {language === "ko" ? "다시 시도" : "Try again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${gradientClass} flex items-center justify-center p-4`}
    >
      <div className="flex items-center gap-4 max-w-6xl w-full">
        <div className="flex-shrink-0">
          <div className="[perspective:1000px]">
            <div
              className={`relative w-80 h-[700px] transition-transform duration-700 [transform-style:preserve-3d] cursor-pointer ${
                isFlipped ? "[transform:rotateY(180deg)]" : ""
              }`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className="absolute w-full h-full [backface-visibility:hidden] bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                      {language === "ko" ? "오늘의 옷차림" : "Today's Outfit"}
                    </h1>
                    <WeatherIcon
                      condition={displayWeather.description || "sunny"}
                      size={32}
                    />
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center text-gray-600">
                      <MapPin size={16} className="mr-2" />
                      <span className="text-sm">
                        {displayWeather.city}, {displayWeather.country}
                      </span>
                    </div>
                    <div className="text-center mb-2">
                      <p className="text-lg font-semibold text-gray-700">
                        {displayWeather.dayName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {displayWeather.date}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-white/60 rounded-lg p-3">
                        <Thermometer
                          size={16}
                          className={`mx-auto mb-1 ${getTemperatureColor(
                            displayWeather.temperature
                          )}`}
                        />
                        <p
                          className={`text-lg font-semibold ${getTemperatureColor(
                            displayWeather.temperature
                          )}`}
                        >
                          {displayWeather.temperature}°C
                        </p>
                        <p className="text-xs text-gray-500">
                          {language === "ko" ? "기온" : "Temperature"}
                        </p>
                      </div>
                      {displayWeather.humidity > 0 && (
                        <div className="bg-white/60 rounded-lg p-3">
                          <Droplets
                            size={16}
                            className="mx-auto mb-1 text-blue-500"
                          />
                          <p className="text-lg font-semibold text-blue-600">
                            {displayWeather.humidity}%
                          </p>
                          <p className="text-xs text-gray-500">
                            {language === "ko" ? "습도" : "Humidity"}
                          </p>
                        </div>
                      )}
                      {displayWeather.windSpeed > 0 && (
                        <div className="bg-white/60 rounded-lg p-3">
                          <Wind
                            size={16}
                            className="mx-auto mb-1 text-gray-500"
                          />
                          <p className="text-lg font-semibold text-gray-600">
                            {displayWeather.windSpeed}km/h
                          </p>
                          <p className="text-xs text-gray-500">
                            {language === "ko" ? "바람" : "Wind"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      {language === "ko"
                        ? "추천 옷차림:"
                        : "Recommended Outfit:"}
                    </h3>
                    <div className="space-y-2">
                      {outfitRecommendations[outfitCategory].map(
                        (item, index) => (
                          <div
                            key={index}
                            className="bg-white/70 rounded-lg p-3 text-sm text-gray-700 transform hover:scale-105 transition-transform duration-200"
                          >
                            • {item}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-xs text-gray-500">
                      {language === "ko"
                        ? "탭하여 플레이리스트 추천 보기 →"
                        : "Tap to see playlist recommendations →"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                      <Music className="mr-2" size={24} />
                      {language === "ko" ? "플레이리스트" : "Playlist"}
                    </h2>
                    <WeatherIcon
                      condition={displayWeather.description || "sunny"}
                      size={32}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {playlistRecommendations[playlistCategory].title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {displayWeather.description}{" "}
                        {language === "ko"
                          ? "날씨에 어울리는 음악"
                          : "music for the weather"}
                      </p>
                    </div>
                    <div className="space-y-3">
                      {playlistRecommendations[playlistCategory].songs.map(
                        (song, index) => (
                          <div
                            key={index}
                            className="bg-white/70 rounded-lg p-3 flex items-center hover:bg-white/90 transition-colors duration-200"
                          >
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                              {index + 1}
                            </div>
                            <span className="text-sm text-gray-700">
                              {song}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-xs text-gray-500">
                      {language === "ko"
                        ? "← 탭하여 옷차림 추천 보기"
                        : "← Tap to see outfit recommendations"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-4 overflow-x-auto">
          {currentWeather && (
            <div
              className={`transition-all duration-500 cursor-pointer transform ${
                selectedDayIndex === -1
                  ? "scale-100 opacity-100"
                  : "scale-75 opacity-60 hover:scale-105 hover:opacity-80"
              } flex-shrink-0`}
              onClick={() => handleDayClick(-1)}
            >
              <div
                className={`w-60 h-96 bg-gradient-to-br ${getGradientByWeather(
                  currentWeather.description,
                  currentWeather.temperature
                )} rounded-xl p-4 shadow-lg`}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 h-full">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {language === "ko" ? "현재" : "Current"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {language === "ko" ? "지금" : "Now"}
                    </p>
                  </div>
                  <div className="flex justify-center mb-4">
                    <WeatherIcon
                      condition={currentWeather.description}
                      size={40}
                    />
                  </div>
                  <div className="text-center mb-4">
                    <p
                      className={`text-3xl font-bold ${getTemperatureColor(
                        currentWeather.temperature
                      )}`}
                    >
                      {currentWeather.temperature}°C
                    </p>
                    <p className="text-sm text-gray-600 capitalize">
                      {currentWeather.description}
                    </p>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-xs text-gray-500">
                      {language === "ko"
                        ? "클릭하여 자세히 보기"
                        : "Click for details"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {weatherData.map((weather, index) => {
            if (index === selectedDayIndex) return null;
            const cardGradient = getGradientByWeather(
              weather.description,
              weather.temperature
            );
            return (
              <div
                key={index}
                className="transition-all duration-500 cursor-pointer transform scale-75 opacity-60 hover:scale-105 hover:opacity-80 flex-shrink-0"
                onClick={() => handleDayClick(index)}
              >
                <div
                  className={`w-60 h-96 bg-gradient-to-br ${cardGradient} rounded-xl p-4 shadow-lg`}
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 h-full">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {weather.dayName}
                      </h3>
                      <p className="text-sm text-gray-600">{weather.date}</p>
                    </div>
                    <div className="flex justify-center mb-4">
                      <WeatherIcon condition={weather.description} size={40} />
                    </div>
                    <div className="text-center mb-4">
                      <p
                        className={`text-3xl font-bold ${getTemperatureColor(
                          weather.temperature
                        )}`}
                      >
                        {weather.temperature}°C
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        {weather.description}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-white/60 rounded-lg p-2">
                        <Droplets
                          size={14}
                          className="mx-auto mb-1 text-blue-500"
                        />
                        <p className="text-sm font-semibold text-blue-600">
                          {weather.humidity}%
                        </p>
                      </div>
                      <div className="bg-white/60 rounded-lg p-2">
                        <Wind
                          size={14}
                          className="mx-auto mb-1 text-gray-500"
                        />
                        <p className="text-sm font-semibold text-gray-600">
                          {weather.windSpeed}km/h
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-xs text-gray-500">
                        {language === "ko"
                          ? "클릭하여 자세히 보기"
                          : "Click for details"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
        <p className="text-black text-sm text-center">
          {language === "ko"
            ? "날씨 기반 추천 서비스"
            : "Weather-based Recommendation Service"}
        </p>
        <button
          onClick={toggleLanguage}
          className="px-4 py-2 bg-white/30 text-sm font-medium text-black rounded-full shadow-md hover:bg-white/50 transition"
        >
          {language === "ko" ? "English" : "한국어"}
        </button>
      </div>
    </div>
  );
}
