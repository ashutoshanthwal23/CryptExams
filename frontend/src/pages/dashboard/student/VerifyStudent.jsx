import { useParams } from "react-router";
import { useViewResultQuery } from "../../../store/api/testsAPI";
import TestSubmissionTable from "./TestSubmissionTable";
import Loader from "../../../components/spinningLoader/Loader";
import { useEffect } from "react";
import { ToastSuccess } from "../../../components/toastify/Toast";


const VerifyStudent = () => {
    const {id: testId} = useParams();
    const {data, isLoading, isError, error} = useViewResultQuery(testId);

    useEffect(() => {
        if(isError){
            ToastSuccess("something went wrong")
        }
    }, [isError])
    

    return (
        isLoading ? <Loader />
        :
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Submission Details</h1>
          {
            data && <TestSubmissionTable data={data?.result} />
          }
        </div>
      );
}

export default VerifyStudent;