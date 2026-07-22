import styles from "./MainLayout.module.css";
import Navbar from "../components/Navbar/Navbar";

const MainLayout = ({
    children,
    quickFilter,
    setQuickFilter,
    search,
    setSearch,
}) => {

    return (

        <div className={styles.layout}>

            <Navbar
                quickFilter={quickFilter}
                setQuickFilter={setQuickFilter}
                search={search}
                setSearch={setSearch}
            />

            <main className={styles.main}>
                {children}
            </main>

        </div>

    );

};

export default MainLayout;