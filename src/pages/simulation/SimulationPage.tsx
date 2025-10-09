import { useEffect, useState } from "react";
import { useRoute } from "../../context/RouteContext";
import Map from "../../components/map/Map";
import InfoBox from "../../components/info-box/InfoBox";
import styles from "./SimulationPage.module.css";
import ErrorToast from "../../components/toast/ErrorToast";

interface WindData {
  windDirection: number;
  windSpeed: number;
}

interface BoatData {
  boatDirection: number;
  boatSpeed: number;
}

export default function SimulationPage() {
  const { route } = useRoute();
  const [currentPos, setCurrentPos] = useState<[number, number] | null>(null);
  const [boatData, setboatData] = useState<BoatData | null>(null);
  const [windData, setWindData] = useState<WindData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const speedKts = 7; // Sabit hız (knot)
  const intervalMs = 1000; // 1 saniye
  const EARTH_R = 6371; // km

  const fetchWind = async (lat: number, lon: number): Promise<WindData> => {
    const res = await fetch(
      `https://weather-api.dugun.work/?latitude=${lat}&longitude=${lon}`
    );
    const json = await res.json();
    setWindData(json.data);
    return json.data as WindData;
  };

  const calculateBoatDir = (start: [number, number], end: [number, number]) => {
    const [lat1, lon1] = start.map((d) => (d * Math.PI) / 180);
    const [lat2, lon2] = end.map((d) => (d * Math.PI) / 180);

    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    let brng = (Math.atan2(y, x) * 180) / Math.PI;
    return Math.round((brng + 360) % 360);
  };

  const calculateEffectiveSpeed = (
    boatDir: number,
    windDir: number,
    windSpeed: number
  ) => {
    const angleDiff = Math.abs(boatDir - windDir);
    const normalizedDiff = Math.min(angleDiff, 360 - angleDiff);
    const resistanceFactor = Math.cos((normalizedDiff * Math.PI) / 180);
    const adjustedSpeed = speedKts + windSpeed * resistanceFactor * 0.3;
    return Number(Math.max(0, adjustedSpeed).toFixed(1));
  };

  const move = (
    from: [number, number],
    bearingDeg: number,
    distanceKm: number
  ): [number, number] => {
    const [lat1, lon1] = from.map((d) => (d * Math.PI) / 180);
    const brng = (bearingDeg * Math.PI) / 180;

    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(distanceKm / EARTH_R) +
        Math.cos(lat1) * Math.sin(distanceKm / EARTH_R) * Math.cos(brng)
    );
    const lon2 =
      lon1 +
      Math.atan2(
        Math.sin(brng) * Math.sin(distanceKm / EARTH_R) * Math.cos(lat1),
        Math.cos(distanceKm / EARTH_R) - Math.sin(lat1) * Math.sin(lat2)
      );

    return [
      Number(((lat2 * 180) / Math.PI).toFixed(5)),
      Number(((lon2 * 180) / Math.PI).toFixed(5)),
    ];
  };

  const distanceBetween = (a: [number, number], b: [number, number]) => {
    const dLat = ((b[0] - a[0]) * Math.PI) / 180;
    const dLon = ((b[1] - a[1]) * Math.PI) / 180;
    const lat1 = (a[0] * Math.PI) / 180;
    const lat2 = (b[0] * Math.PI) / 180;

    const h =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
    return EARTH_R * c; // km
  };

  useEffect(() => {
    if (!route || route.length < 2) return;

    let pos = route[0];
    let nextIndex = 1;
    let intervalId: number | null = null;
    let running = false;

    const startSimulation = async () => {
      let windData = await fetchWind(pos[0], pos[1]);
      setCurrentPos(pos);

      intervalId = window.setInterval(async () => {
        if (running) return;
        running = true;
        try {
          if (nextIndex >= route.length) {
            if (intervalId !== null) window.clearInterval(intervalId);
            running = false;
            return;
          }

          const initialDir = calculateBoatDir(pos, route[nextIndex]);
          const effectiveSpeedKts = calculateEffectiveSpeed(
            initialDir,
            windData.windDirection,
            windData.windSpeed
          );
          setboatData({
            boatDirection: initialDir,
            boatSpeed: effectiveSpeedKts,
          });

          let remainingKm = effectiveSpeedKts * 1.852;

          while (remainingKm > 0 && nextIndex < route.length) {
            const next = route[nextIndex];
            const distToNext = distanceBetween(pos, next);

            if (remainingKm >= distToNext) {
              remainingKm -= distToNext;
              pos = next;
              setCurrentPos(pos);
              nextIndex++;

              windData = await fetchWind(pos[0], pos[1]);

              if (nextIndex >= route.length) {
                if (intervalId !== null) window.clearInterval(intervalId);
                break;
              }
            } else {
              const segDir = calculateBoatDir(pos, route[nextIndex]);
              const newPos = move(pos, segDir, remainingKm);
              pos = newPos;
              setCurrentPos(newPos);

              windData = await fetchWind(newPos[0], newPos[1]);

              remainingKm = 0;
            }
          }
        } catch (err) {
          setError(
            `An error occurred during simulation. lat: ${pos[0]} long: ${pos[1]}`
          );
        } finally {
          running = false;
        }
      }, intervalMs);
    };

    startSimulation();

    return () => {
      if (intervalId !== null) window.clearInterval(intervalId);
    };
  }, [route]);

  return (
    <div className={styles.container}>
      <div className={styles.infoPanel}>
        <InfoBox
          label1="Wind Direction"
          value1={`${windData?.windDirection || 0}°`}
          label2="Wind Speed"
          value2={`${windData?.windSpeed || 0} kt`}
        />

        <InfoBox
          label1="Boat Direction"
          value1={`${boatData?.boatDirection || 0}°`}
          label2="Boat Speed"
          value2={`${boatData?.boatSpeed || 0} kt"`}
        />
      </div>
      <Map
        route={route}
        currentPos={currentPos}
        boatDir={boatData?.boatDirection || 0}
        isSimulation={true}
      />
      {error && <ErrorToast message={error} onClose={() => setError(null)} />}
    </div>
  );
}
