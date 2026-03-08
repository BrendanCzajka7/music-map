import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Memory = {
  lat: number;
  lng: number;
  song: string;
  text: string;
};

export default function MapView() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstance.current) return;

    const map = L.map(mapRef.current).setView([37.7749, -122.4194], 5);
    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    fetch("http://127.0.0.1:8000/memories")
      .then((res) => res.json())
      .then((memories: Memory[]) => {
        const currentMap = mapInstance.current;
        if (!currentMap) return;

        memories.forEach((memory) => {
          L.marker([memory.lat, memory.lng])
            .addTo(currentMap)
            .bindPopup(`<b>${memory.song}</b><br>${memory.text}`);
        });
      })
      .catch((err) => {
        console.error("Failed to load memories:", err);
      });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} style={{ height: "100vh", width: "100%" }} />;
}