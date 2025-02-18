import { useEffect, useState } from "react";
import { ToastError, ToastSuccess } from "../../../components/toastify/Toast";
import { useNavigate, useParams } from "react-router";
import { useCreateTestMutation } from "../../../store/api/testsAPI";
import Loader from "../../../components/spinningLoader/Loader";

const CreateTest = () => {
  const [formData, setFormData] = useState({
    testName: "",
    description: "",
    date: "",
    startTime: {
      hour: "01",
      minute: "00",
      amPm: "AM",
    },
    endTime: {
      hour: "01",
      minute: "00",
      amPm: "AM",
    },
    pdfUrl: "",
    password: "",
  });

  const { id: groupId } = useParams();
  const [createTest, { isLoading, isError, error, data }] =
    useCreateTestMutation();
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, pdfUrl: file }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.testName ||
      !formData.description ||
      !formData.date ||
      !formData.password
    ) {
      ToastError("All fields are required");
      return;
    }

    const newFormData = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      if (key === "startTime" || key === "endTime") {
        newFormData.append(
          key,
          Object.values(formData[key]).slice(0, 2).join(":") +
            " " +
            formData[key].amPm
        );
      } else {
        if (key === "pdfUrl") {
          newFormData.append("file", value);
        } else {
          newFormData.append(key, value);
        }
      }
    }

    await createTest({ groupId, formData: newFormData });
  };

  useEffect(() => {
    if (isError) {
      ToastError(error.data.errors[0].msg);
    }
  }, [isError, error]);

  useEffect(() => {
    if (data) {
      ToastSuccess("Test uploaded");
      navigate("/dashboard/teacher/view/tests");
    }
  }, [data, navigate]);

  return (
    <div>
      {
        isLoading && <Loader />
      }
      <h1 className="text-2xl font-bold text-blue-600">Create test</h1>

      <div className="flex justify-center">
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col gap-4 font-[500] sm:px-15 py-5 sm:w-7/12 bg-white"
        >
          <InputField
            label="Test Name"
            type="text"
            name="testName"
            value={formData.testName}
            onChange={handleChange}
            className="p-3 outline-none border-2 border-[#99A1AF] rounded-sm w-full"
          />

          <TextAreaField
            label="Test Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="p-3 outline-none border-2 border-[#99A1AF] rounded-sm w-full resize-none"
          />

          <InputField
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="block p-3 outline-none border-2 border-[#99A1AF] rounded-sm w-full"
          />

          <TimeSelector
            label="Start Time"
            hour={formData.startTime.hour}
            minute={formData.startTime.minute}
            ampm={formData.startTime.amPm}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                startTime: {
                  ...prev.startTime,
                  [e.target.name]: e.target.value,
                },
              }))
            }
          />

          <TimeSelector
            label="End Time"
            hour={formData.endTime.hour}
            minute={formData.endTime.minute}
            ampm={formData.endTime.amPm}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                endTime: { ...prev.endTime, [e.target.name]: e.target.value },
              }))
            }
          />

          <div>
            <label htmlFor="questionPaper" className="mb-2 block">
              Upload file
            </label>
            <input
              type="file"
              id="questionPaper"
              name="questionPaper"
              onChange={handleFileUpload}
              accept=".pdf"
              multiple={false}
              className="block p-3 outline-none border-2 border-[#99A1AF] rounded-sm w-full"
            />
          </div>

          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="block p-3 outline-none border-2 border-[#99A1AF] rounded-sm w-full"
          />

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
    </div>
  );
};

export default CreateTest;

const InputField = ({ label, type, name, value, onChange, className }) => (
  <div>
    <label className="mb-2 block">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={className}
    />
  </div>
);

const TextAreaField = ({ label, name, value, onChange, className }) => (
  <div>
    <label className="mb-2 block">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      className={className}
    />
  </div>
);

const TimeSelector = ({ label, hour, minute, ampm, onChange }) => (
  <div>
    <label className="mb-2 block">{label}</label>
    <div className="text-xs flex gap-2">
      <div>
        <label className="mb-2 block text-xs text-center">Hour:</label>
        <select
          name="hour"
          value={hour}
          onChange={onChange}
          className="block p-3 outline-none border-2 border-[#99A1AF] rounded-sm w-full"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i}>{String(i + 1).padStart(2, "0")}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs text-center">Minutes:</label>
        <select
          name="minute"
          value={minute}
          onChange={onChange}
          className="block p-3 outline-none border-2 border-[#99A1AF] rounded-sm w-full"
        >
          {Array.from({ length: 60 }, (_, i) => (
            <option key={i}>{String(i).padStart(2, "0")}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs text-center">AM/PM:</label>
        <select
          name="amPm"
          value={ampm}
          onChange={onChange}
          className="block p-3 outline-none border-2 border-[#99A1AF] rounded-sm w-full"
        >
          <option>AM</option>
          <option>PM</option>
        </select>
      </div>
    </div>
  </div>
);
