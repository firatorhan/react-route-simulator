import { useEffect, useState } from "react";
import { useRoute } from "../../context/RouteContext";
import Map from "../../components/map/Map";

interface WindData {
  windDirection: number;
  windSpeed: number;
}

export default function SimulationPage() {
  const { route } = useRoute();
  const [currentPos, setCurrentPos] = useState<[number, number] | null>(null);
  const [boatDir, setboatDir] = useState<number | null>(null);

  const speedKts = 7; // Sabit hız (knot)
  const intervalMs = 1000; // 1 saniye
  const EARTH_R = 6371; // km

  const fetchWind = async (lat: number, lon: number): Promise<WindData> => {
    const res = await fetch(
      `https://weather-api.dugun.work/?latitude=${lat}&longitude=${lon}`
    );
    const json = await res.json();
    return json.data as WindData;
  };

  // Küresel yön (bearing) hesaplama
  const calculateBoatDir = (start: [number, number], end: [number, number]) => {
    const [lat1, lon1] = start.map((d) => (d * Math.PI) / 180);
    const [lat2, lon2] = end.map((d) => (d * Math.PI) / 180);

    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    let brng = (Math.atan2(y, x) * 180) / Math.PI;
    setboatDir((brng + 360) % 360);
    return (brng + 360) % 360;
  };

  // Rüzgar etkisiyle efektif hız
  const calculateEffectiveSpeed = (
    boatDir: number,
    windDir: number,
    windSpeed: number
  ) => {
    const angleDiff = Math.abs(boatDir - windDir);
    const normalizedDiff = Math.min(angleDiff, 360 - angleDiff);
    const resistanceFactor = Math.cos((normalizedDiff * Math.PI) / 180);
    const adjustedSpeed = speedKts + windSpeed * resistanceFactor * 0.3;
    return Math.max(0, adjustedSpeed);
  };

  // move fonksiyonu: from'dan bearing yönünde distanceKm ilerle
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

  // Haversine ile km cinsinden mesafe
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

  // Simülasyon döngüsü (düzeltilmiş)
  useEffect(() => {
    if (!route || route.length < 2) return;

    let pos = route[0];
    let nextIndex = 1;
    let intervalId: number | null = null;
    let running = false; // yeniden giriş kontrolü

    const startSimulation = async () => {
      let windData = await fetchWind(pos[0], pos[1]);
      setCurrentPos(pos);

      intervalId = window.setInterval(async () => {
        if (running) return; // önceki adım tamamlanmadıysa atla
        running = true;
        try {
          if (nextIndex >= route.length) {
            if (intervalId !== null) window.clearInterval(intervalId);
            running = false;
            return;
          }

          // Bu adımda 1 saniye = 1 saat kabulüyle gidilecek toplam km
          // (isteğe göre bu satırı küçülterek daha yumuşak hareket sağlarsın)
          const initialDir = calculateBoatDir(pos, route[nextIndex]);
          const effectiveSpeedKts = calculateEffectiveSpeed(
            initialDir,
            windData.windDirection,
            windData.windSpeed
          );
          let remainingKm = effectiveSpeedKts * 1.852; // km (1 saatlik mesafe)
          // remainingKm aynı tick içinde birden fazla waypoint'i geçebilecek şekilde tüketilecek

          while (remainingKm > 0 && nextIndex < route.length) {
            const next = route[nextIndex];
            const distToNext = distanceBetween(pos, next);

            if (remainingKm >= distToNext) {
              // Bu adım içinde waypoint'e varılıyor (ve kalan km varsa bir sonraki segmente aktar)
              remainingKm -= distToNext;
              pos = next;
              setCurrentPos(pos);
              nextIndex++;

              // waypoint'e varınca yeni rüzgar verisini al
              windData = await fetchWind(pos[0], pos[1]);

              // eğer rota bitti ise döngüyü kes
              if (nextIndex >= route.length) {
                if (intervalId !== null) window.clearInterval(intervalId);
                break;
              }
              // döngü devam ederse remainingKm ile bir sonraki segmentte devam edilecek
            } else {
              // waypoint'e ulaşmadan sadece remainingKm kadar ilerle
              const segDir = calculateBoatDir(pos, route[nextIndex]);
              const newPos = move(pos, segDir, remainingKm);
              pos = newPos;
              setCurrentPos(newPos);

              // bu yeni pozisyona göre rüzgar al (bir sonraki tick'te kullanılacak)
              windData = await fetchWind(newPos[0], newPos[1]);

              // Tüm remaining tüketildi, bu tick bitiyor
              remainingKm = 0;
            }
          }
        } catch (err) {
          console.error("Simülasyon hatası:", err);
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
    <div style={{ height: "100vh", width: "100%" }}>
      <Map
        route={route}
        currentPos={currentPos}
        boatDir={boatDir || 0}
        isSimulation={true}
      />
    </div>
  );
}
