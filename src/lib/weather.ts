import axios from 'axios'

const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY
if (!apiKey) throw new Error('Weather API key is missing')

/**

 * @param city - 검색할 도시 이름 (예: "Seoul", "New York")
 * @returns 기온, 날씨 설명, 아이콘 URL 반환
 */
export async function getWeather(city: string) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

    try {
        const response = await axios.get(url)
        const data = response.data
        return {
            temperature: data.main.temp, // 현재 기온 (섭씨)
            description: data.weather[0].description, // 날씨 설명
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`, // 날씨 아이콘
        }
    } catch (error) {
        console.error('Error fetching weather:', error)
        return null
    }
}

/**
 * 사용자의 현재 위치 기반으로 날씨 데이터를 가져오는 함수 (위도, 경도 사용)
 * @param lat - 위도
 * @param lon - 경도
 * @returns 기온, 날씨 설명, 아이콘 URL 반환
 */
export async function getWeatherByCoords(lat: number, lon: number) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`

    try {
        const response = await axios.get(url)
        const data = response.data
        return {
            temperature: data.main.temp,
            description: data.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
        }
    } catch (error) {
        console.error('Error fetching weather:', error)
        return null
    }
}
