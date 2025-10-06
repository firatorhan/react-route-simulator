import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

interface MapProps {
  route: [number, number][];
  onRouteChange?: (newRoute: [number, number][]) => void;
}

export default function Map({ route, onRouteChange }: MapProps) {
  const [localRoute, setLocalRoute] = useState<[number, number][]>([]);

  const handleMarkerDrag = (index: number, event: L.LeafletEvent) => {
    const marker = event.target as L.Marker;
    const newPos = marker.getLatLng();

    const lat = Number(newPos.lat.toFixed(4));
    const lng = Number(newPos.lng.toFixed(4));

    const newRoute = [...localRoute];
    newRoute[index] = [lat, lng];
    setLocalRoute(newRoute);

    if (onRouteChange) {
      onRouteChange(newRoute);
    }

    console.log(`Nokta ${index + 1} yeni konumu:`, lat, lng);
  };

  useEffect(() => {
    setLocalRoute(route);
  }, [route]);

  if (localRoute.length === 0) return null;

  return (
    <MapContainer
      className={styles.mapContainer}
      center={localRoute[0]}
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {localRoute.map((pos, idx) => (
        <Marker
          key={idx}
          position={pos}
          draggable={true}
          eventHandlers={{
            dragend: (e) => handleMarkerDrag(idx, e),
          }}
        >
          <Popup>{`Nokta ${idx + 1}`}</Popup>
        </Marker>
      ))}
      <Polyline positions={localRoute} color="blue" />
    </MapContainer>
  );
}
