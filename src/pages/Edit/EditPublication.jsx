import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import styles from "./EditPublication.module.css";

const EditPublication = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const { getAccessTokenSilently } = useAuth0();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({

    title: "",

    description: "",

    price: "",

    propertyTypeId: "",

    hood: "",

    commune: "",

    piso: "",

    address: "",

    startDate: "",

    endDate: "",

    type: 2,

    isActive: true

  });

  useEffect(() => {

    const loadPublication = async () => {

      try {

        const token =
          await getAccessTokenSilently({

            authorizationParams: {

              audience:
                "https://bookingtura-api"

            }

          });

        const response = await fetch(

          `https://turaapi.onrender.com/api/publications/${id}`,

          {

            headers: {

              Authorization:
                `Bearer ${token}`

            }

          }

        );

        if (!response.ok)
          throw new Error("No se pudo cargar la publicación.");

        const data = await response.json();

        console.log(data);

        setFormData({

          title: data.property.title,

          description: data.property.description,

          price: data.property.price,

          propertyTypeId:
            data.property.propertyTypeId,

          hood:
            data.property.hood,

          commune:
            data.property.commune,

          piso:
            data.property.piso,

          address:
            data.property.address,

          startDate:
            data.startDate.substring(0,10),

          endDate:
            data.endDate.substring(0,10),

          type:
            data.type,

          isActive:
            data.isActive

        });

      }

      catch(error){

        console.error(error);

      }

      finally{

        setLoading(false);

      }

    };

    loadPublication();

  }, [id, getAccessTokenSilently]);

  const handleChange = (e)=>{

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value

    });

  };

  const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const token =
      await getAccessTokenSilently({

        authorizationParams: {

          audience:
            "https://bookingtura-api"

        }

      });

    const response = await fetch(

      `https://turaapi.onrender.com/api/publications/${id}`,

      {

        method: "PUT",

        headers: {

          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`

        },

        body: JSON.stringify({

          title: formData.title,

          description: formData.description,

          price: Number(formData.price),

          propertyTypeId: formData.propertyTypeId,

          hood: formData.hood,

          commune: formData.commune,

          piso: formData.piso,

          address: formData.address,

          startDate: formData.startDate,

          endDate: formData.endDate,

          type: Number(formData.type),

          isActive: formData.isActive

        })

      }

    );

    if (!response.ok) {

      const error = await response.text();

      console.error(error);

      throw new Error("No se pudo actualizar la publicación.");

    }

    alert("Publicación actualizada correctamente.");

    navigate("/my-publications");

  } catch (error) {

    console.error(error);

    alert("Error actualizando la publicación.");

  }

};

  if(loading){

    return <h2>Cargando publicación...</h2>;

  }

  return(

    <div className={styles.container}>

      <h1>Editar publicación</h1>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Título"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descripción"
        />

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Precio"
        />

        <input
          name="hood"
          value={formData.hood}
          onChange={handleChange}
          placeholder="Barrio"
        />

        <input
          name="commune"
          value={formData.commune}
          onChange={handleChange}
          placeholder="Comuna"
        />

        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Dirección"
        />

        <input
          name="piso"
          value={formData.piso}
          onChange={handleChange}
          placeholder="Piso"
        />

        {/* <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
        />

        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
        /> */}

        <button type="submit">

          Guardar cambios

        </button>

      </form>

    </div>

  );

};

export default EditPublication;