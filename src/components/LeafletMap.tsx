"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type LeafletMapProps = {
  lat: number;
  lng: number;
  zoom?: number;
  popup?: string;
  height?: string; // tailwind height class, örn: "h-[400px]"
};

export default function LeafletMap({
  lat,
  lng,
  zoom = 16,
  popup,
  height = "h-[400px]",
}: LeafletMapProps) {
  useEffect(() => {
    const map = L.map("contact-map", {
      center: [lat, lng],
      zoom,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const icon = L.icon({
      iconUrl: "/marker-icon.png",
      shadowUrl: "/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const marker = L.marker([lat, lng], { icon }).addTo(map);
    if (popup) marker.bindPopup(popup);

    return () => {
      map.remove();
    };
  }, [lat, lng, zoom, popup]);

  return <div id="contact-map" className={`w-full ${height} rounded-xl`} />;
}
