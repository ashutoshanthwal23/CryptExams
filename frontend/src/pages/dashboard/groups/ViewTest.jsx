import { Link, useParams } from "react-router";
import {
  useSendMessageMutation,
  useTeacherviewTestQuery,
} from "../../../store/api/testsAPI";
import { useEffect, useState } from "react";
import {
  ToastError,
  ToastInfo,
  ToastSuccess,
} from "../../../components/toastify/Toast";
import Loader from "../../../components/spinningLoader/Loader";
import { formattedDate } from "../../utils/dateTime";
import { showError } from "../../utils/responseError";

const TestCard = ({ test }) => {

  const [sendMessage, { isError, error, isLoading, data }] = useSendMessageMutation();

  const copyFileLink = async () => {
    try {
      await navigator.clipboard.writeText(test?.encryptedQuestionPaper);
      ToastInfo("Copied!");
    } catch (err) {
      ToastError("Failed to copy");
    }
  };

  const handleOpenPdf = () => {
    if (test?.encryptedQuestionPaper) {
      const base64PdfUrl = test?.encryptedQuestionPaper;
      const newWindow = window.open();
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>PDF Viewer</title>
            <style>
              .content-wrapper {
              width: 100%;
              height: 100vh;
              display: flex;
              }
              embed{
              width: 100%;
              }
            </style>
          </head>
          <body style="margin: 0;">
            <div class="content-wrapper">
             <embed src="${base64PdfUrl}" type="application/pdf"   />
            </div>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const handleSendPassword = async (testId) => {
    await sendMessage(testId);
  };

  useEffect(() => {
    if(data){
      ToastSuccess("password sent");
    }
  }, [data])

  useEffect(() => {
    if (isError) {
      showError(error);
    }
  }, [isError, error]);

  
  return isLoading ? (
    <Loader />
  ) : (
    <div className="flex flex-col gap-11 sm:flex-row justify-between sm:items-center sm:space-x-8 ">
      {/* Test Details Box */}
      <div className="bg-white border border-gray-300 sm:w-4/12 p-6 rounded-xl shadow-lg h-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          {test.name}
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Description:</span>
            <span className="text-gray-600">{test.description}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Date:</span>
            <span className="text-gray-600">{test.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Time:</span>
            <span className="text-gray-600">
              {test.startTime} - {test.endTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Password:</span>
            <span className="text-gray-600">{test.password}</span>
          </div>
        </div>
      </div>

      {/* Actions Box */}
      <div className="bg-gray-100  p-5 w-full sm:w-6/12 rounded-xl shadow-lg h-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Actions</h2>
        <div className="flex flex-col  sm:flex-row  gap-3">
          <button
            onClick={() => handleSendPassword(test.id)}
            className="w-full p-3 bg-blue-500 text-center text-white rounded-lg hover:bg-blue-600 cursor-pointer"
          >
            <span>Send Password</span>
          </button>
          <a
            href={test.originalQuestionPaper}
            target="_blank"
            className="w-full text-center p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer"
          >
            <span>Original File</span>
          </a>
          <button
            onClick={handleOpenPdf}
            className="w-full text-center p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 cursor-pointer"
          >
            <span>Encrypted File</span>
          </button>
          <button
            onClick={copyFileLink}
            className="w-full p-3 bg-purple-500 text-white text-center rounded-lg hover:bg-purple-600 cursor-pointer"
          >
            <span>Copy File Link</span>
          </button>
          <Link
            to={`/dashboard/teacher/view/tests/verify-student/${test?.id}`}
            className="w-full text-center p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
          >
            <span>Verify Student</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

const ViewTest = () => {
  const { id: testId } = useParams();
  const { data, isLoading, isError, error } = useTeacherviewTestQuery(testId);

  const [map, setMap] = useState(new Map());

  useEffect(() => {
    if (data) {
      const newMap = new Map();
      for (const element of data.test.shaKeys) {
        newMap.set(element.rollNumber, [element.key, element.submissionTime]);
      }

      for (const element of data.test.answerPdf) {
        if (newMap.has(element.rollNumber)) {
          const key = newMap.get(element.rollNumber)[0];
          const submissionTime = newMap.get(element.rollNumber)[1];
          newMap.set(element.rollNumber, [
            key,
            submissionTime,
            element.answerSheet,
            element.submissionTime,
          ]);
        } else {
          newMap.set(element.rollNumber, [
            "_",
            "_",
            element.answerSheet,
            element.submissionTime,
          ]);
        }
      }
      setMap(newMap);
    }
  }, [data]);

  const testData = {
    id: data?.test.id,
    startTime: data?.test.startTime,
    endTime: data?.test.endTime,
    date: data?.test.date,
    name: data?.test.name,
    originalQuestionPaper: data?.test?.originalQuestionPaper,
    encryptedQuestionPaper: data?.test?.encryptedQuestionPaper,
    description: data?.test.description,
    password: data?.test.password,
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div className="sm:p-10">
      <TestCard test={testData} />

      <div className="overflow-x-auto mt-10">
        <table className="min-w-full bg-white border border-gray-400 rounded-lg shadow-lg">
          <thead>
            <tr className="text-center bg-gray-100 text-gray-700">
              <th className="px-6 py-3 font-medium text-sm border-b border-gray-400">
                Roll No
              </th>
              <th
                colSpan="2"
                className="px-6 py-3 font-medium text-sm border-b border-l  border-r border-gray-400"
              >
                SHA256 Key
              </th>
              <th
                colSpan="2"
                className="px-6 py-3 font-medium text-sm border-b border-gray-400"
              >
                Answer PDF
              </th>
            </tr>
            <tr className="bg-gray-50 text-gray-500 text-center">
              <th className="border-b border-gray-400"></th>
              <th className="px-6 py-3 font-medium text-sm border-b border-l border-gray-400">
                Key
              </th>
              <th className="px-6 py-3 font-medium text-sm border-b border-gray-400 border-r ">
                Time
              </th>
              <th className="px-6 py-3 font-medium text-sm border-b border-gray-400">
                PDF
              </th>
              <th className="px-6 py-3 font-medium text-sm border-b border-gray-400">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            {Array.from(
              map.entries().map((element) => {
                const [key, values] = element;
                return (
                  <tr key={key} className="text-gray-700  hover:bg-gray-50">
                    <td className="px-5 py-4 text-sm">{key}</td>
                    <td className="px-5 py-4 text-sm border-l border-gray-400">
                      {values[0]}
                    </td>
                    <td className="px-6 py-4 text-sm border-r border-gray-400">
                      {values[1] === "_" ? "_" : formattedDate(values[1])}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <a
                        href={values[2]}
                        target="_blank"
                        className="cursor-pointer text-xl"
                      >
                        <i className="fa-solid fa-file-pdf"></i>
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {formattedDate(values[3])}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewTest;
