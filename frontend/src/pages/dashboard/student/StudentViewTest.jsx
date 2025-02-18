import { useParams } from "react-router";
import { useStudentViewTestQuery } from "../../../store/api/testsAPI";
import { useEffect } from "react";
import { ToastError } from "../../../components/toastify/Toast";
import Loader from "../../../components/spinningLoader/Loader";

const StudentViewTest = () => {
  const { id } = useParams();
  const { data, error, isError, isLoading } = useStudentViewTestQuery(id);


  useEffect(() => {
    if (isError) {
      console.log(error);
      ToastError("failed to fetch");
    }
  }, [isError, error]);

  const handleDownload = () => {
    if (data?.test.questionPaper) {
      const base64PdfUrl = `data:application/pdf;base64,${data.test.questionPaper}`;
      const link = document.createElement("a");
      link.href = base64PdfUrl;
      link.download = "download.pdf";
      link.click();
    }
  };

  const handleOpenPdf = () => {
    if (data?.test.questionPaper) {
      const base64PdfUrl = `data:application/pdf;base64,${data.test.questionPaper}`;
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

  return isLoading ? (
    <Loader />
  ) : (
    <div className="flex flex-col gap-11 sm:flex-row justify-center sm:items-center sm:space-x-8 ">
      {/* Test Details Box */}
      <div className="bg-white border border-gray-300 sm:w-5/12 px-16 py-10 rounded-xl shadow-lg h-auto">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
          {data?.test.name}
        </h2>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row space-x-2">
            <span className="font-semibold text-gray-700">Description:</span>
            <span className="text-gray-600">{data?.test.description}</span>
          </div>
          <div className="flex flex-col sm:flex-row space-x-2">
            <span className="font-semibold text-gray-700">Group Name:</span>
            <span className="text-gray-600">{data?.test.group.name}</span>
          </div>
          <div className="flex flex-col sm:flex-row space-x-2 ">
            <span className="font-semibold text-gray-700">Date:</span>
            <span className="text-gray-600">{data?.test.date}</span>
          </div>
          <div className="flex flex-col sm:flex-row space-x-2">
            <span className="font-semibold text-gray-700">Time:</span>
            <span className="text-gray-600">
              {data?.test.startTime} - {data?.test.endTime}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 border-t-2 py-3 space-x-2 text-lg">
            <span className="font-semibold text-gray-700 ">
              Question Paper:
            </span>

            <div className="space-x-5">
              <button
                className="text-blue-600 cursor-pointer"
                onClick={handleOpenPdf}
              >
                <i className="fa-solid fa-eye"></i>
              </button>

              <button
                className="text-blue-600 cursor-pointer"
                onClick={handleDownload}
              >
                <i className="fa-solid fa-download"></i>
              </button>
            </div>
          </div>

          <div className=" py-3">
            {data?.test.answerSubmit ? (
              <div className="text-green-600 text-center font-semibold">
                You have submitted your paper.
              </div>
            ) : (
              <div className="text-red-600 text-center font-semibold">
                You have not submitted your paper yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentViewTest;
