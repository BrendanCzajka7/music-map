import { useEffect, useRef } from "react";
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

  const clientId = getClientId();

  async function loadMemories() {
    const map = mapInstance.current;
    if (!map) return;

    if (!markersLayer.current) {
      markersLayer.current = L.layerGroup().addTo(map);
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

  async function createMemory(lat: number, lng: number) {
    const track = prompt("Song name?");
    if (!track) return;

    const artist = prompt("Artist?");
    if (!artist) return;

    const text = prompt("Memory description?");
    const date = prompt("Memory date (YYYY-MM-DD)?");

    const payload = {
      client_id: clientId,
      lat,
      lng,
      track_id: "manual",
      track_name: track,
      artist_name: artist,
      memory_text: text,
      memory_date: date,
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
  }

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstance.current) {
      const map = L.map(mapRef.current).setView([37.7749, -122.4194], 5);
      mapInstance.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        createMemory(lat, lng).catch(console.error);
      });
    }

    loadMemories().catch(console.error);
  }, []);

  return <div ref={mapRef} style={{ height: "100vh", width: "100%" }} />;
}