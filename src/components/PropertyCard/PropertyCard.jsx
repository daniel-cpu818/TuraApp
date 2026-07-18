import styles from "./PropertyCard.module.css";
import { useNavigate } from "react-router-dom";

const PropertyCard = ({
  property,
  isSelected,
  onHover
}) => {

  const navigate = useNavigate();

  const handleClick = () => {

    console.log(
      "PROPERTY ID:",
      property.id
    );

    navigate(
      `/property/${property.id}`
    );

  };

  return (

    <div
      className={`${styles.card} ${
        isSelected
          ? styles.activeCard
          : ""
      }`}
      onMouseEnter={onHover}
      onClick={handleClick}
    >

      {/* IMAGE */}
      <div className={styles.imageContainer}>

        <img
          src={
            property.image ||
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
          }
          alt={property.title}
        />

        <button
          className={styles.favoriteBtn}
        >
          ♡
        </button>

      </div>

      {/* INFO */}
      <div className={styles.info}>

        <div className={styles.top}>

          <h3>
            {property.title}
          </h3>

          <span className={styles.type}>
            {property.propertyTypeName}
          </span>

        </div>

        <p className={styles.location}>
          📍 {property.city}
        </p>

        <p className={styles.details}>
          Comuna {property.commune}
        </p>

        <p className={styles.address}>
          {property.address}
        </p>

        <p className={styles.price}>
          <strong>
            $
            {Number(
              property.price || 0
            ).toLocaleString()}
          </strong>
        </p>

      </div>

    </div>

  );
};

export default PropertyCard;