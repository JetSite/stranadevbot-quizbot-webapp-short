const Button = ({ variant, ...props }) => {
  return (
    <button
      {...props}
      className={
        "button " +
        `${props.className
        } w-full py-4 px-4 border-full [-webkit-tap-highlight-color:rgba(0,0,0,0)] highlight active:border-none cursor-pointer rounded-full transition-all duration-500 active:scale-95 active:brightness-105 text-lg ${variant === "red"
          ? "bg-red-500 text-white"
          : variant === "active"
            ? "bg-gradient-to-r rounded-full from-[#92278f] via-[#c6168d] to-[#ed1c24] text-white"
            : variant === "submit" ? "bg-buttonSubmit text-white" : "bg-defaultButton text-defaultButtonText"
        }`
      }
    />
  );
};

export default Button;
