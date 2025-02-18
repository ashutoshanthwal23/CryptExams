import { useEffect, useState } from "react";
import { useCreateGroupMutation } from "../../../store/api/groupsAPI";
import { ToastError } from "../../../components/toastify/Toast";
import { useNavigate } from "react-router";

const CreateGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [createGroup, { isLoading, isError, error, data }] =
    useCreateGroupMutation();
  const navigate = useNavigate();

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    if (!groupName || !description) {
      ToastError("All fields are required");
      return;
    }
    await createGroup({ name: groupName, description });
  };

  useEffect(() => {
    if (isError) {
      console.log(error);
      ToastError("something went wrong");
    }
  }, [isError]);

  useEffect(() => {
    if (data) {
      ToastError("group created");
      navigate("/dashboard/teacher/groups");
    }
  }, [data, navigate]);

  return (
    <div className="sm:w-6/12 mx-auto bg-white">
      <form
        onSubmit={handleCreateGroup}
        className="flex flex-col gap-4 font-[500] py-6 px-3 sm:px-7 mt-12"
      >
        <h1 className="text-2xl font-bold text-blue-600">Create New Group</h1>

        <div>
          <label htmlFor="name" className="mb-2 block">
            Enter Group Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="p-3 outline-none border-2 border-[#99A1AF] rounded-sm w-full"
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-2 block">
            Enter Group Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            placeholder="Group Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-3 outline-none border-2 border-[#99A1AF] rounded-sm w-full"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{ cursor: !isLoading && 'pointer', opacity: isLoading && .5}}
          className="p-3.5 rounded-lg outline-0 mt-[2rem] cursor-pointer mb-[1rem] bg-blue-600 hover:bg-blue-700 text-white"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;
