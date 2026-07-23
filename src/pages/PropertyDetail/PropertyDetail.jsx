import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./PropertyDetail.module.css";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const response = await fetch(
          `https://turaapi.onrender.com/api/publications/${id}`
        );

        if (!response.ok) {
          throw new Error("No se pudo cargar la propiedad");
        }

        const data = await response.json();

        console.log("PUBLICATION:", data);

        setProperty({
          publicationId: data.id,

          propertyId: data.property.id,

          title: data.property.title,

          description: data.property.description,

          price: data.property.price,

          hood: data.property.hood,

          commune: data.property.commune,

          address: data.property.address,

          ownerName: data.property.ownerName,

          ownerPhone: data.property.ownerPhone,

          latitude: data.property.latitude,

          longitude: data.property.longitude,

          image:
            data.property.images?.length > 0
              ? data.property.images[0].url
              : "https://placehold.co/1200x800",

          images: data.property.images || []
        });
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
      <div className={styles.loadingContainer}>
  
        <img
          src="/Logotipoo.png"
          alt="PuertoHogar"
          className={styles.loadingLogo}
        />
  
        <div className={styles.spinner}></div>
  
        {/* <p className={styles.loadingText}>
          Cargando propiedades...
        </p> */}
  
      </div>
    );
  }

  if (!property) {
  return (

    <div className={styles.notFound}>

      {/* <img
        src="/logo.png"
        alt="PuertoHogar"
        className={styles.notFoundLogo}
      /> */}

      <h2>Propiedad no encontrada</h2>

      <p>
        Es posible que esta publicación haya sido eliminada
        o que el enlace ya no sea válido.
      </p>

      <button
        className={styles.backHome}
        onClick={() => navigate("/")}
      >
        Volver al inicio
      </button>

    </div>

  );
}

  const handleContact = () => {
    const phone = `57${property.ownerPhone}`;

    const message = `Hola ${property.ownerName}, vi tu publicación "${property.title}" en PuertoHogar y estoy interesado en obtener más información.`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const openGoogleMaps = () => {
    if (property.latitude && property.longitude) {
      window.open(
        `https://www.google.com/maps?q=${property.latitude},${property.longitude}`,
        "_blank"
      );
    } else {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          property.address
        )}`,
        "_blank"
      );
    }
  };

 return (
  <div className={styles.container}>

    {/* ================= HEADER ================= */}
    <div className={styles.header}>
      <h1>{property.title}</h1>

      <p className={styles.location}>
         {property.hood} · Comuna {property.commune}
      </p>
    </div>

    {/* ================= GALERÍA ================= */}
<div className={styles.hero}>

    <div className={styles.imageContainer}>

        {property.images.length > 1 && (
            <button
                className={styles.arrowLeft}
                onClick={() =>
                    setCurrentImage((prev) =>
                        prev === 0
                            ? property.images.length - 1
                            : prev - 1
                    )
                }
            >
                ❮
            </button>
        )}

        <img
            src={
                property.images.length
                    ? property.images[currentImage].url
                    : property.image
            }
            alt={property.title}
            className={styles.propertyImage}
            onClick={() => navigate(`/property/${id}/gallery`)}
        />

        {property.images.length > 1 && (
            <button
                className={styles.arrowRight}
                onClick={() =>
                    setCurrentImage((prev) =>
                        prev === property.images.length - 1
                            ? 0
                            : prev + 1
                    )
                }
            >
                ❯
            </button>
        )}

    </div>

    <div className={styles.mapContainer}>

        <iframe
            title="Ubicación"
            loading="lazy"
            allowFullScreen
            src={
                property.latitude && property.longitude
                    ? `https://www.google.com/maps?q=${property.latitude},${property.longitude}&z=16&output=embed`
                    : `https://www.google.com/maps?q=${encodeURIComponent(
                          property.address
                      )}&z=16&output=embed`
            }
        />

        <button
            className={styles.mapButton}
            onClick={openGoogleMaps}
        >
            Ver ubicación
        </button>

    </div>

</div>

    {/* ================= CONTENIDO ================= */}
    <div className={styles.content}>

      {/* Información */}
      <div className={styles.left}>

        <section>
          <h2>Descripción</h2>
          <p>{property.description}</p>
        </section>

        <section>
          <h3>Dirección</h3>
          <p>{property.address}</p>
        </section>

       

      </div>

      {/* Tarjeta lateral */}
      <aside className={styles.right}>

        <div className={styles.bookingCard}>

          <h2>
            $
            {property.price.toLocaleString("es-CO")}
          </h2>

          <p>
            Propietario
            <br />
            <strong>{property.ownerName}</strong>
          </p>

          <button
            className={styles.contactBtn}
            onClick={handleContact}
          >
            Contactar por WhatsApp
          </button>

        </div>

      </aside>

    </div>

    

  </div>
);
};

export default PropertyDetail;