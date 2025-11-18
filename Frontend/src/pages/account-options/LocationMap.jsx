import React, { useState, useEffect, use } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Circle,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { OpenStreetMapProvider } from "leaflet-geosearch";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

// helper to move map
function ChangeView({ coords }) {
    const map = useMap();
    map.setView(coords, 17);
    return null;
}

export default function LocationMap({ locationName }) {
    const [coords, setCoords] = useState([20.5937, 78.9629]); // default India
    const [place, setPlace] = useState(locationName || "India");
    let [error, setError] = useState("");
    let [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchCoords() {
            setLoading(true)
            // if(locationName.length > 0) {
            //     console.log(locationName);
            // }
            try {
                // Geocode from location name
                const provider = new OpenStreetMapProvider();
                const results = await provider.search({ query: locationName });
                if (results.length > 0) {
                    const lat = parseFloat(results[0].y);
                    const lon = parseFloat(results[0].x);
                    setCoords([lat, lon]);
                    setPlace(results[0].label);
                    setError("");
                } else {
                    setCoords([20.5937, 78.9629])
                    setPlace("India")
                    setError("Location not found!");
                    console.warn("Location not found!");
                }
            } catch (err) {
                console.error("Error fetching coordinates:", err);
            }
            setLoading(false);
        }

        fetchCoords();
    }, [locationName]);

    return (
        <div>
            {loading ? <p style={{fontSize: "large"}}>We are locating you...</p> : 
                
                error.length > 0 ?
                    <p style={{ fontSize: "large" }}>{error}</p>
                        :
                        <>
                        <b>{place}</b>
                            <MapContainer
                                center={coords}
                                zoom={1}
                                style={{ height: "50vh" }}
                                maxZoom={20}
                            >
                                <ChangeView coords={coords} />

                                {/* Satellite layer */}
                                <TileLayer
                                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                    attribution='&copy; <a href="https://www.esri.com/">ESRI</a>'
                                />

                                {/* Label overlay for streets & place names */}
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/rastertiles/light_only_labels/{z}/{x}/{y}{r}.png"
                                    subdomains="abcd"
                                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                                />

                                {/* Marker */}
                                <Marker position={coords}>
                                    <Popup>{place}</Popup>
                                </Marker>
                            </MapContainer>
                        </>
            }
        </div>
    );
}