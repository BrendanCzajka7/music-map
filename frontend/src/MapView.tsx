import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { getClientId } from "./clientId";

type Memory = {
  id: number;
  client_id: string;
  lat: number;
  lng: number;
  track_id: string;
  track_name: string;
  artist_name: string;
  album_image?: string | null;
  preview_url?: string | null;
  memory_text?: string | null;
  memory_date?: string | null;
  place_name?: string | null;
  country?: string | null;
  source: string;
  created_at: string;
};

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function MapView() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);

  const [loading, setLoading] = useState(false);
  const clientId = getClientId();

  async function loadMemories() {
    const currentMap = mapInstance.current;
    if (!currentMap) return;

    if (!markersLayer.current) {
      markersLayer.current = L.layerGroup().addTo(currentMap);
    }

    markersLayer.current.clearLayers();

    const res = await fetch(`/api/memories?client_id=${encodeURIComponent(clientId)}`);

    if (!res.ok) {
      throw new Error(`Failed to load memories: ${res.status}`);
    }

    const memories: Memory[] = await res.json();

    memories.forEach((memory) => {
      L.marker([memory.lat, memory.lng])
        .addTo(markersLayer.current!)
        .bindPopup(
          `<b>${memory.track_name}</b><br>${memory.artist_name}<br>${memory.memory_text ?? ""}`
        );
    });
  }

  async function createTestMemory() {
    const currentMap = mapInstance.current;
    if (!currentMap) return;

    setLoading(true);

    try {
      const center = currentMap.getCenter();

      const payload = {
        client_id: clientId,
        lat: center.lat,
        lng: center.lng,
        track_id: "test-track-1",
        track_name: "Holocene",
        artist_name: "Bon Iver",
        memory_text: "Temporary test memory",
        memory_date: "2026-03-14",
        source: "manual",
      };

      const res = await fetch("/api/memories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to create memory: ${res.status} ${text}`);
      }

      await loadMemories();
    } catch (err) {
      console.error(err);
      alert("Failed to create test memory. Check console/backend logs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  console.log("fetching memories...")

  if (!mapRef.current) return;

  if (!mapInstance.current) {
    const map = L.map(mapRef.current).setView([37.7749, -122.4194], 5);
    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
  }

  loadMemories().catch((err) => {
    console.error("Failed to load memories:", err);
  });

}, []);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={createTestMemory}
        disabled={loading}
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 1000,
          padding: "8px 12px",
          background: "white",
          border: "1px solid #ccc",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        {loading ? "Saving..." : "Create Test Memory"}
      </button>

      <div ref={mapRef} style={{ height: "100vh", width: "100%" }} />
    </div>
  );
}