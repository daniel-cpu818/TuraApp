import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import styles from "./PropertyDetail.module.css";

const PropertyDetail = () => {

  const { id } = useParams();

  const [property, setProperty] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const loadProperty = async () => {

      try {

        const response = await fetch(
          `https://turaapi.onrender.com/api/publications/${id}`
        );

        if (!response.ok) {
          throw new Error(
            "No se pudo cargar la propiedad"
          );
        }

        const data =
          await response.json();

        console.log(
          "PUBLICATION:",
          data
        );

        setProperty({

          publicationId:
            data.id,

          propertyId:
            data.property.id,

          title:
            data.property.title,

          description:
            data.property.description,

          price:
            data.property.price,

          hood:
            data.property.hood,

          commune:
            data.property.commune,

          address:
            data.property.address,

          ownerName:
            data.property.ownerName,

          ownerPhone:
            data.property.ownerPhone,

          image:
            data.property.images?.length > 0
              ? data.property.images[0].url
              : "https://placehold.co/1200x800",

          images:
            data.property.images || []

        });
        console.log(data);
        console.log(data.property.ownerPhone);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }
    };

    loadProperty();

  }, [id]);

  if (loading) {

    return (
      <h2>
        Cargando propiedad...
      </h2>
    );
  }

  if (!property) {

    return (
      <h2>
        Propiedad no encontrada
      </h2>
    );
  }
  const handleContact = () => {
  const phone = `57${property.ownerPhone}`;

  const message =
    `Hola ${property.ownerName}, vi tu publicación "${property.title}" en PuertoHogar y estoy interesado en obtener más información. ¿Podrías contactarme?`;

  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
};

  return (

    <div className={styles.container}>

      {/* HEADER */}
      <div className={styles.header}>

        <h1>
          {property.title}
        </h1>

        <p className={styles.location}>
          📍 {property.hood} · Comuna{" "}
          {property.commune}
        </p>

      </div>

      {/* MAIN IMAGE */}
      <div className={styles.imageContainer}>

        <img
          src={property.image}
          alt={property.title}
        />

      </div>

      {/* CONTENT */}
      <div className={styles.content}>

        {/* LEFT */}
        <div className={styles.left}>

          <h2>
            Descripción
          </h2>

          <p>
            {property.description}
          </p>

          <h3>
            Dirección
          </h3>

          <p>
            {property.address}
          </p>

        </div>

        {/* RIGHT */}
        <div className={styles.right}>

          <div className={styles.bookingCard}>

            <h2>
              $
              {property.price.toLocaleString(
                "es-CO"
              )}
            </h2>

            <p>
              Propietario:
              <br />
              <strong>
                {property.ownerName}
              </strong>
            </p>

            <p>
              {property.ownerEmail}
            </p>

            <button
              className={styles.contactBtn}
              onClick={handleContact}
            >
              Contactar
            </button>

          </div>

        </div>

      </div>

    </div>

  );
};

export default PropertyDetail;