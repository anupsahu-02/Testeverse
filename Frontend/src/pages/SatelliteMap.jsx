import React, { useState, useEffect } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Circle,
    useMap,
    useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { OpenStreetMapProvider } from "leaflet-geosearch";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

// Re-center map
function ChangeView({ coords }) {
    const map = useMap();
    map.setView(coords, 18);
    return null;
}

// Click → reverse geocode
function MapClick({ setCoords, setPlaceName }) {
    useMapEvents({
        click: async (e) => {
            const { lat, lng } = e.latlng;
            setCoords([lat, lng]);
            try {
                const res = await axios.get(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                );
                setPlaceName(res.data.display_name || "Unknown location");
            } catch {
                setPlaceName("Unknown location");
            }
        },
    });
    return null;
}

export default function SatelliteMap() {
    const [coords, setCoords] = useState([20.5937, 78.9629]); // default India
    const [locationName, setLocationName] = useState("India");
    const [query, setQuery] = useState("");
    const [accuracyRadius, setAccuracyRadius] = useState(100);

    // Get current location
    const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                setCoords([lat, lon]);
                setAccuracyRadius(pos.coords.accuracy || 50);
                try {
                    const res = await axios.get(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
                    );
                    setLocationName(res.data.display_name || "Current Location");
                } catch {
                    setLocationName("Current Location");
                }
            },
            (err) => {
                console.error("GPS error:", err);
                alert("Could not get your current location!");
            },
            { enableHighAccuracy: true, timeout: 7000 }
        );
    };

    useEffect(() => {
        getCurrentLocation();
    }, []);

    // Search by place or PIN
    const handleSearch = async () => {
        if (!query.trim()) return alert("Enter a place or PIN code");

        const isPin = /^\d{6}$/.test(query.trim());
        try {
            let lat, lon, label;

            if (isPin) {
                const res = await axios.get(
                    `https://nominatim.openstreetmap.org/search?format=json&postalcode=${query.trim()}&countrycodes=in`
                );
                if (!res.data.length) return alert("PIN code not found!");
                lat = parseFloat(res.data[0].lat);
                lon = parseFloat(res.data[0].lon);
                label = res.data[0].display_name;
            } else {
                const provider = new OpenStreetMapProvider();
                const results = await provider.search({ query });
                if (!results.length) return alert("Place not found!");
                lat = parseFloat(results[0].y);
                lon = parseFloat(results[0].x);
                label = results[0].label;
            }

            setCoords([lat, lon]);
            setLocationName(label);
            setAccuracyRadius(150);
        } catch (err) {
            console.error(err);
            alert("Error fetching location!");
        }
    };

    return (
        <div>
            {/* Controls */}
            <div className="flex justify-center gap-2 p-2 bg-gray-100 shadow-md">
                <input
                    type="text"
                    value={query}
                    placeholder="Place name or PIN code"
                    onChange={(e) => setQuery(e.target.value)}
                    className="p-2 border rounded w-64"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Search
                </button>
                <button
                    onClick={getCurrentLocation}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Current Location
                </button>
            </div>

            {/* Map */}
            <MapContainer
                center={coords}
                zoom={18}
                style={{ height: "90vh", width: "70vw" }}
                maxZoom={18}
            >
                <ChangeView coords={coords} />
                <MapClick setCoords={setCoords} setPlaceName={setLocationName} />

                {/* Satellite imagery */}
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='&copy; <a href="https://www.esri.com/">ESRI</a>'
                />

                {/* Overlay for street/small place labels */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/light_only_labels/{z}/{x}/{y}{r}.png"
                    subdomains="abcd"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />

                {/* Marker & accuracy circle */}
                <Marker position={coords}>
                    <Popup>{locationName}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
