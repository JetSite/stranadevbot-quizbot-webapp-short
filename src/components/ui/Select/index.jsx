const Select = ({ value, onChange, ...props }) => {
  return (
    <select
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white p-2.5 mt-4 mb-5 text-black outline-none border-black border rounded-lg"
    >
      <option className="text-black" value={"Москва"}>
        Москва
      </option>
      <option className="text-black" value={"Тюмень"}>
        Тюмень
      </option>
      <option className="text-black" value={"Санкт-Петербург"}>
        Санкт-Петербург
      </option>
      <option className="text-black" value={"Екатеринбург"}>
        Екатеринбург
      </option>
    </select>
  );
};

export default Select;
