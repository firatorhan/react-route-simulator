import { useEffect, useState } from "react";
import { useRoute } from "../../context/RouteContext";
import Map from "../../components/map/Map";
import Styles from "./SimulationPage.module.css";

interface WindData {
  windDirection: number;
  windSpeed: number;
}

export default function SimulationPage() {
  const { route } = useRoute();
  const [currentPos, setCurrentPos] = useState<[number, number] | null>(null);
  const [wind, setWind] = useState<WindData | null>(null);
  const speedKts = 7; // Sabit hız

  const fetchWind = async (lat: number, lon: number) => {
    const res = await fetch(
      `https://weather-api.dugun.work/?latitude=${lat}&longitude=${lon}`
    );
    const json = await res.json();
    return json.data as WindData;
  };

  // --- İki nokta arası yön hesaplama 0-360 derece arası ---
  const calculateBoatDir = (start: [number, number], end: [number, number]) => {
    const deltaLng = end[1] - start[1];
    const deltaLat = end[0] - start[0];
    let angle = (Math.atan2(deltaLng, deltaLat) * 180) / Math.PI;
    if (angle < 0) angle += 360;
    return Math.round(angle);
  };

  // --- Rüzgarın tekne hızına etkisini hesapla ---
  const calculateEffectiveSpeed = (
    boatDir: number,
    windDir: number,
    windSpeed: number
  ) => {
    const angleDiff = Math.abs(boatDir - windDir);
    const normalizedDiff = Math.min(angleDiff, 360 - angleDiff);
    const resistanceFactor = Math.cos((normalizedDiff * Math.PI) / 180); // 1 → aynı yönde, -1 → karşı yönde
    const adjustedSpeed = speedKts + windSpeed * resistanceFactor * 0.3; // 0.3: etki katsayısı
    return Math.max(0, adjustedSpeed);
  };

  function move(
    from: [number, number],
    bearingDeg: number,
    distanceKm: number
  ): [number, number] {
    const R = 6371; // Dünya yarıçapı km
    const [lat1, lon1] = from.map((d) => (d * Math.PI) / 180);
    const brng = (bearingDeg * Math.PI) / 180;

    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(distanceKm / R) +
        Math.cos(lat1) * Math.sin(distanceKm / R) * Math.cos(brng)
    );
    const lon2 =
      lon1 +
      Math.atan2(
        Math.sin(brng) * Math.sin(distanceKm / R) * Math.cos(lat1),
        Math.cos(distanceKm / R) - Math.sin(lat1) * Math.sin(lat2)
      );

    return [
      Number(((lat2 * 180) / Math.PI).toFixed(4)),
      Number(((lon2 * 180) / Math.PI).toFixed(4)),
    ];
  }

  useEffect(() => {
    const loadWind = async () => {
      try {
        const data = await fetchWind(route[0][0], route[0][1]);
        setWind(data);
      } catch (error) {
        console.error("Rüzgar verisi alınamadı:", error);
      }
    };

    loadWind();
  }, []);

  useEffect(() => {
    if (!wind) return;

    const boatDirection = calculateBoatDir(currentPos || route[0], route[1]);
    const effectiveSpeedKts = calculateEffectiveSpeed(
      boatDirection,
      wind.windDirection,
      wind.windSpeed
    );

    const distanceKm = effectiveSpeedKts * 1.852; //1 knot ≈ 1.852 km/h  1 saniye = 1 saat → km;
    const newPos = move(currentPos || route[0], boatDirection, distanceKm);
    setCurrentPos(newPos);
  }, [wind]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Map route={route} isSimulation={true} />
    </div>
  );
}
