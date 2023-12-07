import axios from 'axios'
import { baseApi } from '../variables'

export const getCities = async () => {
  return await axios.get(`${baseApi}/cities`)
}

export const getSubscriptions = async () => {
  return await axios.get(`${baseApi}/subscriptions`)
}

export const getQuestions = async () => {
  return await axios.get(
    `${baseApi}/questions/?populate[QuestionAnswers][populate]=*`
  )
}

export const getUser = async (id) => {
  return await axios.get(
    `${baseApi}/telegram-users/?populate[subscriptions][populate]&populate[cities][populate]&filters[UserTelegamID][$eq]=${id}`
  )
}

export const registerUser = async (data) => {
  return await axios.post(
    `${baseApi}/telegram-users?populate[subscriptions][populate]&populate[cities][populate]`,
    {
      data,
    }
  )
}

export const setLogs = async (data) => {
  return await axios.post(`${baseApi}/user-logs`, {
    data,
  })
}

export const updateUser = async ({ data, id }) => {
  console.log({ data, id });
  return await axios.put(`${baseApi}/telegram-users/${id}`, {
    data,
  })
}

export const getCollections = async ({
  page,
  pageSize,
  cities,
  activeDevelopment,
  tags,
  sortFilterPrice,
  sortFilterRoom,
  activeFilterPrice,
  activeFilterRoom,
  ipotekaTags,
  ipotekaPrice
}) => {
  const citiesNames = cities?.map((item) => item?.attributes?.CityName)
  const tagsIds = tags?.map((item) => item)
  const activeDevelopmentArray = activeDevelopment?.map(
    (item) => item?.attributes?.ProfitbaseId
  )
  let citiesNamesData = ''
  let citiesNamesIpoteka = ''
  let tagsData = ''
  let ipotekaIdsData = ''
  let activeDevelopmentData = ''
  if (citiesNames?.length) {
    for (let i = 0; i < citiesNames?.length; i++) {
      citiesNamesData += `&filters[city][CityName][${i}]=${citiesNames[i]}`
    }
  }
  if (citiesNames?.length) {
    for (let i = 0; i < citiesNames?.length; i++) {
      citiesNamesIpoteka += `&filters[ipoteka][city][${i}]=${citiesNames[i]}`
    }
  }

  if (tagsIds?.length) {
    for (let i = 0; i < tagsIds?.length; i++) {
      tagsData += `&filters[tags][id][$in][${i}]=${tagsIds[i]}`
    }
  }
  if (ipotekaTags?.length) {
    for (let i = 0; i < ipotekaTags?.length; i++) {
      ipotekaIdsData += `&filters[ipoteka][id][${i}]=${ipotekaTags[i]}`
    }
  }
  if (activeDevelopmentArray?.length) {
    for (let i = 0; i < activeDevelopmentArray?.length; i++) {
      activeDevelopmentData += `&filters[development][ProfitbaseId][${i}]=${activeDevelopmentArray[i]}`
    }
  }
  return await axios.get(
    `${baseApi}/apartments?populate=*${cities?.length ? citiesNamesData : ''}${cities?.length ? citiesNamesIpoteka : ''}${activeDevelopmentArray?.length ? activeDevelopmentData : ''}${tagsIds?.length ? tagsData : ''}&pagination[pageSize]=${pageSize}&pagination[page]=${page}${activeFilterRoom ? "&sort[rooms]=" + sortFilterRoom : ""}${activeFilterPrice ? "&sort[price][value]=" + sortFilterPrice : ""}&filters[price][value][$gt]=1&filters[ipoteka][price]=${ipotekaPrice}${ipotekaTags?.length ? ipotekaIdsData : ''}`
  )
}

export const getDevelopments = async ({ cities, tags, ipotekaTags,
  ipotekaPrice }) => {
  const citiesNames = cities?.map((item) => item?.attributes?.CityName)
  const tagsIds = tags?.map((item) => item)
  let citiesNamesData = ''
  let tagsData = ''
  let citiesNamesIpoteka = ''
  let ipotekaIdsData = ''
  if (citiesNames?.length) {
    for (let i = 0; i < citiesNames?.length; i++) {
      citiesNamesIpoteka += `&populate[apartmens][filters][ipoteka][city][${i}]=${citiesNames[i]}`
    }
  }
  if (citiesNames?.length) {
    for (let i = 0; i < citiesNames?.length; i++) {
      citiesNamesData += `&filters[city][CityName][${i}]=${citiesNames[i]}`
    }
  }
  if (ipotekaTags?.length) {
    for (let i = 0; i < ipotekaTags?.length; i++) {
      ipotekaIdsData += `&populate[apartmens][filters][ipoteka][id][${i}]=${ipotekaTags[i]}`
    }
  }
  if (tagsIds?.length) {
    for (let i = 0; i < tagsIds?.length; i++) {
      tagsData += `&filters[apartments][tags][id][$in][${i}]=${tagsIds[i]}`
    }
  }
  return await axios.get(
    `${baseApi}/developments?${cities?.length ? citiesNamesData : ''}${tagsIds?.length ? tagsData : ''
    }&pagination[pageSize]=10000&pagination[page]=1&sort[0]=createdAt%3Adesc&filters[apartments][price][value][$gt]=1&populate[city]=*&populate[apartmens][filters][ipoteka][price]=${ipotekaPrice}${cities?.length ? citiesNamesIpoteka : ''}${ipotekaTags?.length ? ipotekaIdsData : ''}`
  )
}

export const pushPhoneNumber = async (data) => {
  return await axios.post(`${baseApi}/submissions`, { data })
}

export const postShareFile = async ({ id }) => {
  const data = {
    "polzovatel_telegram": id,
  }
  return await axios.post(`${baseApi}/shejring-fajlovs`, { data })
}

export const postSendFile = async ({ id }) => {
  const data = {
    "polzovatel_telegram": id,
    sended: true
  }
  return await axios.post(`${baseApi}/shejring-fajlovs`, { data })
}

export const fileUpload = async (data) => {
  return await axios.post(`${baseApi}/upload`, data)
}
