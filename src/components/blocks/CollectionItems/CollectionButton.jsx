export const CollectionButton = ({ color, title, ...props }) => {
  return (
    <button
      className={
        {
          red: `block text-center [-webkit-tap-highlight-color:rgba(0,0,0,0)] w-full py-4 px-4 border-none outline-none cursor-pointer rounded-full transition-all duration-500 active:scale-95 active:brightness-105 text-lg bg-textRed text-white`,
          violet:
            'block text-center [-webkit-tap-highlight-color:rgba(0,0,0,0)] w-full py-4 px-4 border-none outline-none cursor-pointer rounded-full transition-all duration-500 active:scale-95 active:brightness-105 text-lg bg-buttonItem text-buttonSubmit',
          gray: 'block text-center [-webkit-tap-highlight-color:rgba(0,0,0,0)] w-full py-4 px-4 border-none outline-none cursor-pointer rounded-full transition-all duration-500 active:scale-95 active:brightness-105 text-lg bg-slate-100 text-defaultButtonText',
          grayDark: 'block text-center [-webkit-tap-highlight-color:rgba(0,0,0,0)] w-full py-4 px-4 border-none outline-none cursor-pointer rounded-full transition-all duration-500 active:scale-95 active:brightness-105 text-lg bg-slate-200 text-slate-700',
        }[color]
      }
      {...props}
    >
      {title}
    </button>
  )
}
