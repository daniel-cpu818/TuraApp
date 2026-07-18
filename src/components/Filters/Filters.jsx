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

      {/* búsqueda */}
      <input
        type="text"
        name="search"
        placeholder="Buscar..."
        value={filters.search}
        onChange={handleChange}
      />

      {/* tipo */}
      <select
        name="propertyTypeId"
        value={filters.propertyTypeId}
        onChange={handleChange}
      >

        <option value="">
          Todos los tipos
        </option>

        {propertyTypes.map((type) => (

          <option
            key={type.id}
            value={type.id}
          >
            {type.name}
          </option>

        ))}

      </select>

      {/* precio mínimo */}
      <input
        type="number"
        name="minPrice"
        placeholder="Precio mínimo"
        value={filters.minPrice}
        onChange={handleChange}
      />

      {/* precio máximo */}
      <input
        type="number"
        name="maxPrice"
        placeholder="Precio máximo"
        value={filters.maxPrice}
        onChange={handleChange}
      />

      {/* comuna */}
      <input
        type="number"
        name="commune"
        placeholder="Comuna"
        value={filters.commune}
        onChange={handleChange}
      />

    </div>
  );
};

export default Filters;