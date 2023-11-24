const CancelButton = ({ ...props }) => {
  return (
    <button
      {...props}
      className={
        "button " +
        `${props.className
        } w-full [-webkit-tap-highlight-color:rgba(0,0,0,0)] py-4 px-4 outline-none cursor-pointer rounded-full transition-all duration-500 active:scale-95 active:brightness-105 text-lg text-cancelRed border-cancelRed border-2`
      }
    />
  );
};

export default CancelButton;
