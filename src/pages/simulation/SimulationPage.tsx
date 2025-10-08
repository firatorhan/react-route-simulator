import { useEffect, useState } from "react";
import { useRoute } from "../../context/RouteContext";
import Map from "../../components/map/Map";

export default function SimulationPage() {
  const { route } = useRoute(); // Context’ten gelen rota (örneğin [ [lat, lng], [lat, lng] ])
  const [simRoute, setSimRoute] = useState<[number, number][]>([]);
  const [polylineColors, setPolylineColors] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const speedKnots = 7;
  const intervalMs = 1000; // her segment arası 1 saniye (örnek simülasyon)

  useEffect(() => {
    if (!route || route.length === 0) return;

    setSimRoute(route);
    setPolylineColors(Array(route.length - 1).fill("red"));
    setCurrentIndex(0);
  }, [route]);

  // Mock simülasyon (API yerine)
  useEffect(() => {
    if (currentIndex >= simRoute.length - 1) return;

    const interval = setInterval(() => {
      // Mock wind data
      const windSpeed = Math.floor(Math.random() * 15); // 0-15 knots arası
      const windDirection = Math.floor(Math.random() * 360); // 0-360°

      const effectiveSpeed = Math.max(0, speedKnots - windSpeed * 0.1).toFixed(2);

      console.log(
        `Segment ${currentIndex + 1}: wind=${windSpeed}kt @${windDirection}° → speed=${effectiveSpeed}kt`
      );

      // Polyline rengini güncelle
      setPolylineColors((prev) => {
        const updated = [...prev];
        updated[currentIndex] = "green";
        return updated;
      });

      // bir sonraki segmente geç
      setCurrentIndex((prev) => prev + 1);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [currentIndex, simRoute]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Map
        route={simRoute}
        isSimulation={true}
      />
    </div>
  );
}
