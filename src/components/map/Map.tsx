import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import L from "leaflet";

// Marker ikonunu düzeltmek için (default ikon sorunlu olabilir)
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Map() {
  const route: [number, number][] = [
    [41.015137, 28.97953],
    [41.025137, 28.98953],
    [41.035137, 28.97953],
  ];
  return (
    <MapContainer
      className={styles.mapContainer}
      center={route[0]}
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {route.map((pos, idx) => (
        <Marker key={idx} position={pos} icon={markerIcon}>
          <Popup>{`Nokta ${idx + 1}`}</Popup>
        </Marker>
      ))}

      {/* Rota çizgisi */}
      <Polyline positions={route} color="blue" />
    </MapContainer>
  );
}
