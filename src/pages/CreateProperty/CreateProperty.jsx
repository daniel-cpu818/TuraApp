import { useAuth0 } from "@auth0/auth0-react";
import styles from "./CreateProperty.module.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
const CreateProperty = () => {
    
    const { getAccessTokenSilently } = useAuth0();
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [formData, setFormData] = useState({
        
        title: "",
        description: "",
        price: "",
        propertyTypeId: "",
        hood: "",
        piso: "",
        commune: "",
        address: "",
        images: []
        
    });
    console.log(
  "PROPERTY TYPE ID:",
  formData.propertyTypeId
);
    useEffect(() => {
        const loadPropertyTypes = async () => {
            
            try {
                
                const response = await fetch(
                    "https://turaapi.onrender.com/api/property-types"
                );
                
                const data = await response.json();
                
                console.log("PROPERTY TYPES:", data);
                
                const typesArray = data.$values || data;
                
                setPropertyTypes(typesArray);
                
            } catch (error) {
                
                console.error(error);
                
            }
        };
        
        loadPropertyTypes();
        
    }, []);
    
    const [loading, setLoading] = useState(false);
    
    // 🔥 manejar inputs
    const handleChange = (e) => {
        
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        
    };
    const [images, setImages] = useState([]);
    
    // 🔥 manejar imágenes
    const handleImagesChange = (e) => {
    
      const files = Array.from(e.target.files);
    
      setImages(files);
    
    };
    // 🔥 submit
    const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    setLoading(true);

    // 🔥 TOKEN
    const token =
      await getAccessTokenSilently({

        authorizationParams: {

          audience:
            "https://bookingtura-api",

          scope:
            "openid profile email"

        }

      });

    // 🔥 FORMDATA
    const payload =
      new FormData();

    payload.append(
      "title",
      formData.title
    );

    payload.append(
      "description",
      formData.description
    );

    payload.append(
      "price",
      formData.price
    );

    payload.append(
      "propertyTypeId",
      formData.propertyTypeId
    );

    payload.append(
      "hood",
      formData.hood
    );

    payload.append(
      "piso",
      formData.piso
    );

    payload.append(
      "commune",
      formData.commune
    );

    payload.append(
      "address",
      formData.address
    );

    // payload.append(
    //   "type",
    //   formData.type
    // );

    // payload.append(
    //   "startDate",
    //   formData.startDate
    // );

    // payload.append(
    //   "endDate",
    //   formData.endDate
    // );

    payload.append(
      "isActive",
      "true"
    );
    payload.append(
      "startDate",
      new Date().toISOString()
    );
    payload.append(
      "endDate",
      new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString()
    );



    console.log(formData);

    // 🔥 IMÁGENES
    images.forEach((image) => {

      payload.append(
        "images",
        image
      );

    });

    // 🔥 DEBUG
    for (let pair of payload.entries()) {

      console.log(
        pair[0],
        pair[1]
      );

    }
    
    // 🔥 REQUEST
    const response = await fetch(
      "https://turaapi.onrender.com/api/publications/with-images",
      {

        method: "POST",

        headers: {

          Authorization:
            `Bearer ${token}`

        },

        body: payload

      }
    );

    

    // 🔥 ERROR
    if (!response.ok) {

      const error =
        await response.text();

      console.error(error);

      throw new Error(error);

    }

    // 🔥 SUCCESS
    const data =
      await response.json();

    console.log(
      "PUBLICATION CREATED:",
      data
    );

   alert("Publicación creada correctamente");

   setTimeout(() => {
    navigate("/");
   }, 500);

  } catch (error) {

    console.error(error);

    alert(
      "Error creando publicación"
    );

  } finally {

    setLoading(false);

  }

};

  return (

    <div className={styles.container}>

      <div className={styles.formCard}>

        <h1>
          Publica tu alojamiento
        </h1>

        <form onSubmit={handleSubmit}>

          {/* TITLE */}
          <div className={styles.formGroup}>
            <label>Título</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className={styles.formGroup}>
            <label>Descripción</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* PRICE */}
          <div className={styles.formGroup}>
            <label>Precio</label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          {/* HOOD */}
          <div className={styles.formGroup}>
            <label>Barrio</label>

            <input
              type="text"
              name="hood"
              value={formData.hood}
              onChange={handleChange}
              required
            />
          </div>

          {/* ADDRESS */}
          <div className={styles.formGroup}>
            <label>Dirección</label>

            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          {/* COMMUNE */}
          <div className={styles.formGroup}>
            <label>Comuna / Localidad</label>

            <input
            type="number"
            name="commune"
            value={formData.commune}
            onChange={handleChange}
            min="1"
            max="12"
            step="1"
            required
            />
          </div>

          {/* FLOOR */}
          <div className={styles.formGroup}>
            <label>Piso</label>

            <input
              type="text"
              name="piso"
              value={formData.piso}
              onChange={handleChange}
            />
          </div>

          {/* PROPERTY TYPE */}
          <div className={styles.formGroup}>

  <label>Tipo de propiedad</label>

  <select
    name="propertyTypeId"
    value={formData.propertyTypeId}
    onChange={handleChange}
    required
    >

    <option value="">
        Selecciona un tipo
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
    <div className={styles.formGroup}>

  <label>Imágenes</label>

  <input
    type="file"
    multiple
    accept="image/*"
    onChange={handleImagesChange}
  />

</div>
<div className={styles.previewContainer}>

  {images.map((image, index) => (

    <img
      key={index}
      src={URL.createObjectURL(image)}
      alt="preview"
      className={styles.previewImage}
    />

  ))}

</div>
        </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
          >
            {
              loading
                ? "Creando..."
                : "Crear propiedad"
            }
          </button>

        </form>

      </div>

    </div>
  );
};

export default CreateProperty;