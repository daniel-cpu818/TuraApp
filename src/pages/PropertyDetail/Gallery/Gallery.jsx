import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Gallery.module.css";
import logoWhite from "../../../assets/back-arrow.png";

const Gallery = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [images, setImages] = useState([]);
    const [current, setCurrent] = useState(0);

    const [scale, setScale] = useState(1);

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {

        const loadProperty = async () => {

            const response = await fetch(
                `https://turaapi.onrender.com/api/publications/${id}`
            );

            const data = await response.json();

            setImages(data.property.images || []);
        };

        loadProperty();

    }, [id]);

    /* -------------------------
        Navegación
    ------------------------- */

    const nextImage = () => {

        setScale(1);

        setCurrent(prev =>
            prev === images.length - 1
                ? 0
                : prev + 1
        );
    };

    const previousImage = () => {

        setScale(1);

        setCurrent(prev =>
            prev === 0
                ? images.length - 1
                : prev - 1
        );
    };

    /* -------------------------
        Teclado
    ------------------------- */

    useEffect(() => {

        const handleKey = (e) => {

            if (e.key === "ArrowRight")
                nextImage();

            if (e.key === "ArrowLeft")
                previousImage();

            if (e.key === "Escape")
                navigate(-1);

        };

        window.addEventListener("keydown", handleKey);

        return () =>
            window.removeEventListener("keydown", handleKey);

    }, [images]);

    /* -------------------------
        Zoom
    ------------------------- */

    const handleWheel = (e) => {

        e.preventDefault();

        if (e.deltaY < 0) {

            setScale(prev => Math.min(prev + .2, 4));

        } else {

            setScale(prev => Math.max(prev - .2, 1));

        }

    };

    const handleDoubleClick = () => {

        setScale(prev =>
            prev === 1
                ? 2
                : 1
        );

    };

    /* -------------------------
        Swipe móvil
    ------------------------- */

    const handleTouchStart = (e) => {

        touchStartX.current =
            e.changedTouches[0].clientX;

    };

    const handleTouchEnd = (e) => {

        touchEndX.current =
            e.changedTouches[0].clientX;

        if (touchStartX.current - touchEndX.current > 60)
            nextImage();

        if (touchEndX.current - touchStartX.current > 60)
            previousImage();

    };

    if (!images.length) {

        return (
            <div className={styles.loading}>
                Cargando imágenes...
            </div>
        );

    }

    return (

        <div className={styles.gallery}>

            {/* HEADER */}

            <div className={styles.header}>

                <button
                    onClick={() => navigate(-1)}
                    className={styles.backButton}
                    aria-label="Volver"
                >
                    <img
                        src="/back-arrow.png"
                        alt="Volver"
                        className={styles.logo}
                    />
                </button>

                <span
                    className={styles.counter}>

                    {current + 1} / {images.length}

                </span>

            </div>

            {/* IMAGEN */}

            <div
                className={styles.viewer}
                onWheel={handleWheel}
                onDoubleClick={handleDoubleClick}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >

                <button
                    className={styles.left}
                    onClick={previousImage}
                >
                    ❮
                </button>

                <img
                    src={images[current].url}
                    alt=""
                    draggable={false}
                    style={{
                        transform: `scale(${scale})`
                    }}
                />

                <button
                    className={styles.right}
                    onClick={nextImage}
                >
                    ❯
                </button>

            </div>

            {/* MINIATURAS */}

            <div className={styles.thumbnails}>

                {images.map((image, index) => (

                    <img

                        key={image.id ?? index}

                        src={image.url}

                        className={
                            index === current
                                ? styles.active
                                : ""
                        }

                        onClick={() => {

                            setCurrent(index);
                            setScale(1);

                        }}

                        alt=""
                    />

                ))}

            </div>

        </div>

    );

};

export default Gallery;