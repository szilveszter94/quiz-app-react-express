/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import Loading from "../Loading/Loading";

export const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useContext(UserContext);

  if (loading) {
    return <Loading />;
  }
  if (!currentUser) {
    return <Navigate to="/authentication" />;
  }
  return children;
};
