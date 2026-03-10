import { useEffect, useState } from "preact/hooks";

export type WeatherState = {
  loading: boolean;
  error?: string;
  city?: string;
  country?: string;
  temperature?: number;
  apparent?: number;
  weatherCode?: number;
  wind?: number;
  high?: number;
  low?: number;
  updatedAt?: string;
};

export const weatherCodeText: Record<number, string> = {
  0: "晴朗",
  1: "大致晴朗",
  2: "局部多云",
  3: "阴天",
  45: "雾",
  48: "雾凇",
  51: "小毛毛雨",
  53: "中毛毛雨",
  55: "强毛毛雨",
  56: "轻度冻雨",
  57: "强冻雨",
  61: "小雨",
  63: "中雨",
  65: "大雨",
  66: "轻度冻雨",
  67: "强冻雨",
  71: "小雪",
  73: "中雪",
  75: "大雪",
  77: "雪粒",
  80: "阵雨",
  81: "强阵雨",
  82: "暴雨",
  85: "阵雪",
  86: "强阵雪",
  95: "雷暴",
  96: "雷暴伴轻度冰雹",
  99: "雷暴伴强冰雹"
};

export function useWeather(city: string) {
  const [state, setState] = useState<WeatherState>({ loading: true });

  useEffect(() => {
    let active = true;
    const load = async () => {
      setState({ loading: true });
      try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city
        )}&count=1&language=zh&format=json`;
        const geoResp = await fetch(geoUrl);
        if (!geoResp.ok) throw new Error("地理位置解析失败");
        const geoData = await geoResp.json();
        if (!geoData.results || geoData.results.length === 0) {
          throw new Error("未找到该城市");
        }
        const { latitude, longitude, name, country } = geoData.results[0];
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
        const weatherResp = await fetch(weatherUrl);
        if (!weatherResp.ok) throw new Error("天气数据获取失败");
        const weatherData = await weatherResp.json();
        if (!active) return;
        setState({
          loading: false,
          city: name,
          country,
          temperature: weatherData.current?.temperature_2m,
          apparent: weatherData.current?.apparent_temperature,
          weatherCode: weatherData.current?.weather_code,
          wind: weatherData.current?.wind_speed_10m,
          high: weatherData.daily?.temperature_2m_max?.[0],
          low: weatherData.daily?.temperature_2m_min?.[0],
          updatedAt: weatherData.current?.time
        });
      } catch (error) {
        if (!active) return;
        setState({
          loading: false,
          error: error instanceof Error ? error.message : "未知错误"
        });
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [city]);

  return state;
}
