"useclient";
import React from "react";
import { Sun, Cloud, CloudRain, CloudSnow, CloudDrizzle } from "lucide-react";

interface WeatherIconProps {
  condition: string;
  size?: number;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  condition,
  size = 24,
  className = ""
}) => {
  const iconProps = {
    size,
    className: `${className} transition-all duration-300`
  };

  switch (condition.toLowerCase()) {
    case "sunny":
    case "clear":
      return (
        <Sun
          {...iconProps}
          className={`${iconProps.className} text-yellow-500`}
        />
      );

    case "partly cloudy":
    case "partly-cloudy":
      return (
        <Cloud
          {...iconProps}
          className={`${iconProps.className} text-gray-400`}
        />
      );

    case "cloudy":
    case "overcast":
      return (
        <Cloud
          {...iconProps}
          className={`${iconProps.className} text-gray-600`}
        />
      );

    case "rainy":
    case "rain":
      return (
        <CloudRain
          {...iconProps}
          className={`${iconProps.className} text-blue-500`}
        />
      );

    case "drizzle":
      return (
        <CloudDrizzle
          {...iconProps}
          className={`${iconProps.className} text-blue-400`}
        />
      );

    case "snowy":
    case "snow":
      return (
        <CloudSnow
          {...iconProps}
          className={`${iconProps.className} text-blue-200`}
        />
      );

    default:
      return (
        <Sun
          {...iconProps}
          className={`${iconProps.className} text-yellow-500`}
        />
      );
  }
};
