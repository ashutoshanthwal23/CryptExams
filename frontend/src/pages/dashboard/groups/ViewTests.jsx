import React, { useEffect, useState } from "react";
import TestList from "./TestList";
import { useViewAllTestQuery } from "../../../store/api/testsAPI";
import Loader from "../../../components/spinningLoader/Loader";

const ViewTests = () => {
  const [testInfo, setTestInfo] = useState([]);

  const { data, isLoading, isError, error } = useViewAllTestQuery();
  useEffect(() => {
    if (isError) {
      console.log(error);
    }
  }, [isError, error]);

  useEffect(() => {
    if (data) {
      setTestInfo(data.testInfo);
      console.log(data);
    }
  }, [data]);

  return isLoading ? (
    <Loader />
  ) : (
    <div>
      <TestList tests={testInfo} />
    </div>
  );
};

export default ViewTests;
