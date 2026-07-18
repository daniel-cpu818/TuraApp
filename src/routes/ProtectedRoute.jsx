import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {

  const {
    isAuthenticated,
    loginWithRedirect,
    isLoading
  } = useAuth0();

  useEffect(() => {

    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }

  }, [isLoading, isAuthenticated]);

  if (isLoading || !isAuthenticated) {
    return <h2>Redirigiendo...</h2>;
  }

  return children;
};

export default ProtectedRoute;