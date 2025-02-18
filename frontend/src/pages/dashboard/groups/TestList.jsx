import { Link } from "react-router";

const TestCard = ({ test }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 ease-in-out flex flex-col h-full border-2 border-[#d1d7e0] hover:border-[#3a6ea5]">
      <div className="p-6 space-y-4 flex-grow">
        {/* Test Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-[#3a6ea5] transition-all">
              {test.name}
            </h3>
            <p className="text-sm mt-2 text-[#5a5a5a] hover:text-[#3b3f5c] transition-all">
              {test.description}
            </p>
          </div>
        </div>

        {/* Group Info */}
        <div className="border-t-2 border-[#e1e8f0] pt-4">
          <p className="text-lg font-semibold text-[#2b2d42]">
            Group: {test.group.name}
          </p>
          <p className="text-sm text-[#5a5a5a]">{test.group.description}</p>
        </div>

        {/* Date & Time at the Bottom */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center text-sm mt-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-[#2b2d42]">Date:</span>
            <span className="text-[#5a5a5a]">{test.date}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-[#2b2d42]">Time:</span>
            <span className="text-[#5a5a5a]">
              {test.startTime} - {test.endTime}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Test List Component
const TestList = ({ tests }) => {
  
  return (
    <div className="container mx-auto sm:p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-zinc-600">
        Available Tests
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {tests?.map((test) => (
          <Link key={test.id} to={test.id} className="w-full">
            <TestCard test={test} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TestList;
