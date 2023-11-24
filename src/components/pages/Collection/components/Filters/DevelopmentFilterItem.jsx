export const DevelopmentFilterItem = ({
  development,
  city,
  selectDev,
  selectCity,
  selectDevs,
  select,
  setSelect,
}) => {
  const handleSelectDev = (dev) => {
    const otherSelectedCities = select.filter(
      (e) => e.city?.id !== city.city?.id
    )
    if (selectDevs?.find((e) => e?.id === dev?.id)) {
      const newArr = selectDevs?.filter((e) => e?.id !== dev?.id)
      setSelect([...otherSelectedCities, { ...selectCity, dev: newArr }])
    } else {
      setSelect([
        ...otherSelectedCities,
        { ...selectCity, dev: [...selectDevs, dev] },
      ])
    }
  }

  return (
    <button
      disabled={city?.dev?.length <= 1}
      onClick={() => handleSelectDev(development)}
      className={`[-webkit-tap-highlight-color:rgba(0,0,0,0)] whitespace-nowrap transition-all duration-500 active:scale-95 active:brightness-105 flex text-xs justify-between items-center cursor-pointer py-2 px-3 rounded-full ${selectDev?.id === development?.id ? ' bg-slate-400' : city?.dev?.length <= 1 ? 'bg-slate-100 text-slate-200' : 'bg-slate-200'
        }`}
    >
      {development.attributes.name}
    </button>
  )
}
