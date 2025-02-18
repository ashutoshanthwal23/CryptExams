const Input = (props) => {
 
  return (
    <input
      {...props}
      required
      className="p-3.5 bg-white rounded-lg outline-0 border border-gray-400 placeholder-gray-500 opacity-100"
    />
  );
};

export default Input;
