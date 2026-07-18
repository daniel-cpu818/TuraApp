import Navbar from "../components/Navbar/Navbar";
import SearchResults from "../pages/SearchResults/SearchResults";

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar  quickFilter={quickFilter}
      setQuickFilter={setQuickFilter}
      />
      <main>{children}</main>
      <SearchResults
        quickFilter={quickFilter}
      />
    </>
  );
};

export default MainLayout;