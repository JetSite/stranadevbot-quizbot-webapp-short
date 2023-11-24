import { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useTelegramInitData from '../../../hooks/useTelegramInitData'
import { useLogsQuery } from '../../../queries/mutations'
import useStore from '../../../store'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import {
  getCollections,
  postShareFile,
  fileUpload,
  postSendFile,
} from '../../../api'
import { ImgSlider } from '../../blocks/CollectionItems/ImgSlider'
import { CollectionItemActions } from '../../blocks/CollectionItems/CollectionItemActions'
import { Map, Placemark } from '@pbe/react-yandex-maps'
import dayjs from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Switch from '../../ui/Switch'
import { baseApUrl } from '../../../variables'
dayjs.extend(quarterOfYear)
const CollectionItem = () => {
  const { tg } = useTelegramInitData()
  const clearQuestions = useStore((state) => state.clearQuestions)
  const clearFilters = useStore((state) => state.clearFilters)
  const logsMutation = useLogsQuery()
  const [item, setItem] = useState()
  const [pdf, setPdf] = useState('none')
  const [switchToggle, setSwitchToggle] = useState()
  const activeDevelopment = useStore((state) => state.data.activeDevelopment)
  const ipotekaTags = useStore((state) => state.data.ipotekaTags)
  const ipotekaPrice = useStore((state) => state.data.ipotekaPrice)
  const tags = useStore((state) => state.data.tags)
  const questions = useStore((state) => state.data.questions)
  const activeCities = useStore((state) => state.data.activeCities)
  const [currentIndexElement, setCurrentIndexElement] = useState(0)
  const [pngLoading, setPngLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const paginationPage = useStore((state) => state.data.paginationPage)
  const setPaginationPage = useStore((state) => state.setPaginationPage)
  const id = useStore((state) => state.data.id)
  const { sortFilterPrice, sortFilterRoom, activeFilterPrice, activeFilterRoom } = useStore(
    (state) => state.data
  )

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const ref = useRef()
  const { state } = useLocation()
  const { idItem } = state
  const cities = useStore((state) => state.data.user.cities)
  const startDateValueOf =
    (item?.attributes?.development?.data?.attributes?.startDate &&
      dayjs(item?.attributes?.development?.data?.attributes?.startDate)
        .endOf('date')
        .valueOf()) ||
    ""
  const currentDateValueOf = dayjs().endOf('date').valueOf()
  const endDateValueOf =
    (item?.attributes?.house?.builtYear &&
      item?.attributes?.house?.readyQuarter &&
      dayjs(item?.attributes?.house?.builtYear)
        .quarter(item?.attributes?.house?.readyQuarter)
        .endOf('month')
        .valueOf()) ||
    ''
  const procent = item?.id
    ? Math.round(
      (currentDateValueOf - startDateValueOf) /
      ((endDateValueOf - startDateValueOf) / 100)
    ) > 99
      ? 100
      : Math.round(
        (currentDateValueOf - startDateValueOf) /
        ((endDateValueOf - startDateValueOf) / 100)
      )
    : null

  const { mutate: mutateUploadFile } = useMutation(
    ({ file, idFile }) => {
      const data = new FormData()
      data.append('files', file.file)
      data.append('ref', 'api::shejring-fajlov.shejring-fajlov')
      data.append('refId', idFile)
      data.append('field', 'file')
      return fileUpload(data)
    },
    {
      onSuccess: (data) => {
        setPdf(baseApUrl + data?.data[0]?.url)
        setPngLoading(false)
      },
      onError: () => {
        setPngLoading(false)
      },
    }
  )

  const { mutate: mutateUploadFileSend } = useMutation(
    ({ file, idFile }) => {
      const data = new FormData()
      data.append('files', file.file)
      data.append('ref', 'api::shejring-fajlov.shejring-fajlov')
      data.append('refId', idFile)
      data.append('field', 'file')
      return fileUpload(data)
    },
    {
      onSuccess: () => {
        alert('Успешно сохранено, pdf появится в чате')
        setPngLoading(false)
      },
      onError: () => {
        setPngLoading(false)
      },
    }
  )

  const { mutate: mutatePostShare } = useMutation(
    () => {
      return postShareFile({ id: id })
    },
    {
      onSuccess: (data, file) => {
        mutateUploadFile({ idFile: data.data.data.id, file })
      },
    }
  )

  const { mutate: mutateSendFile } = useMutation(
    () => {
      return postSendFile({ id: id })
    },
    {
      onSuccess: (data, file) => {
        mutateUploadFileSend({ idFile: data.data.data.id, file })
      },
    }
  )

  const backHandle = () => {
    logsMutation.mutateAsync({
      telegram_user: id,
      Action: `Нажал кнопку назад и перешел на страницу квартир`,
    })
    navigate(-1)
  }

  useEffect(() => {
    tg.onEvent('backButtonClicked', backHandle)
    return () => {
      tg.offEvent('backButtonClicked', backHandle)
    }
    // eslint-disable-next-line
  }, [backHandle])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    tg.BackButton.show()
  }, [])

  const fetchCollection = ({
    paginationPage = 1,
    activeCities,
    activeDevelopment,
    sortFilterPrice,
    sortFilterRoom,
    activeFilterPrice,
    activeFilterRoom,
    tags,
    ipotekaTags,
    ipotekaPrice
  }) => {
    logsMutation.mutate({
      telegram_user: id,
      Action: `Запросил страницу номер ${paginationPage}`,
    })
    return getCollections({
      page: paginationPage,
      pageSize: 20,
      cities: activeCities,
      activeDevelopment,
      tags: tags,
      sortFilterPrice,
      sortFilterRoom,
      activeFilterPrice,
      activeFilterRoom,
      ipotekaTags,
      ipotekaPrice
    })
  }

  useQuery({
    queryKey: ['Collection', activeCities,
      activeDevelopment,
      tags,
      sortFilterPrice,
      sortFilterRoom,
      activeFilterPrice,
      activeFilterRoom,
      ipotekaTags,
      ipotekaPrice,
      paginationPage
    ],
    queryFn: () => fetchCollection({
      activeCities,
      activeDevelopment,
      tags,
      sortFilterPrice,
      sortFilterRoom,
      activeFilterPrice,
      activeFilterRoom,
      ipotekaTags,
      ipotekaPrice,
      paginationPage
    }),
    keepPreviousData: true,
  })

  const data = queryClient.getQueryData([
    'Collection',
    activeCities,
    activeDevelopment,
    tags,
    sortFilterPrice,
    sortFilterRoom,
    activeFilterPrice,
    activeFilterRoom,
    ipotekaTags,
    ipotekaPrice,
    paginationPage
  ])

  useEffect(() => {
    data?.data?.data?.map((item, i) => {
      if (item.id === idItem) {
        setItem(item)
        setCurrentIndexElement(i)
      }
    })
  }, [])

  useEffect(() => {
    if (item?.id) {
      data?.data?.data?.map((item, i) => {
        if (i === currentIndexElement) {
          setItem(item)
          item?.id &&
            logsMutation.mutateAsync({
              telegram_user: id,
              Action: `Нажал кнопку следующая квартира и перешел на квартиру id:${item.id}`,
            })
        }
      })
    }
  }, [data?.data?.meta?.pagination?.page])

  const onRepeat = () => {
    {
      if (!open)
        logsMutation.mutate({
          telegram_user: id,
          Action: 'Нажал кнопку Повторить подборку и перешел на страницу вопросов',
        })
      tg.BackButton.hide()
      clearQuestions()
      clearFilters();
      setPaginationPage(1)
      navigate('/')
    }
  }

  useEffect(() => {
    if (open) {
      tg.offEvent('mainButtonClicked', onRepeat)
    } else {
      tg.onEvent('mainButtonClicked', onRepeat)
    }
    return () => {
      tg.offEvent('mainButtonClicked', onRepeat)
    }
    // eslint-disable-next-line
  }, [onRepeat, open])

  useEffect(() => {
    return () => {
      tg.MainButton.hide()
    }
  }, [])

  const handleScroll = () => {
    if (
      window.scrollY > 20 &&
      window.scrollY -
      (document.documentElement.scrollHeight -
        document.documentElement.offsetHeight) >
      -20
    ) {
      tg.MainButton.show()
      tg.MainButton.setParams({
        text: 'Повторить подборку',
        color: 'rgb(146, 39, 143)',
      })
    }
    if (
      window.scrollY > 20 &&
      window.scrollY -
      (document.documentElement.scrollHeight -
        document.documentElement.offsetHeight) <
      -140
    ) {
      tg.MainButton.hide()
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const checkNext = () => {
    if (currentIndexElement === data?.data?.data?.length - 1 && paginationPage === data?.data?.meta?.pagination?.pageCount) {
      return false
    }
    if (currentIndexElement === data?.data?.data?.length - 1 && paginationPage !== data?.data?.meta?.pagination?.pageCount) {
      return true
    }
    if (currentIndexElement !== data?.data?.data?.length - 1) {
      return !!data?.data?.data[currentIndexElement + 1]
    }
  }

  const nextItem = () => {
    let newItem = {}
    if (currentIndexElement !== data?.data?.data?.length - 1) {
      newItem = data?.data?.data[currentIndexElement + 1]
      setCurrentIndexElement(currentIndexElement + 1)
    }
    newItem?.id && setItem(newItem)
    newItem?.id &&
      logsMutation.mutateAsync({
        telegram_user: id,
        Action: `Нажал кнопку следующая квартира и перешел на квартиру id:${newItem.id}`,
      })
    if (
      currentIndexElement === data?.data?.data?.length - 1
    ) {
      setPaginationPage(paginationPage + 1)
      setCurrentIndexElement(0)
    }
  }

  const prevItem = () => {
    let newItem = {}
    if (currentIndexElement !== 0) {
      newItem = data?.data?.data[currentIndexElement - 1]
      setCurrentIndexElement(currentIndexElement - 1)
    }
    newItem?.id && setItem(newItem)
    newItem?.id &&
      logsMutation.mutateAsync({
        telegram_user: id,
        Action: `Нажал кнопку предидущая квартира и перешел на квартиру id:${newItem?.id}`,
      })
    if (currentIndexElement === 0) {
      setPaginationPage(paginationPage - 1)
      setCurrentIndexElement(data?.data?.data?.length - 1)
    }
  }
  const textIpoteka = () => {
    if (
      questions.find((item) => item?.id === 3)?.answer[0].QuestionAnswer !==
      'Нет'
    ) {
      return 'Вам доступна семейная ипотека'
    }
    if (
      questions.find((item) => item?.id === 4)?.answer[0]?.QuestionAnswer ===
      "Работаю в военной сфере"
    ) {
      return 'Вам доступна военная ипотека'
    }
    if (
      questions.find((item) => item?.id === 4)?.answer[0]?.QuestionAnswer ===
      'Работаю в IT'
    ) {
      return 'Вам доступна льготная ипотека для IT - специалистов'
    }
    return ''
  }

  function saveAs({ canvas, share }) {
    const componentWidth = ref.current.offsetWidth
    const componentHeight = ref.current.offsetHeight

    const orientation = componentWidth >= componentHeight ? 'l' : 'p'

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF(orientation, 'px', 'a4', true)
    pdf.internal.pageSize.width = componentWidth
    pdf.internal.pageSize.height = componentHeight

    pdf.addImage(
      imgData,
      'PNG',
      0,
      0,
      componentWidth,
      componentHeight,
      undefined,
    )
    if (share) {
      mutatePostShare({ file: pdf.output('blob') })
    } else {
      mutateSendFile({ file: pdf.output('blob') })
    }
  }

  const onButtonDownloadClick = () => {
    logsMutation.mutate({
      telegram_user: id,
      Action: `Нажал на кнопку сохранить предложение`,
    })
    setPngLoading(true)
    if (ref.current === null) {
      setPngLoading(false)
      return
    }
    html2canvas(ref.current, { useCORS: true, scale: 2 }).then((canvas) =>
      saveAs({ canvas, share: false })
    );
  }

  const onButtonShareClick = () => {
    logsMutation.mutate({
      telegram_user: id,
      Action: `Нажал на кнопку поделиться`,
    })
    if (pdf === 'none') {
      setPngLoading(true)
      if (ref.current === null) {
        setPngLoading(false)
        return
      }
      html2canvas(ref.current, { useCORS: true, scale: 2 }).then((canvas) =>
        saveAs({ canvas, share: true })
      );
    }
  }

  const price = +item?.attributes?.price?.value
  const priceWithoutOverhaul =
    +item?.attributes?.city?.data?.attributes?.overhaulPrice *
    +item?.attributes?.area?.value
  const priceWithOverhaul =
    +item?.attributes?.price?.value +
    +item?.attributes?.city?.data?.attributes?.overhaulPrice *
    +item?.attributes?.area?.value

  return (
    <div ref={ref} className="flex-col w-full overflow-x-hidden bg-white">
      <div className="px-7 pt-7">
        <div className="flex justify-between max-w-lg m-auto">
          <div
            onClick={() =>
              paginationPage === 1 && currentIndexElement === 0
                ? () => { }
                : prevItem()
            }
            className={`cursor-pointer flex [-webkit-tap-highlight-color:rgba(0,0,0,0)] transition-all duration-500 active:scale-95 active:brightness-105 active:border-none justify-center items-center h-[45px] w-[45px] rounded-full bg-defaultButton ${paginationPage === 1 && currentIndexElement === 0
              ? "opacity-0 cursor-auto"
              : !data?.data?.data?.length
                ? "opacity-50"
                : ""
              }`}
          >
            <div className="w-1/3 h-2/4 bg-contain bg-[url('./assets/images/prev.svg')] bg-no-repeat" />
          </div>
          <div className="w-3/5">
            {item?.attributes?.area?.value ? (
              <p className="text-center text-xl">
                {item?.attributes?.property_type}{" "}
                {item?.attributes?.area?.value}
                м²
              </p>
            ) : (
              item?.attributes?.property_type
            )}
            <p className="text-center text-xs text-defaultButtonText">
              {item?.attributes?.city?.data?.attributes?.CityName} /{" "}
              {item?.attributes?.development?.data?.attributes?.name}
            </p>
          </div>
          <div
            onClick={() =>
              !checkNext() && data?.data?.data?.length
                ? () => { }
                : data && nextItem()
            }
            className={`flex cursor-pointer [-webkit-tap-highlight-color:rgba(0,0,0,0)] transition-all duration-500 active:scale-95 active:brightness-105 active:border-none justify-center items-center h-[45px] w-[45px] rounded-full bg-defaultButton ${!checkNext() && data?.data?.data?.length
              ? "opacity-0 cursor-auto"
              : !data?.data?.data?.length
                ? "opacity-50"
                : ""
              }`}
          >
            <div className="w-1/3 h-2/4 bg-contain bg-[url('./assets/images/next.svg')] bg-no-repeat" />
          </div>
        </div>
      </div>
      {item?.attributes?.image?.length ? <ImgSlider item={item} /> : null}
      <div className="px-7 pt-7 text-2xl">
        <p>
          от{" "}
          <span className="text-buttonSubmit">
            {parseInt(item?.attributes?.paymentAmountByCredit)?.toLocaleString(
              "ru"
            ) || ipotekaPrice?.toLocaleString("ru")}{" "}
            руб.
          </span>{" "}
          в месяц
        </p>
      </div>
      <div className="px-7 pb-7">
        <div
          className={`${switchToggle ? "text-[#c6168d]" : "text-itemDevelopment"
            } mt-2 p-1 bg-zinc-100 flex justify-center items-center text-xs w-fit rounded leading-none`}
        >
          Стоимость квартиры{" "}
          {switchToggle
            ? priceWithOverhaul.toLocaleString("ru")
            : price.toLocaleString("ru") || 0}{" "}
          ₽
        </div>
        {textIpoteka() ? (
          <div className="mb-7 mt-3 rounded-lg bg-gradient-to-r p-[2px] from-[#92278f] via-[#c6168d] to-[#ed1c24]">
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm leading-none">{textIpoteka()}</p>
            </div>
          </div>
        ) : null}
        <div className="mt-7 mb-2 flex justify-between items-start">
          <div className="w-2/4 mr-1 text-left">
            <p className="text-defaultButtonText text-xs">Количество комнат</p>
            <p className="text-xs">{item?.attributes?.rooms || 1}</p>
          </div>
          <div className="w-2/4 text-right">
            <p className="text-defaultButtonText text-xs">Этаж</p>
            <p className="text-xs">
              {(item?.attributes?.floor &&
                item?.attributes?.floor +
                " из " +
                item?.attributes?.house?.floorsTotal) ||
                ""}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-start">
          <div className="w-2/4 mr-1 text-left">
            <p className="text-defaultButtonText text-xs">Ввод по договору</p>
            <p className="text-xs">
              {(item?.attributes?.house?.builtYear &&
                item?.attributes?.house?.readyQuarter &&
                dayjs(item?.attributes?.house?.builtYear)
                  .quarter(item?.attributes?.house?.readyQuarter)
                  .endOf("month")
                  .format("DD.MM.YYYY")) ||
                ""}
            </p>
          </div>
          {procent && item?.attributes?.development?.data?.attributes?.startDate ? (
            <div className="w-2/4 mr-1 text-right flex flex-col items-end mt-1">
              <div className="w-[100px] h-1.5 bg-slate-200 rounded-full relative mb-1.5">
                <div
                  style={{ width: procent + "px" }}
                  className={`h-1.5 rounded-full absolute left-0 bg-gradient-to-r p-[2px] from-[#92278f] via-[#c6168d] to-[#ed1c24]`}
                />
              </div>
              <p className="text-xs">Готовность {procent}%</p>
            </div>
          ) : null}
        </div>
        {/* <p className='mt-2 text-defaultButtonText text-xs'>{item?.attributes?.description}</p> */}
        <div className="mt-5 mb-7 flex flex-wrap gap-1">
          {item?.attributes?.customField?.map((el) =>
            el?.value === "да" ? (
              <div
                key={el.name}
                className="pb-1.5 pt-2 px-3 border-buttonSubmit border rounded"
              >
                <p className=" text-buttonSubmit font-medium uppercase text-xs">
                  {el.name}
                </p>
              </div>
            ) : null
          )}
        </div>
        {priceWithoutOverhaul ? (
          <div className="py-5 px-3 rounded-lg bg-slate-100 flex items-center justify-between">
            <Switch
              className="checked:disabled:after:bg-slate-300 mb-[-1px]"
              label="Ремонт"
              disabled={!item?.attributes?.area?.value}
              checked={switchToggle}
              onChange={() => setSwitchToggle(!switchToggle)}
            />
            <p
              className={`${switchToggle ? "text-black" : "text-slate-200"
                } mt-0.5`}
            >
              +{priceWithoutOverhaul.toLocaleString("ru")}
            </p>
          </div>
        ) : null}
        {item?.attributes?.development?.data?.attributes?.latitude &&
          item?.attributes?.development?.data?.attributes?.longitude ? (
          <div className="rounded-2xl overflow-hidden mt-2">
            <Map
              width="100%"
              defaultState={{
                center: [
                  item?.attributes?.development?.data?.attributes?.latitude,
                  item?.attributes?.development?.data?.attributes?.longitude,
                ],
                zoom: 13,
              }}
            >
              <Placemark
                defaultGeometry={[
                  item?.attributes?.development?.data?.attributes?.latitude,
                  item?.attributes?.development?.data?.attributes?.longitude,
                ]}
              />
            </Map>
          </div>
        ) : null}
        {item?.id ? (
          <CollectionItemActions
            id={id}
            item={item}
            pngLoading={pngLoading}
            onButtonDownloadClick={onButtonDownloadClick}
            onButtonShareClick={onButtonShareClick}
            cities={cities}
            pdf={pdf}
            setPdf={setPdf}
            setOpen={setOpen}
            open={open}
          />
        ) : null}
      </div>
    </div>
  );
}

export default CollectionItem
