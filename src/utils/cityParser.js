const cityParser = (cities) => {
  let result = ""
  const arrayCities = cities?.map(item => {
    if (item?.attributes?.CityName === 'Москва') {
      return "Москве"
    }
    if (item?.attributes?.CityName === 'Новороссийск') {
      return "Новороссийске"
    }
    if (item?.attributes?.CityName === 'Екатеринбург') {
      return "Екатеринбурге"
    }
    if (item?.attributes?.CityName === 'Тюмень') {
      return "Тюмени"
    }
  })

  arrayCities?.forEach((item, i) => {
    if (arrayCities?.length > 2) {
      result += i === arrayCities?.length - 1 ? " и " + item : i !== 0 ? " в " + item : item
    } else {
      result += i === 0 ? item : " и " + item
    }
  })

  return result
}

export default cityParser