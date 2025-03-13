/*날씨 api 확인용*/
'use client'

import { useEffect, useState } from 'react'
import { getWeather } from 'src/lib/weather'

export default function WeatherPage() {
    const [city, setCity] = useState('Seoul')
    const [weather, setWeather] = useState<{ temperature: number; description: string; icon: string } | null>(null)

    useEffect(() => {
        async function fetchWeather() {
            const data = await getWeather(city)
            setWeather(data)
        }
        fetchWeather()
    }, [city])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4">현재 기온</h1>

            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="도시 이름을 입력하세요"
                className="p-2 border border-gray-300 rounded-md mb-4"
            />

            {weather ? (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <img src={weather.icon} alt="Weather icon" className="w-20 h-20 mx-auto" />
                    <h2 className="text-xl font-semibold">{city}</h2>
                    <p className="text-lg">{weather.temperature}°C</p>
                    <p className="text-gray-600">{weather.description}</p>
                </div>
            ) : (
                <p>날씨 정보를 가져오는 중...</p>
            )}
        </div>
    )
}
