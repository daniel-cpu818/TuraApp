import { useEffect, useState } from "react";

import PropertyCard from "../../components/PropertyCard/PropertyCard";
import MapView from "../../components/MapView/MapView";
import Filters from "../../components/Filters/Filters";

import styles from "./SearchResults.module.css";

const SearchResults = ({
  search,
  quickFilter
}) => {

  const [propertyTypes, setPropertyTypes] =
    useState([]);

  const [properties, setProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedProperty, setSelectedProperty] =
    useState(null);

  const [filters, setFilters] =
    useState({

      propertyTypeId: "",

      minPrice: "",

      maxPrice: "",

      commune: ""

    });

  // 🔥 LOAD PROPERTIES
  useEffect(() => {

    const loadProperties = async () => {

      try {

        const response = await fetch(
          "https://turaapi.onrender.com/api/publications"
        );

        const data =
          await response.json();

        const propertiesArray =
          data.$values || data;

        const mappedProperties =
          propertiesArray.map(
            (item, index) => ({

              id: item.id,

              propertyId: item.property.id,

              title:
                item.property.title,

              city:
                item.property.hood,

              country:
                "Colombia",

              price:
                item.property.price,

              description:
                item.property.description,

              ownerPhone:
                item.property.ownerPhone,

              address:
                item.property.address,

              latitude: item.property.latitude,

              longitude: item.property.longitude,

              propertyTypeId:
                item.property.propertyTypeId,

              commune:
                item.property.commune,

              image:
                item.property.images?.length > 0
                  ? `https://turaapi.onrender.com${item.property.images[0].url}`
                  : "https://placehold.co/600x400"

            })
          );

        setProperties(
          mappedProperties
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }
    };

    loadProperties();

  }, []);

  // 🔥 LOAD PROPERTY TYPES
  useEffect(() => {

    const loadPropertyTypes =
      async () => {

        try {

          const response =
            await fetch(
              "https://turaapi.onrender.com/api/property-types"
            );

          if (!response.ok) {
            return;
          }

          const data =
            await response.json();

          setPropertyTypes(
            data.$values || data
          );

        } catch (error) {

          console.error(error);

        }
      };

    loadPropertyTypes();

  }, []);

  // 🔥 FILTERS
  const filteredProperties =
    properties.filter((property) => {

      const title =
        property.title
          ?.toLowerCase() || "";

      const description =
        property.description
          ?.toLowerCase() || "";

      const city =
        property.city
          ?.toLowerCase() || "";

      const address =
        property.address
          ?.toLowerCase() || "";

      const commune =
        String(
          property.commune
        ).toLowerCase();

      const searchText =
        search?.toLowerCase() || "";

      // 🔍 SEARCH
      const matchesSearch =

        title.includes(searchText)

        ||

        description.includes(searchText)

        ||

        city.includes(searchText)

        ||

        address.includes(searchText)

        ||

        commune.includes(searchText);

      // ⚡ QUICK FILTER
      const matchesQuickFilter =

        quickFilter === ""

          ? true

          : title.includes(
              quickFilter.toLowerCase()
            );

      // 🏷 TYPE
      const matchesType =

        !filters.propertyTypeId ||

        property.propertyTypeId ===
        filters.propertyTypeId;

      // 💰 MIN PRICE
      const matchesMinPrice =

        !filters.minPrice ||

        property.price >=
        Number(filters.minPrice);

      // 💰 MAX PRICE
      const matchesMaxPrice =

        !filters.maxPrice ||

        property.price <=
        Number(filters.maxPrice);

      // 📍 COMMUNE
      const matchesCommune =

        !filters.commune ||

        String(property.commune) ===
        filters.commune;

      return (

        matchesSearch &&

        matchesQuickFilter &&

        matchesType &&

        matchesMinPrice &&

        matchesMaxPrice &&

        matchesCommune

      );
    });

  if (loading) {

    return (
      <h2>
        Cargando propiedades...
      </h2>
    );
  }

  return (

    <div className={styles.container}>

      {/* FILTERS */}
      <Filters
        filters={filters}
        setFilters={setFilters}
        propertyTypes={propertyTypes}
      />

      {/* CONTENT */}
      <div className={styles.content}>

        {/* LEFT */}
        <div className={styles.leftSection}>

          <h2>
            Más de {
              filteredProperties.length
            } alojamientos
          </h2>

          <div className={styles.cardsContainer}>

            {filteredProperties.map(
              (property, index) => (

                <PropertyCard
                  key={property.id}

                  property={property}

                  isSelected={
                    selectedProperty === index
                  }

                  onHover={() =>
                    setSelectedProperty(index)
                  }
                />

              )
            )}

          </div>

        </div>

        {/* RIGHT */}
        <div className={styles.mapSection}>

          <div className={styles.fakeMap}>

            <MapView
              properties={
                filteredProperties
              }

              selectedProperty={
                selectedProperty
              }

              setSelectedProperty={
                setSelectedProperty
              }
            />

          </div>

        </div>

      </div>

    </div>
  );
};

export default SearchResults;