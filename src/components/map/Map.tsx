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
import CoordinateField from "../coordinate-field/CoordinateField";
import { boatIcon, createHtmlMarker } from "./Mapconstant";

interface MapProps {
  route: [number, number][];
  onRouteChange?: (newRoute: [number, number][]) => void;
  isSimulation?: boolean;
  currentPos?: [number, number] | null;
  boatDir?: number | null;
}

export default function Map({
  route,
  isSimulation,
  onRouteChange,
  currentPos,
  boatDir = 0,
}: MapProps) {
  const [localRoute, setLocalRoute] = useState<[number, number][]>([]);

  const handleMarkerDrag = (index: number, event: L.LeafletEvent) => {
    const marker = event.target as L.Marker;
    const newPos = marker.getLatLng();
    const lat = Number(newPos.lat.toFixed(4));
    const lng = Number(newPos.lng.toFixed(4));
    const newRoute = [...localRoute];
    newRoute[index] = [lat, lng];
    setLocalRoute(newRoute);
    if (onRouteChange) onRouteChange(newRoute);
  };

  useEffect(() => {
    setLocalRoute(route);
  }, [route]);

  if (localRoute.length === 0) return null;

  let completedPath: [number, number][] = [];
  let remainingPath: [number, number][] = [];

  if (isSimulation && currentPos) {
    let insertIndex = 0;
    for (let i = 0; i < localRoute.length - 1; i++) {
      const [lat1, lon1] = localRoute[i];
      const [lat2, lon2] = localRoute[i + 1];
      const d1 = Math.hypot(currentPos[0] - lat1, currentPos[1] - lon1);
      const d2 = Math.hypot(currentPos[0] - lat2, currentPos[1] - lon2);
      const segLen = Math.hypot(lat2 - lat1, lon2 - lon1);
      if (d1 + d2 <= segLen * 1.05) {
        insertIndex = i + 1;
        break;
      }
    }

    completedPath = [...localRoute.slice(0, insertIndex), currentPos];
    remainingPath = [currentPos, ...localRoute.slice(insertIndex)];
  }

  return (
    <MapContainer
      className={styles.mapContainer}
      center={localRoute[localRoute.length - 1]}
      zoom={10}
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
          icon={createHtmlMarker(`${idx > 0 ? `WP ${idx}` : "SP"}`, idx)}
          draggable={!isSimulation}
          eventHandlers={{
            dragend: (e) => handleMarkerDrag(idx, e),
          }}
        >
          <Popup>
            <div className={styles.popupCoordinate}>
              <CoordinateField
                label="latitude"
                name="latitude"
                value={pos[0]}
                disabled={isSimulation}
                type="number"
                onChange={(e) => {
                  const newLat = Number(e.target.value);
                  const newRoute = [...localRoute];
                  newRoute[idx] = [newLat, newRoute[idx][1]];
                  setLocalRoute(newRoute);
                  if (onRouteChange) onRouteChange(newRoute);
                }}
              />
              <CoordinateField
                label="longitude"
                name="longitude"
                type="number"
                value={pos[1]}
                disabled={isSimulation}
                onChange={(e) => {
                  const newLng = Number(e.target.value);
                  const newRoute = [...localRoute];
                  newRoute[idx] = [newRoute[idx][0], newLng];
                  setLocalRoute(newRoute);
                  if (onRouteChange) onRouteChange(newRoute);
                }}
              />
            </div>
          </Popup>
        </Marker>
      ))}

      {isSimulation && currentPos && (
        <Marker position={currentPos} icon={boatIcon(boatDir!)} />
      )}

      {!isSimulation && (
        <Polyline positions={localRoute} color="white" dashArray={[10]} />
      )}

      {isSimulation && currentPos && (
        <>
          <Polyline positions={completedPath} color="green" />
          <Polyline positions={remainingPath} color="red" dashArray={[8]} />
        </>
      )}
    </MapContainer>
  );
}
