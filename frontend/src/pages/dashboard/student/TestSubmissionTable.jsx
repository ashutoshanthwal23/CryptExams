import { formattedDate } from "../../utils/dateTime";

const TestSubmissionTable = ({ data }) => {
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Roll No
            </th>
            <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Answer PDF
            </th>
            <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-700">
              SHA Key Verification
            </th>
            <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-700">
              SHA Key Submission Date
            </th>
            <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-700">
              SHA Key Submission Time
            </th>
            <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-700">
              SHA Key Received On Time
            </th>
            <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Paper Key Delivery Status
            </th>
            <th className="border-b px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Paper Key Delivery Message Time
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50  text-center">
              <td className="border-b px-4 py-2 text-sm text-gray-600">
                {row.rollNumber}
              </td>
              <td className="border-b px-4 py-2 text-sm text-gray-600">
                {row.answerPdfLink !== "_" ? (
                  <a
                    href={row.answerPdfLink}
                    target="_blank"
                    className="cursor-pointer text-xl"
                  >
                    <i className="fa-solid fa-file-pdf"></i>
                  </a>
                ) : (
                  "_"
                )}
              </td>
              <td className="border-b px-4 py-2 text-sm text-gray-600">
                {row.sha256 !== "_"
                  ? row.sha256
                    ? "True"
                    : "False"
                  : row.sha256}
              </td>
              <td className="border-b px-4 py-2 text-sm text-gray-600">
                {row.keySubmissionDate}
              </td>
              <td className="border-b px-4 py-2 text-sm text-gray-600">
                {row.keySubmissionTime}
              </td>
              <td className="border-b px-4 py-2 text-sm text-gray-600">
                {row.isSubmittedOnTime !== "_"
                  ? row.isSubmittedOnTime
                    ? "True"
                    : "False"
                  : row.isSubmittedOnTime}
              </td>
              <td className="border-b px-4 py-2 text-sm text-gray-600">
                {row.status}
              </td>
              <td className="border-b px-4 py-2 text-sm text-gray-600">
                {row.messageTime !== "_"
                  ? formattedDate(row.messageTime)
                  : row.messageTime}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestSubmissionTable;
