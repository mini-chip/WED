"use client";
import { useEffect, useState } from "react";
import {
  getMultiDayWeather,
  getMultiDayWeatherByCoords,
  WeatherData
} from "@/lib/weather";
import { WeatherIcon } from "../weathericon/page";
import { MapPin, Thermometer, Droplets, Wind, Music } from "lucide-react";
import { LoadingSpinner } from "../loadingSpinner/page";

const outfitRecommendations: Record<string, string[]> = {
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

const playlistRecommendations: Record<
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
  if (description.includes("rain")) {
    return "from-slate-400 via-blue-500 to-slate-600";
  }
  if (temperature < 5) {
    return "from-blue-200 via-blue-300 to-indigo-400";
  }
  if (temperature < 15) {
    return "from-emerald-200 via-teal-300 to-cyan-400";
  }
  if (temperature < 25) {
    return "from-green-200 via-emerald-300 to-teal-400";
  }
  return "from-yellow-200 via-orange-300 to-pink-400";
}

export default function OutfitMapperPage() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [city, setCity] = useState("Seoul");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const currentWeather = weatherData[selectedDayIndex];
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
    // useEffect(() => {
    //   let watchId: number;
    //   const timeoutId = setTimeout(() => {
    //     if (loading) {
    //       setError("로딩 시간이 초과되었습니다.");
    //       setLoading(false);
    //     }
    //   }, 10000); // 10초 타임아웃

    //   const fetchWeather = () => {
    //     if (!navigator.geolocation) {
    //       setError("위치 정보를 지원하지 않는 브라우저입니다.");
    //       fallbackToSeoul();
    //       return;
    //     }

    //     watchId = navigator.geolocation.getCurrentPosition(
    //       async (position) => {
    //         const { latitude, longitude } = position.coords;
    //         try {
    //           const data = await getMultiDayWeatherByCoords(latitude, longitude);
    //           if (!data || data.length === 0) {
    //             throw new Error("날씨 데이터를 가져오지 못했습니다.");
    //           }
    //           setWeatherData(data);
    //           setError(null);
    //         } catch (err) {
    //           setError(
    //             err instanceof Error
    //               ? err.message
    //               : "날씨 데이터를 가져오는 중 오류가 발생했습니다."
    //           );
    //           fallbackToSeoul();
    //         } finally {
    //           setLoading(false);
    //           clearTimeout(timeoutId);
    //         }
    //       },
    //       (err) => {
    //         setError(`위치 정보 오류: ${err.message}`);
    //         fallbackToSeoul();
    //       },
    //       { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    //     );
    //   };

  //   const fallbackToSeoul = async () => {
  //     try {
  //       const data = await getMultiDayWeather("Seoul");
  //       setWeatherData(data);
  //       setError("기본 위치(서울)로 날씨를 표시합니다.");
  //     } catch (err) {
  //       setError("서울 날씨를 가져오는 데 실패했습니다.");
  //     } finally {
  //       setLoading(false);
  //       clearTimeout(timeoutId);
  //     }
  //   };

  //   fetchWeather();

  //   return () => {
  //     if (watchId !== undefined) {
  //       navigator.geolocation.clearWatch(watchId);
  //     }
  //     clearTimeout(timeoutId);
  //   };
  // }, []);

  // const currentWeather = weatherData[selectedDayIndex];
  // const outfitCategory = currentWeather
  //   ? getOutfitCategory(currentWeather.temperature, currentWeather.description)
  //   : "mild";
  // const playlistCategory = currentWeather
  //   ? getPlaylistCategory(
  //       currentWeather.temperature,
  //       currentWeather.description
  //     )
  //   : "sunny";
  // const gradientClass = currentWeather
  //   ? getGradientByWeather(
  //       currentWeather.description,
  //       currentWeather.temperature
  //     )
  //   : "from-green-200 via-emerald-300 to-teal-400";

  // const handleDayClick = (index: number) => {
  //   setSelectedDayIndex(index);
  //   setIsFlipped(false);
  // };
  // console.log(weatherData);
  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
  //       <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
  //         <LoadingSpinner size="lg" color="text-blue-600" />
  //         <p className="mt-4 text-gray-600 text-center">
  //           날씨 정보를 가져오는 중...
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center">
  //       <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl text-center">
  //         <p className="text-red-600 mb-4">오류: {error}</p>
  //         <button
  //           onClick={() => window.location.reload()}
  //           className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
  //         >
  //           다시 시도
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

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
    <div
      className={`min-h-screen bg-gradient-to-br ${gradientClass} flex items-center justify-center p-4`}
    >
      <div className="flex items-center gap-4 max-w-6xl w-full">
        {/* Main Weather Card */}
        <div className="flex-shrink-0">
          <div className="[perspective:1000px]">
            <div
              className={`relative w-80 h-[700px] transition-transform duration-700 [transform-style:preserve-3d] cursor-pointer ${
                isFlipped ? "[transform:rotateY(180deg)]" : ""
              }`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* Front Face - Outfit Recommendations */}
              <div className="absolute w-full h-full [backface-visibility:hidden] bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                      오늘의 옷차림
                    </h1>
                    <div className="text-right">
                      <WeatherIcon
                        condition={currentWeather?.description || "sunny"}
                        size={32}
                        aria-label={currentWeather?.description || "맑음"}
                      />
                    </div>
                  </div>

                  {currentWeather && (
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center text-gray-600">
                        <MapPin size={16} className="mr-2" aria-label="위치" />
                        <span className="text-sm">
                          {currentWeather.city}, {currentWeather.country}
                        </span>
                      </div>

                      <div className="text-center mb-2">
                        <p className="text-lg font-semibold text-gray-700">
                          {currentWeather.dayName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {currentWeather.date}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-white/60 rounded-lg p-3">
                          <Thermometer
                            size={16}
                            className={`mx-auto mb-1 ${getTemperatureColor(
                              currentWeather.temperature
                            )}`}
                            aria-label="기온"
                          />
                          <p
                            className={`text-lg font-semibold ${getTemperatureColor(
                              currentWeather.temperature
                            )}`}
                          >
                            {currentWeather.temperature}°C
                          </p>
                          <p className="text-xs text-gray-500">기온</p>
                        </div>

                        <div className="bg-white/60 rounded-lg p-3">
                          <Droplets
                            size={16}
                            className="mx-auto mb-1 text-blue-500"
                            aria-label="습도"
                          />
                          <p className="text-lg font-semibold text-blue-600">
                            {currentWeather.humidity}%
                          </p>
                          <p className="text-xs text-gray-500">습도</p>
                        </div>

                        <div className="bg-white/60 rounded-lg p-3">
                          <Wind
                            size={16}
                            className="mx-auto mb-1 text-gray-500"
                            aria-label="바람"
                          />
                          <p className="text-lg font-semibold text-gray-600">
                            {currentWeather.windSpeed}km/h
                          </p>
                          <p className="text-xs text-gray-500">바람</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      추천 옷차림:
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
                      탭하여 플레이리스트 추천 보기 →
                    </p>
                  </div>
                </div>
              </div>

              {/* Back Face - Playlist Recommendations */}
              <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                      <Music className="mr-2" size={24} aria-label="음악" />
                      플레이리스트
                    </h2>
                    <div className="text-right">
                      <WeatherIcon
                        condition={currentWeather?.description || "sunny"}
                        size={32}
                        aria-label={currentWeather?.description || "맑음"}
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {playlistRecommendations[playlistCategory].title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {currentWeather?.description} 날씨에 어울리는 음악
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
                      ← 탭하여 옷차림 추천 보기
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Weather Cards */}
        <div className="flex flex-col gap-4">
          {weatherData.map((weather, index) => {
            if (index === selectedDayIndex) return null; // Don't show the selected day in the side cards

            const isActive = index === selectedDayIndex;
            const cardGradient = getGradientByWeather(
              weather.description,
              weather.temperature
            );

            return (
              <div
                key={index}
                className={`transition-all duration-500 cursor-pointer transform hover:scale-105 ${
                  isActive
                    ? "scale-100 opacity-100"
                    : "scale-75 opacity-60 hover:opacity-80"
                }`}
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
                      <WeatherIcon
                        condition={weather.description}
                        size={40}
                        aria-label={weather.description}
                      />
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
                          aria-label="습도"
                        />
                        <p className="text-sm font-semibold text-blue-600">
                          {weather.humidity}%
                        </p>
                      </div>

                      <div className="bg-white/60 rounded-lg p-2">
                        <Wind
                          size={14}
                          className="mx-auto mb-1 text-gray-500"
                          aria-label="바람"
                        />
                        <p className="text-sm font-semibold text-gray-600">
                          {weather.windSpeed}km/h
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 text-center">
                      <p className="text-xs text-gray-500">
                        클릭하여 자세히 보기
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <p className="text-white/80 text-sm text-center">
          날씨 기반 추천 서비스 • 실시간 업데이트
        </p>
      </div>
    </div>
  );
}
