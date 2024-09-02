import { useEffect, FC, PropsWithChildren } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAdminCookie } from "../hooks/adminHook";
import Loading from "../page/Loading";

const AdminPrivateRouter: FC<PropsWithChildren> = ({ children }) => {
  const { data, isLoading } = useAdminCookie();
  const navigate = useNavigate();


  useEffect(() => {
    if (!isLoading) {
      if (typeof data?.data?.data === "undefined") {
        navigate("/auth/admin");
      }
    }
  }, [data, isLoading]);

  return isLoading ? (
    <Loading />
  ) : !isLoading && typeof data?.data?.data !== "undefined" ? (
    <>{children}</>
  ) : !isLoading && typeof data?.data?.data === "undefined" ? (
    <Navigate to="/auth/admin" />
  ) : (
    <Navigate to="/auth/admin" />
  );
};

export default AdminPrivateRouter;
