import "./Loader.css";

const Loader = () => {
  return (
    <div
      className="w-full h-screen flex justify-center items-center bg-gray-800 
        opacity-95 fixed top-0 left-0 z-[100]"
    >
      <div className="spinningLoader w-20 h-20 rounded-full border-4 border-blue-600 border-t-white"></div>
    </div>
  );
};

export default Loader;
