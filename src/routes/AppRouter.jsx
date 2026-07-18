import { BrowserRouter, Routes, Route } from "react-router-dom";
import SearchResults from "../pages/SearchResults/SearchResults";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchResults />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;