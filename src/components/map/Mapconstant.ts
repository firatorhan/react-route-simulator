
import L from "leaflet";
import { Icons } from "../icons";

export const createHtmlMarker = (label: string, index: number) => {
  const iconSvg = index === 0 ? Icons.startString : Icons.waypointString;
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background-color: var(--color-white);
      border: 1px solid var(--color-border);
      font-size: var(--font-md);
      width: 80px;
      height: 80px;
      border-radius: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    ">
      <span>${iconSvg}</span>
      <span>${label}</span>
    </div>`,
    iconSize: [80, 80] ,
    iconAnchor: [40, 40]
  });
};

export const boatIcon = (angle: number) =>
  L.divIcon({
    className: "boat-icon",
    html: `<div style="transform: rotate(${angle}deg)">${Icons.boatIconString}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });


  