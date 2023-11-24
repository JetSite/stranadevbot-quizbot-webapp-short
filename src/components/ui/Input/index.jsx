const Input = ({ value, onChange, ...props }) => {
  return (
    <input
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white p-2.5 mt-4 mb-5 outline-none border-inputBorder border rounded-sm w-full"
    />
  );
};

export default Input;
