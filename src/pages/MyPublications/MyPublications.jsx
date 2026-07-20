import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "../../components/PropertyCard/PropertyCard";

import styles from "./MyPublications.module.css";

const MyPublications = () => {
  const { getAccessTokenSilently } = useAuth0();
  
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadMyPublications = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: "https://bookingtura-api"
          }
        });

        const response = await fetch(
          "https://turaapi.onrender.com/api/publications/me",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok)
          throw new Error("No se pudieron cargar las publicaciones.");

        const data = await response.json();

        const mappedPublications = (data.$values || data).map((item) => ({
          publicationId: item.id,
          id: item.property.id,
          title: item.property.title,
          description: item.property.description,
          price: item.property.price,
          city: item.property.hood,
          commune: item.property.commune,
          address: item.property.address,
          propertyTypeId: item.property.propertyTypeId,
          ownerName: item.property.ownerName,
          image:
            item.property.images?.length > 0
              ? item.property.images[0].url
              : "https://placehold.co/600x400",
          isActive: item.isActive,
          startDate: item.startDate,
          endDate: item.endDate
        }));

        setPublications(mappedPublications);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadMyPublications();
  }, [getAccessTokenSilently]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <h2>Cargando publicaciones... </h2>
      </div>
    );
  }

  const handleDelete = async (publicationId) => {
  const confirmDelete = window.confirm(
    "¿Estás seguro de eliminar esta publicación?"
  );

  if (!confirmDelete) return;

  try {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: "https://bookingtura-api"
      }
    });

    const response = await fetch(
      `https://turaapi.onrender.com/api/publications/${publicationId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok)
      throw new Error("No se pudo eliminar la publicación.");

    setPublications((prev) =>
      prev.filter((p) => p.publicationId !== publicationId)
    );

    alert("Publicación eliminada correctamente.");

  } catch (error) {
    console.error(error);
    alert("Error eliminando la publicación.");
  }
};

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Mis publicaciones</h1>

        <p>
          Tienes <strong>{publications.length}</strong> publicaciones.
        </p>
      </div>

      {publications.length === 0 ? (
        <div className={styles.empty}>
          <h3>Aún no has creado publicaciones.</h3>
        </div>
      ) : (
        <div className={styles.grid}>
          {publications.map((publication) => (
            <div
              key={publication.publicationId}
              className={styles.cardContainer}
            >
              <PropertyCard
                property={publication}
                isSelected={false}
                onHover={() => {}}
              />

              <div className={styles.actions}>
                <button
                className={styles.editButton}
                onClick={() =>
                  navigate(`/edit-publication/${publication.publicationId}`)
                }
              >
                Editar
              </button>

                <button
                    className={styles.deleteButton}
                    onClick={() =>
                        handleDelete(publication.publicationId)
                    }
                >
                    Eliminar
                </button>
              </div>
              {publication.isActive ? (
                <span className={`${styles.status} ${styles.active}`}>
                  Activa
                </span>
              ) : (
                <span className={`${styles.status} ${styles.inactive}`}>
                  Inactiva
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPublications;