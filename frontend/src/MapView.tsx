import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([37.7749, -122.4194], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    L.marker([37.7749, -122.4194])
      .addTo(map)
      .bindPopup("Test Memory<br />Song: Holocene");

    return () => {
      map.remove();
    };
  }, []);

  return <div ref={mapRef} style={{ height: "100vh", width: "100%" }} />;
}