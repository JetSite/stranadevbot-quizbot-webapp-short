export const FilterSkeleton = () => {
  return (
    <div className="sticky top-0 bg-white p-5 border-slate-200 border-b flex gap-1 animate-pulse">
      <div className="whitespace-nowrap transition-all duration-500 active:scale-95 active:brightness-105 flex text-xs justify-between items-center cursor-pointer  w-full rounded-full bg-slate-100">
        <span className="py-2 px-3">ЖК</span>

        <span className="bg-slate-300 px-3 rounded-full pt-2 pb-1.5">
          <span className=" opacity-0">0</span>
        </span>
      </div>
      <div className="whitespace-nowrap transition-all duration-500 active:scale-95 active:brightness-105 flex text-xs justify-between items-center cursor-pointer  w-full rounded-full bg-slate-100">
        <span className="py-2 px-3">Цена</span>
        <span className="bg-slate-300 px-3 rounded-full pt-2 pb-1.5">
          <span className=" opacity-0">0</span>
        </span>
      </div>
      <div className="whitespace-nowrap transition-all duration-500 active:scale-95 active:brightness-105 flex text-xs justify-between items-center cursor-pointer  w-full rounded-full bg-slate-100">
        <span className="py-2 px-3">Комнаты</span>
        <span className="bg-slate-300 px-3 rounded-full pt-2 pb-1.5">
          <span className=" opacity-0">0</span>
        </span>
      </div>
    </div>
  )
}
