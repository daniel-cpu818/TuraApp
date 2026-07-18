import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";

import { useEffect } from "react";

import L from "leaflet";

import styles from "./MapView.module.css";

// FIX ICONS
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// 🔥 mover mapa automáticamente
const FlyToProperty = ({ property }) => {

  const map = useMap();

  useEffect(() => {

    if (property) {

      map.flyTo(property.position, 14, {
        duration: 1.5,
      });

    }

  }, [property]);

  return null;
};

const MapView = ({
  properties,
  selectedProperty,
  setSelectedProperty
}) => {

  const center = [4.7110, -74.0721];

  // 🔥 generar coords fake temporales
  const propertiesWithCoords = properties
    .filter(
      (property) =>
        property.latitude != null &&
        property.longitude != null
    )
    .map((property) => ({
      ...property,

      position: [
        property.latitude,
        property.longitude,
      ],
    }));

  const activeProperty =
    propertiesWithCoords[selectedProperty];

  return (

    <div className={styles.mapContainer}>

      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={true}
        className={styles.map}
      >

        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🔥 centrar automáticamente */}
        <FlyToProperty property={activeProperty} />

        {propertiesWithCoords.map(
          (property, index) => (

            <Marker
              key={index}
              position={property.position}

              eventHandlers={{
                click: () =>
                  setSelectedProperty(index),
              }}
            >

              <Popup>
                <strong>{property.title}</strong>
                <br />
                ${property.price}
              </Popup>

            </Marker>
          )
        )}

      </MapContainer>

    </div>
  );
};

export default MapView;