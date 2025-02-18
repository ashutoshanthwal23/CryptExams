import { useEffect, useState } from "react";
import Input from "../../../components/Input";
import "./Modal.css";
import { ToastError, ToastSuccess } from "../../../components/toastify/Toast";
import { useAddStudentMutation } from "../../../store/api/groupsAPI";
import { useParams } from "react-router";

const CreateStudent = ({ setIsModalOpen }) => {
  const [user, setUser] = useState({
    name: "",
    mobile: "",
    email: "",
    rollNumber: "",
  });

  const [openModal, setOpenModal] = useState(true);
  const [addStudent, { isLoading, isError, error, data }] = useAddStudentMutation();
  const { id: groupId } = useParams();

  const handleOnChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const closeModal = () => {
    setOpenModal(false);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 400);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!user.name || !user.mobile || !user.email || !user.rollNumber) {
      ToastError("All fields are required");
      return;
    }
    await addStudent({ groupId, user });
  };

  useEffect(() => {
    if (data) {
      ToastSuccess("added");
      closeModal();
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      ToastError("something went wrong");
    }
  }, [isError]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 w-full h-screen flex justify-center items-center ${
        openModal ? "open-modal" : "close-modal"
      }`}
      style={{
        backgroundColor: "rgba(0, 0, 0, .9)",
      }}
    >
      <div className="sm:w-5/12 h-[80%] bg-gray-100 relative">
        <button
          onClick={closeModal}
          className="bg-red-600 hover:bg-red-700 text-white w-10 h-10 rounded-full absolute top-5 right-5 flex items-center 
        justify-center text-xl font-bold transition-all duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none 
        focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
        >
          X
        </button>

        <form
          onSubmit={handleRegister}
          className="flex flex-col gap-4 font-[500] py-6 px-7 mt-12"
        >
          <h1 className="text-2xl font-bold text-blue-600">Add New Student</h1>

          <Input
            type="text"
            name="name"
            placeholder="Full name"
            value={user.fullName}
            onChange={handleOnChange}
          />

          <Input
            type="text"
            name="mobile"
            placeholder="Phone number"
            value={user.phoneNumber}
            onChange={handleOnChange}
          />

          <Input
            type="email"
            name="email"
            placeholder="Email address"
            value={user.email}
            onChange={handleOnChange}
          />

          <Input
            type="text"
            name="rollNumber"
            placeholder="Roll number"
            value={user.rollNumber}
            onChange={handleOnChange}
          />

          <button
            type="submit"
            disabled={isLoading}
            style={{ cursor: !isLoading && 'pointer', opacity: isLoading && .5}}
            className="p-3.5 rounded-lg outline-0 mt-[2rem] mb-[1rem] bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStudent;
