import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import { useEffect } from "react";
import L from "leaflet";

import styles from "./MapView.module.css";

// =======================
// Leaflet Icons
// =======================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// =======================
// FlyTo
// =======================

const FlyToProperty = ({ property }) => {
    const map = useMap();

    useEffect(() => {
        console.log("========== FLY TO ==========");
        console.log(property);

        if (!property) {
            console.log("No hay propiedad");
            return;
        }

        const lat = parseFloat(property.latitude);
        const lng = parseFloat(property.longitude);

        console.log("latitude:", property.latitude);
        console.log("longitude:", property.longitude);

        console.log("lat:", lat);
        console.log("lng:", lng);

        console.log("isFinite(lat):", Number.isFinite(lat));
        console.log("isFinite(lng):", Number.isFinite(lng));

        if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lng)
        ) {
            console.error("Coordenadas inválidas");
            return;
        }

        map.flyTo([lat, lng], 15, {
            duration: 1.5,
        });

    }, [property, map]);

    return null;
};

// =======================
// COMPONENTE
// =======================

const MapView = ({
  properties = [],
  selectedProperty,
  setSelectedProperty,
}) => {

  const center = [3.8772, -77.0263];

  console.log("============ TODAS ============");
  console.log(properties);

  const propertiesWithCoords = properties
    .map((property) => {

      const lat =
        property.latitude === null
          ? null
          : parseFloat(property.latitude);

      const lng =
        property.longitude === null
          ? null
          : parseFloat(property.longitude);

      console.log("-------------------------");
      console.log("Título:", property.title);
      console.log("Latitude:", property.latitude);
      console.log("Longitude:", property.longitude);
      console.log("Lat parse:", lat);
      console.log("Lng parse:", lng);

      return {
        ...property,

        latitude: lat,
        longitude: lng,

        position:
          lat !== null &&
          lng !== null &&
          Number.isFinite(lat) &&
          Number.isFinite(lng)
            ? [lat, lng]
            : null,
      };

    })
    .filter((property) => {

      const valid = property.position !== null;

      if (!valid) {
        console.warn(
          "Publicación sin coordenadas:",
          property.title
        );
      }

      return valid;

    });

  console.log("========== FILTRADAS ==========");
  console.log(propertiesWithCoords);

  const activeProperty = propertiesWithCoords.find(
    property => property.id === selectedProperty
  ) || null;

  return (
    <div className={styles.mapContainer}>

      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom
        className={styles.map}
      >

        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyToProperty property={activeProperty} />

        {propertiesWithCoords.map((property, index) => (

          <Marker
            key={property.id ?? index}
            position={property.position}
            eventHandlers={{
              click: () => setSelectedProperty(property.id),
            }}
          >

            <Popup>

              <strong>
                {property.title}
              </strong>

              <br />

              ${property.price?.toLocaleString("es-CO")}

            </Popup>

          </Marker>

        ))}

      </MapContainer>

    </div>
  );
};

export default MapView;