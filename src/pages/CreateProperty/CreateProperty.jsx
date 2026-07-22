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

      <h1>Publica tu alojamiento</h1>

      <form onSubmit={handleSubmit}>

        {/* TÍTULO */}
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

        {/* DESCRIPCIÓN */}
        <div className={styles.formGroup}>
          <label>Descripción</label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* PRECIO */}
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

        {/* BARRIO */}
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

        {/* DIRECCIÓN */}
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

        {/* COMUNA */}
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

        {/* PISO */}
        <div className={styles.formGroup}>
          <label>Piso</label>

          <input
            type="text"
            name="piso"
            value={formData.piso}
            onChange={handleChange}
          />
        </div>

        {/* TIPO DE PROPIEDAD */}
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

        </div>

        {/* IMÁGENES */}
        <div className={styles.formGroup}>

          <label>Imágenes</label>

          <label className={styles.fileUpload}>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImagesChange}
            />

            <div className={styles.uploadIcon}>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>

            </div>

            <div className={styles.uploadTitle}>
              Sube tus fotografías
            </div>

            <div className={styles.uploadText}>
              Haz clic o arrastra las imágenes aquí
              <br />
              JPG • PNG • WEBP
            </div>

          </label>

          {images.length > 0 && (
            <p className={styles.selectedFile}>
              ✅ {images.length} imagen(es) seleccionada(s)
            </p>
          )}

          <div className={styles.previewContainer}>

            {images.map((image, index) => (

              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt={`preview-${index}`}
                className={styles.previewImage}
              />

            ))}

          </div>

        </div>

        {/* BOTÓN */}
        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creando publicación..."
            : "Publicar alojamiento"}
        </button>

      </form>

    </div>

  </div>
);

};

export default CreateProperty;