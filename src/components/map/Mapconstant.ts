
import L from "leaflet";

export const ICON_SIZE = [80, 80] as [number, number];
export const ICON_ANCHOR = [40, 40] as [number, number];

export const COLORS = {
  markerBg: "var(--color-white)",
  markerBorder: "var(--color-border)",
  polylineCompleted: "green",
  polylinePending: "red",
  polylineDefault: "var(--color-white)",
};

export const SVG_ICONS = {
  start: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.75 1.125V2.4375L7.73438 1.45312C9.51562 1.03125 11.3906 1.21875 13.0312 2.0625C15.1875 3.14062 17.7656 3.14062 19.9219 2.0625L20.3906 1.82812C21.3281 1.3125 22.5 2.01562 22.5 3.09375V16.2188C22.5 16.875 22.0781 17.3906 21.5156 17.625L19.875 18.2344C17.7188 19.0781 15.3281 18.9375 13.2188 17.9062C11.4375 17.0156 9.42188 16.7812 7.5 17.25L3.75 18.1875V22.875C3.75 23.5312 3.23438 24 2.625 24C1.96875 24 1.5 23.5312 1.5 22.875V18.75V16.4531V3V1.125C1.5 0.515625 1.96875 0 2.625 0C3.23438 0 3.75 0.515625 3.75 1.125ZM3.75 4.78125V15.8906L6.9375 15.0938C9.375 14.4844 12 14.7656 14.25 15.8906C15.75 16.6406 17.4844 16.7344 19.0781 16.125L20.25 15.7031V4.35938C17.5781 5.4375 14.5781 5.34375 12.0469 4.07812C10.875 3.46875 9.51562 3.32812 8.25 3.65625L3.75 4.78125Z" fill="#098483"/>
</svg>`,
  waypoint: `<svg width="18" height="24" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.75 9.01758C15.75 5.31445 12.7031 2.26758 9 2.26758C5.25 2.26758 2.25 5.31445 2.25 9.01758C2.25 9.62695 2.4375 10.5176 2.95312 11.7363C3.42188 12.8613 4.125 14.1738 4.92188 15.4863C6.28125 17.6426 7.82812 19.7051 9 21.2051C10.125 19.7051 11.6719 17.6426 13.0312 15.4863C13.8281 14.1738 14.5312 12.8613 15 11.7363C15.5156 10.5176 15.75 9.62695 15.75 9.01758ZM18 9.01758C18 13.1426 12.5156 20.4082 10.0781 23.4551C9.51562 24.1582 8.4375 24.1582 7.875 23.4551C5.48438 20.4082 0 13.1426 0 9.01758C0 4.04883 4.03125 0.0175781 9 0.0175781C13.9688 0.0175781 18 4.04883 18 9.01758ZM13.5469 8.08008L8.53125 13.0957C8.0625 13.5176 7.35938 13.5176 6.9375 13.0957L4.45312 10.5645C3.98438 10.1426 3.98438 9.43945 4.45312 9.01758C4.875 8.54883 5.57812 8.54883 6 9.01758L7.73438 10.7051L11.9531 6.48633C12.375 6.06445 13.0781 6.06445 13.5 6.48633C13.9688 6.95508 13.9688 7.6582 13.5 8.08008H13.5469Z" fill="#A5A5A5"/>
</svg>`,
};

export const BOAT_ICON_SVG = `<svg width="26" height="33" viewBox="0 0 26 33" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.2669 2.72033C17.0124 1.74849 18.2808 1.34342 19.4294 1.65109C20.5777 1.95877 21.473 2.94348 21.6331 4.15749L24.8402 27.7104L24.8421 27.7274C25.01 29.1375 24.1722 30.4865 22.8144 30.9458C21.4161 31.4187 19.9908 30.7876 19.275 29.5478L14.275 20.8875L5.61476 25.8875C4.37484 26.6033 2.82501 26.4374 1.85049 25.3285C0.904199 24.2518 0.853733 22.6642 1.70456 21.527L16.2664 2.71948L16.2669 2.72033Z" fill="#098483" stroke="white" stroke-width="2"/>
</svg>`;

export const createHtmlMarker = (label: string, index: number) => {
  const iconSvg = index === 0 ? SVG_ICONS.start : SVG_ICONS.waypoint;
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background-color: ${COLORS.markerBg};
      border: 1px solid ${COLORS.markerBorder};
      font-size: var(--font-md);
      width: ${ICON_SIZE[0]}px;
      height: ${ICON_SIZE[1]}px;
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
    iconSize: ICON_SIZE,
    iconAnchor: ICON_ANCHOR,
  });
};

export const boatIcon = (angle: number) =>
  L.divIcon({
    className: "boat-icon",
    html: `<div style="transform: rotate(${angle}deg)">${BOAT_ICON_SVG}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
