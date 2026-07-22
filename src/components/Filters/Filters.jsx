import styles from "./Filters.module.css";

const Filters = ({
  filters,
  setFilters,
  propertyTypes
}) => {

  const handleChange = (e) => {

    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });

  };

  return (

 <div className={styles.filters}>

  {/* Tipo de propiedad */}
  <div className={styles.filterItem}>
    

    <select
      name="propertyTypeId"
      value={filters.propertyTypeId}
      onChange={handleChange}
    >
      <option value="">Todos los tipos</option>

      {propertyTypes.map(type => (
        <option
          key={type.id}
          value={type.id}
        >
          {type.name}
        </option>
      ))}
    </select>
  </div>

  {/* Precio mínimo */}
  <div className={styles.filterItem}>
    <span>$</span>

    <input
      type="number"
      name="minPrice"
      placeholder="Precio mínimo"
      value={filters.minPrice}
      onChange={handleChange}
    />
  </div>

  {/* Precio máximo */}
  <div className={styles.filterItem}>
    <span>$</span>

    <input
      type="number"
      name="maxPrice"
      placeholder="Precio máximo"
      value={filters.maxPrice}
      onChange={handleChange}
    />
  </div>

  {/* Comuna */}
  <div className={styles.filterItem}>
    

    <select
      name="commune"
      value={filters.commune}
      onChange={handleChange}
    >
      <option value="">Todas las comunas</option>

      {[...Array(12)].map((_, index) => (
        <option
          key={index + 1}
          value={index + 1}
        >
          Comuna {index + 1}
        </option>
      ))}
    </select>
  </div>

</div>
  );
};

export default Filters;