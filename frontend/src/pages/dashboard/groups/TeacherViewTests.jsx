import { useEffect, useState } from "react";
import { useTeacherAllTestsQuery } from "../../../store/api/testsAPI";
import Loader from "../../../components/spinningLoader/Loader";
import TestList from "./TestList";
import { ToastError } from "../../../components/toastify/Toast";

const TeacherViewTests = () => {

  const { data, isLoading, isError, error } = useTeacherAllTestsQuery();

  useEffect(() => {
    if (isError) {
      ToastError("couldn't fetch");
    }
  }, [isError]);

  return (
    isLoading ? <Loader />
    :
    <div>
      <TestList tests={data?.testInfo} />
    </div>
  );
};

export default TeacherViewTests;
