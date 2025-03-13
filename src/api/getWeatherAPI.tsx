'use client';

import { useEffect, useState } from 'react';
import { getWeather, getWeatherByCoords } from '@/lib/weather';

export default function WeatherPage() {
    const [city, setCity] = useState("Seoul"); // 기본값: 서울
    const [weather, setWeather] = useState<{ temperature: number; description: string; icon: string } | null>(null);
    const [useLocation, setUseLocation] = useState(false); // 위치 정보 사용 여부

    useEffect(() => {
        async function fetchWeather() {
            if (useLocation && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords;
                    const data = await getWeatherByCoords(latitude, longitude);
                    setWeather(data);
                }, (error) => {
                    console.error("Geolocation error:", error);
                    setUseLocation(false);
                });
            } else {
                const
