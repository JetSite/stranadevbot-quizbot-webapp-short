import { useEffect, useState } from 'react'
import Switch from '../../../../ui/Switch'
import { DevelopmentFilterItem } from './DevelopmentFilterItem'
import useStore from '../../../../../store'

export const DevelopmentFilter = ({ data, open }) => {
  const setActiveFilters = useStore((state) => state.setActiveFilters)
  const setActiveCities = useStore((state) => state.setActiveCities)
  const setActiveDevelopment = useStore((state) => state.setActiveDevelopment)
  const setFiltersCount = useStore((state) => state.setFiltersCount)
  const setPaginationPage = useStore((state) => state.setPaginationPage)
  const { activeFilters } = useStore((state) => state.data)
  const [select, setSelect] = useState(activeFilters)

  useEffect(() => {
    if (!open && data) {
      const selectDevelopment = []
      select.forEach((e) =>
        e.dev.forEach((elem) => {
          selectDevelopment.push(elem)
        })
      )
      const otherSelectedCities = select.filter((e) => !e.dev.length)
      const otherCities = []

      otherSelectedCities.forEach((e) =>
        data?.forEach((elem) => {
          if (e.city.id === elem.city.id) {
            otherCities.push(...elem.dev)
          }
        })
      )

      let variableCount = 0
      const normalizeActiveDev = [...otherCities, ...selectDevelopment]
      normalizeActiveDev.forEach(() => {
        return variableCount++
      })

      setFiltersCount(variableCount)
      setActiveFilters(select)
      setActiveDevelopment(selectDevelopment.length ? normalizeActiveDev : [])
      setActiveCities(select.map((e) => e.city))
      setPaginationPage(1)
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }, [open, data])

  return (
    <div className="flex flex-col gap-2">
      {data?.map((city) => {
        const selectCity = select.find((e) => e.city?.id === city.city?.id)
        const selectDevs = selectCity?.dev

        return (
          !!city.dev.length && (
            <>
              <div
                key={city.city?.id}
                className="border border-slate-300 relative rounded-md p-2.5 "
              >
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold text-textBlack">
                    {city.city?.attributes?.CityName}
                  </h3>
                </div>
                <ul className="flex flex-wrap gap-2 mt-2">
                  {city?.dev.map((dev) => {
                    const selectDev = selectDevs?.find((e) => e?.id === dev?.id)
                    return (
                      <li key={dev?.id}>
                        <DevelopmentFilterItem
                          development={dev}
                          city={city}
                          selectDev={selectDev}
                          selectCity={selectCity}
                          select={select}
                          selectDevs={selectDevs}
                          setSelect={setSelect}
                        />
                      </li>
                    )
                  })}

                  {!select.find((el) => el.city?.id === city.city?.id) && (
                    <div className="absolute bg-white top-0 left-0 w-full h-full opacity-70 rounded-md " />
                  )}
                </ul>
              </div>
            </>
          )
        )
      })}
    </div>
  )
}
