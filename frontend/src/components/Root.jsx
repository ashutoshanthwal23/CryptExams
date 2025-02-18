import { Outlet } from "react-router";
import { useSelfQuery } from "../store/api/authAPI";
import Loader from "./spinningLoader/Loader";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUser } from "../store/reducers/userReducer";

const Root = () => {
  const { isLoading, isError, error, data } = useSelfQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      console.log(data.user);
      dispatch(setUser(data.user));
    }
  }, [data, dispatch]);

  return isLoading ? <Loader /> : <Outlet />;
};

export default Root;
