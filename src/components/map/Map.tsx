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
}

export default function Map({ route, isSimulation, onRouteChange }: MapProps) {
  const [localRoute, setLocalRoute] = useState<[number, number][]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const calculateAngle = (start: [number, number], end: [number, number]) => {
    const deltaLng = end[1] - start[1];
    const deltaLat = end[0] - start[0];
    const angle = (Math.atan2(deltaLng, deltaLat) * 180) / Math.PI;
    return angle;
  };

  const [boatPosition, setBoatPosition] = useState<{
    position: [number, number];
    angle: number;
  } | null>();

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

  useEffect(() => {
    if (!route || route.length === 0) return;
    setLocalRoute(route);
    setCurrentIndex(0);
    setProgress(0);
  }, [route]);

  useEffect(() => {
    if (!isSimulation) return;
    if (localRoute.length < 2) return;

    const dt = 0.1;
    const interval = setInterval(() => {
      setProgress((prev) => {
        let next = prev + dt;
        let idx = currentIndex;
        if (next >= 1) {
          next = 0;
          idx = idx + 1;
          if (idx >= localRoute.length - 1) {
            clearInterval(interval);
            return 1;
          }
          setCurrentIndex(idx);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulation, localRoute, currentIndex]);

  // Bot pozisyonu ve açısı
  useEffect(() => {
    if (!isSimulation || localRoute.length < 2) return;
    const start = localRoute[currentIndex];
    const end =
      currentIndex >= localRoute.length - 1
        ? start
        : localRoute[currentIndex + 1];
    const lat = start[0] + (end[0] - start[0]) * progress;
    const lng = start[1] + (end[1] - start[1]) * progress;
    const angle = calculateAngle(start, end);
    
    setBoatPosition({ position: [lat, lng], angle });
  }, [progress, currentIndex, localRoute, isSimulation]);

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

      {isSimulation && boatPosition && (
        <Marker
          position={boatPosition.position}
          icon={boatIcon(boatPosition.angle)}
        />
      )}

      {isSimulation ? (
        localRoute.map((_, idx) => {
          if (idx === localRoute.length - 1) return null;
          const start = localRoute[idx];
          const end = localRoute[idx + 1];
          let segments: [number, number][][] = [];
          if (idx < currentIndex) {
            segments.push([start, end]);
            return (
              <Polyline
                key={`segment-${idx}-full`}
                positions={segments[0]}
                color="green"
              />
            );
          } else if (idx === currentIndex) {
            const latMid = start[0] + (end[0] - start[0]) * progress;
            const lngMid = start[1] + (end[1] - start[1]) * progress;
            segments.push([start, [latMid, lngMid]]);
            segments.push([[latMid, lngMid], end]);
            return (
              <div key={`segment-${idx}-partial`}>
                <Polyline positions={segments[0]} color="green" />
                <Polyline positions={segments[1]} color="red" />
              </div>
            );
          } else {
            return (
              <Polyline
                key={`segment-${idx}-red`}
                positions={[start, end]}
                color="red"
              />
            );
          }
        })
      ) : (
        <Polyline positions={localRoute} color="white" dashArray={[10]} />
      )}
    </MapContainer>
  );
}
