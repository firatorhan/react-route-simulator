import { createContext, useContext, useState, type ReactNode } from "react";

type Coordinate = [number, number];

interface RouteContextType {
  route: Coordinate[];
  setRoute: (route: Coordinate[]) => void;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export const RouteProvider = ({ children }: { children: ReactNode }) => {
  const [route, setRoute] = useState<Coordinate[]>([[40.1516, 25.8805]]);
  return (
    <RouteContext.Provider value={{ route, setRoute }}>
      {children}
    </RouteContext.Provider>
  );
};

export const useRoute = (): RouteContextType => {
  const context = useContext(RouteContext);
  if (!context) throw new Error("useRoute must be used within a RouteProvider");
  return context;
};
