import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import EditPublication from "./pages/Edit/EditPublication";
import MyPublications from "./pages/MyPublications/MyPublications";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar/Navbar";
import Gallery from "./pages/PropertyDetail/Gallery/Gallery.jsx";
import CreateProperty from "./pages/CreateProperty/CreateProperty";
import SearchResults from "./pages/SearchResults/SearchResults";
import PropertyDetail from "./pages/PropertyDetail/PropertyDetail";
import { useState } from "react";
function App() {
  const [quickFilter, setQuickFilter] =
    useState("");

  const [search, setSearch] =
    useState("");

  return (

    <BrowserRouter>

      <Navbar
        setQuickFilter={setQuickFilter}
        search={search}
        setSearch={setSearch}
      />
      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<SearchResults 
          search={search} 
          quickFilter={quickFilter}/>}
        />

        {/* DETAIL */}
        <Route
          path="/property/:id"
          element={
            <ProtectedRoute>
              <PropertyDetail/>
            </ProtectedRoute>
          }
        />
        {/* CREATE */}
        <Route
          path="/create-property"
          element={
            <ProtectedRoute>
              <CreateProperty/>
            </ProtectedRoute>
          }
        />
        {/* MY PUBLICATIONS */}
        <Route
          path="/my-publications"
          element={<MyPublications/>}
        />

        {/* update property */}
        <Route
        path="/edit-publication/:id"
        element={<EditPublication/>}
        />

        {/* Gallery */}
        <Route
        path="/property/:id/gallery"
        element={<Gallery/>}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;