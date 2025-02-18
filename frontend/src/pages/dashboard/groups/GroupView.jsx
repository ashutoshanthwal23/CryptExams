import { useEffect, useState } from "react";
import CreateStudent from "../student/CreateStudent";
import {
  useRemoveStudentMutation,
  useShowGroupQuery,
} from "../../../store/api/groupsAPI";
import { Link, useParams } from "react-router";
import Loader from "../../../components/spinningLoader/Loader";
import { ToastError, ToastSuccess } from "../../../components/toastify/Toast";

const GroupView = () => {
  const { id: groupId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, isError, error } = useShowGroupQuery(groupId);
  const [removeStudent, { isError: removeUserError, data: response }] =
    useRemoveStudentMutation();

  useEffect(() => {
    if (isError) {
      ToastError("something went wrong");
    }
  }, [isError]);

  useEffect(() => {
    if (removeUserError) {
      ToastError("something went wrong");
    }
  }, [removeUserError]);

  useEffect(() => {
    if (response) {
      ToastSuccess("deleted");
    }
  }, [response]);

  if (isLoading) {
    return <Loader />;
  }

  const handleDelete = async (studentId) => {
    if(!groupId || !studentId){
      return;
    }

    await removeStudent({ groupId, studentId });
  };

  return (
    <div>
      {isModalOpen && <CreateStudent setIsModalOpen={setIsModalOpen} />}

      <div className="py-6">
        <h1 className="text-3xl font-semibold text-blue-600 mb-4 border-b border-indigo-300 pb-2 break-words">
          {data?.group?.name}
        </h1>

        <p className="text-gray-600 break-words">{data?.group?.description}</p>
      </div>

      <div className="flex gap-10 flex-col sm:flex-row items-start sm:items-center justify-between mt-5 mb-10">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 py-2 px-8 rounded-sm font-bold text-white cursor-pointer"
        >
          <i className="fa-solid fa-plus mr-2"></i>
          <span>Add Student</span>
        </button>

        <div>
          <Link
            to={`test/create-new`}
            className="bg-[#2196F3] py-2 px-8 rounded-sm font-bold text-white cursor-pointer"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            <span>Create test</span>
          </Link>
        </div>
      </div>

      <h1 className="font-bold text-2xl my-4">All Students</h1>

      <div className="overflow-x-auto">
        <table className="bg-white text-center border-collapse w-full">
          <thead>
            <tr className="bg-blue-100">
              <th className="py-2 px-4 ">Name</th>
              <th className="py-2 px-4 ">Email</th>
              <th className="py-2 px-4 ">Mobile</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data?.group.studentsList.map((s, idx) => {
              return (
                <tr
                  key={s._id}
                  className={`${idx % 2 !== 0 ? "bg-gray-200" : "bg-gray-300"}`}
                >
                  <td className="py-2 px-4 ">{s.name}</td>
                  <td className="py-2 px-4 ">{s.email}</td>
                  <td className="py-2 px-4 ">{s.mobile}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="cursor-pointer text-red-600 px-3 "
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupView;
