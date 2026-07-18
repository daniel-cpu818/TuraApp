import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { useEffect, useState } from "react";


const Navbar = ({
  quickFilter,
  setQuickFilter,
  search,
  setSearch
}) => {
  const [currentUser, setCurrentUser] =
  useState(null);

  const [showProfileModal, setShowProfileModal] =
  useState(false);

  const [profileData, setProfileData] =
  useState({
    name: "",
    phone: ""
  });
  
  const {

    loginWithRedirect,

    logout,

    isAuthenticated,

    user,

    getAccessTokenSilently

  } = useAuth0();

  // 🔥 sync automático
  useEffect(() => {

    const syncUser = async () => {

      try {

        const token =
          await getAccessTokenSilently({

            authorizationParams: {

              audience:
                "https://bookingtura-api",

              scope:
                "openid profile email"
            }
          });
          console.log(
        "ACCESS TOKEN:",
        token
      );
        await fetch(
          "https://turaapi.onrender.com/api/auth/sync",
          {

            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );
        const meResponse = await fetch(
          "https://turaapi.onrender.com/api/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const meData =
          await meResponse.json();

        console.log("USER:", meData);

        setCurrentUser(meData);

        if (!meData.phone) {

          setShowProfileModal(true);

        }

      } catch (error) {

        console.error(error);

      }
    };

    if (isAuthenticated) {
      syncUser();
    }

  }, [
    isAuthenticated,
    getAccessTokenSilently
  ]);
const handleCompleteProfile =
  async () => {

    try {

      const token =
        await getAccessTokenSilently({
          authorizationParams: {
            audience:
              "https://bookingtura-api"
          }
        });

      const response =
        await fetch(
          "https://turaapi.onrender.com/api/users/complete-profile",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              name: profileData.name,
              phone: profileData.phone
            })
          }
        );

        console.log("STATUS:", response.status);

        const text = await response.text();

        console.log("RESPONSE:", text);

        if (!response.ok) {
          throw new Error(text);
        }

      if (!response.ok) {

        const error =
          await response.text();

        throw new Error(error);

      }

      alert(
        "Perfil actualizado"
      );

      setShowProfileModal(false);

    } catch (error) {

      console.error(error);

      alert(
        "Error actualizando perfil"
      );

    }

  };

 return (
  <>
    <nav className={styles.navbar}>

      {/* 🔴 LOGO */}
      <div className={styles.logo}>
        <Link
          to="/"
          className={styles.logoLink}
        >
          PuertoHogar
        </Link>
      </div>

      {/* 🔍 QUICK SEARCH */}
      <div>
        <input
          type="text"
          placeholder="Buscar propiedades..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className={styles.searchInput}
        />
      </div>

      {/* 👤 USER */}
      <div className={styles.userSection}>

        {!isAuthenticated ? (

          <button
            className={styles.loginBtn}
            onClick={() =>
              loginWithRedirect()
            }
          >
            Iniciar sesión
          </button>

        ) : (

          <div className={styles.userMenu}>

            <img
              src={user?.picture}
              alt="avatar"
              className={styles.avatar}
            />

            <div className={styles.dropdown}>

              <p>{user?.name}</p>

                      <button>
                        <Link
                          to="/create-property"
                          className={styles.dropdownLink}
                        >
                          Vender mi propiedad
                        </Link>
                      </button>
                  <button >
                    <Link
                      to="/my-publications"
                      className={styles.dropdownLink}
                    >
                      Mis propiedades
                    </Link>
                  </button>
                  <button
                    onClick={() =>
                      logout({
                        logoutParams: {
                          returnTo:
                            window.location.origin
                        }
                      })
                    }
                  >
                    Cerrar sesión
                  </button>


            </div>

          </div>

        )}

      </div>

    </nav>

    {/* 🔥 MODAL PERFIL INCOMPLETO */}
    {showProfileModal && (
  <div className={styles.modalOverlay}>
    <div className={styles.profileModal}>

      <h2 className={styles.modalTitle}>
        Completa tu perfil
      </h2>

      <p className={styles.modalText}>
        Necesitamos algunos datos para que los
        propietarios puedan contactarte.
      </p>

      <input
        className={styles.modalInput}
        type="text"
        placeholder="Nombre completo"
        value={profileData.name}
        onChange={(e) =>
          setProfileData({
            ...profileData,
            name: e.target.value
          })
        }
      />

      <input
        className={styles.modalInput}
        type="text"
        placeholder="WhatsApp"
        value={profileData.phone}
        onChange={(e) =>
          setProfileData({
            ...profileData,
            phone: e.target.value
          })
        }
      />

      <button
        className={styles.modalButton}
        onClick={handleCompleteProfile}
      >
        Guardar
      </button>

    </div>
  </div>
)}

  </>
);
};

export default Navbar;