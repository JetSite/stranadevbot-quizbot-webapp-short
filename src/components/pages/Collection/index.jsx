import useTelegramInitData from '../../../hooks/useTelegramInitData'
import { useLogsQuery } from '../../../queries/mutations'
import useStore from '../../../store'
import { useNavigate } from 'react-router-dom'
import { ColorRing } from 'react-loader-spinner'
import Item from './components/Item'
import Filters from './components/Filters/'
import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import {
  fileUpload,
  getCollections,
  getCities,
  getDevelopments,
  postSendFile,
  postShareFile,
  getQuestions,
} from '../../../api'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { baseApUrl } from '../../../variables'
import { FilterSkeleton } from '../../ui/Skeletons/FilterSkeleton'
import cityParser from '../../../utils/cityParser'

const Collection = () => {
  const { tg } = useTelegramInitData()
  const logsMutation = useLogsQuery()
  const id = useStore((state) => state.data.id)
  const activeDevelopment = useStore((state) => state.data.activeDevelopment)
  const ipotekaPrice = useStore((state) => state.data.ipotekaPrice)
  const paginationPage = useStore((state) => state.data.paginationPage)
  const ipotekaTags = useStore((state) => state.data.ipotekaTags)
  const activeCities = useStore((state) => state.data.activeCities)
  const cities = useStore((state) => state.data.user.cities)
  const setPaginationPage = useStore((state) => state.setPaginationPage)
  const { sortFilterPrice, sortFilterRoom, activeFilterPrice, activeFilterRoom } = useStore(
    (state) => state.data
  )
  //TODO: activate from get cities in dev

  // const setAllCities = useStore((state) => state.setAllCities)
  // const { isLoading: loading, data: cityData } = useQuery(['cities'], () =>
  //   getCities()
  // )
  const { data: dataQuestions } = useQuery(["questions"], () => getQuestions());
  const setFiltersData = useStore((state) => state.setFiltersData)
  const clearQuestions = useStore((state) => state.clearQuestions)
  const clearFilters = useStore((state) => state.clearFilters)
  const tags = useStore((state) => state.data.tags)
  const navigate = useNavigate()
  const [pngLoading, setPngLoading] = useState(false)
  const [pngShare, setPngShare] = useState(false)
  const [buttonShareHover, setButtonShareHover] = useState(false)
  const [buttonDownloadHover, setButtonDownloadHover] = useState(false)
  const ref = useRef()
  const shareButtonRef = useRef()
  const refRepeat = useRef()
  const [pdf, setPdf] = useState('none')
  const fetchCollection = ({
    paginationPage = 1,
    activeCities,
    activeDevelopment,
    sortFilterPrice,
    sortFilterRoom,
    activeFilterPrice,
    activeFilterRoom
  }) => {
    logsMutation.mutate({
      telegram_user: id,
      Action: `Запросил страницу номер ${paginationPage}`,
    })
    return getCollections({
      page: paginationPage,
      pageSize: 20,
      cities: activeCities,
      activeDevelopment: activeDevelopment,
      tags: tags,
      sortFilterPrice,
      sortFilterRoom,
      activeFilterPrice,
      activeFilterRoom,
      ipotekaTags,
      ipotekaPrice
    })
  }

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
        setButtonDownloadHover(false)
        setButtonShareHover(false)
        setPngShare(false)
      },
      onError: () => {
        setPngLoading(false)
        setPngShare(false)
        setButtonDownloadHover(false)
        setButtonShareHover(false)
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
        setPngShare(false)
        setButtonDownloadHover(false)
        setButtonShareHover(false)
      },
      onError: () => {
        setPngLoading(false)
        setPngShare(false)
        setButtonDownloadHover(false)
        setButtonShareHover(false)
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

  //TODO: activate from get cities in dev

  // useEffect(() => {
  //   setAllCities(cityData?.data?.data)
  // }, [loading])

  const {
    isLoading,
    data: dataInfinity,
    isFetching,
  } = useQuery({
    queryKey: ['Collection', activeCities,
      activeDevelopment,
      tags,
      sortFilterPrice,
      sortFilterRoom,
      activeFilterPrice,
      activeFilterRoom,
      ipotekaTags,
      ipotekaPrice, paginationPage],
    queryFn: () => fetchCollection({
      activeCities,
      activeDevelopment,
      tags,
      sortFilterPrice,
      sortFilterRoom,
      activeFilterPrice,
      activeFilterRoom,
      ipotekaTags,
      ipotekaPrice, paginationPage
    }),
    keepPreviousData: true
  })

  const { isLoading: isLoadingDevelopments, data: dataDevelopments } = useQuery(
    ['developments', cities, tags, ipotekaTags,
      ipotekaPrice],
    () => getDevelopments({
      cities, tags: tags, ipotekaTags,
      ipotekaPrice
    })
  )

  useEffect(() => {
    tg.BackButton.hide()
  }, [])

  const handleRepeat = () => {
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

  const handleSubscriptions = () => {
    logsMutation.mutateAsync({
      telegram_user: id,
      Action: 'Нажал кнопку Мои подписки и перешел на страницу подписок',
    })
    tg.BackButton.hide()
    setPaginationPage(1)
    tg.openTelegramLink("https://t.me/strana_themes_bot")
    // navigate('/subscriptions')
  }
  const handleFinish = () => {
    logsMutation.mutateAsync({
      telegram_user: id,
      Action: 'Нажал кнопку Закончить выбор и вышел из  приложения',
    })
    setPaginationPage(1)
    tg.BackButton.hide()
    tg.close()
  }

  useEffect(() => {
    if (dataDevelopments?.data?.data) {
      setFiltersData(dataDevelopments?.data?.data)
    }
  }, [isLoadingDevelopments, dataDevelopments?.data?.data])

  function saveAs({ canvas, share }) {
    let pdf = new jsPDF("p", "px", "a4", true);
    const componentWidth = ref.current.offsetWidth
    const componentHeight = ref.current.offsetHeight
    const imgData = canvas.toDataURL('image/png')
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
      Action: `Нажал на кнопку сохранить`,
    })
    setPngLoading(true)
    if (ref.current === null) {
      setPngLoading(false)
      setButtonDownloadHover(false)
      setButtonShareHover(false)
      return
    }
    const componentWidth = ref.current.offsetWidth
    const componentHeight = ref.current.offsetHeight
    html2canvas(ref.current, { useCORS: true, scale: 2, width: componentWidth, height: componentHeight }).then((canvas) =>
      saveAs({ canvas, share: false })
    )
  }

  const onButtonShareClick = () => {
    logsMutation.mutate({
      telegram_user: id,
      Action: `Нажал на кнопку поделиться`,
    })
    if (pdf === 'none') {
      setPngShare(true)
      if (ref.current === null) {
        setPngShare(false)
        return
      }
      const componentWidth = ref.current.offsetWidth
      const componentHeight = ref.current.offsetHeight
      html2canvas(ref.current, { useCORS: true, scale: 2, width: componentWidth, height: componentHeight }).then((canvas) =>
        saveAs({ canvas, share: true })
      );
    }
  }

  useEffect(() => {
    if (pdf !== 'none') {
      shareButtonRef.current.onclick = () =>
        tg.openLink(`https://t.me/share/url?url=${pdf}`, {
          try_instant_view: true,
        })
      shareButtonRef.current?.onclick()
      setPdf('none')
    }
  }, [pdf, shareButtonRef])

  const handleNext = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    setPaginationPage(paginationPage + 1)
  }
  const handlePrev = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    setPaginationPage(paginationPage - 1)
  }

  return (
    <div className="flex-col w-full" ref={ref}>
      <div className="p-7 pb-2">
        <p className="text-center mb-2">
          Мы подобрали для вас
          <br /> несколько вариантов в {cityParser(cities)}
        </p>
        <div className="mb-7 flex justify-center">
          <img crossOrigin="anonymous" className='h-5 w-20' src={'./icons/arrow-bottom-red.svg'} />
        </div>
      </div>
      {!isLoadingDevelopments ? <Filters data-html2canvas-ignore="true" dataQuestions={dataQuestions?.data?.data} /> : <FilterSkeleton />}
      {!isLoading ? (
        // <InfiniteScroll
        //   pageStart={0}
        //   initialLoad={false}
        //   loadMore={fetchNextPage}
        //   hasMore={hasNextPage && !isFetching}
        //   loader={
        //     <div className="flex justify-center">
        //       <ColorRing
        //         visible={true}
        //         height="80"
        //         width="80"
        //         ariaLabel="blocks-loading"
        //         wrapperStyle={{}}
        //         wrapperClass="blocks-wrapper"
        //         colors={['#92278f', '#c6168d', '#ed1c24', '#c6168d', '#92278f']}
        //       />
        //     </div>
        //   }
        // >
        <div className={`flex flex-wrap ${isFetching && "opacity-30"}`}>
          {dataInfinity?.data?.data?.length ? dataInfinity?.data?.data?.map((item) =>
            <Item navigate={navigate} isFetching={isFetching} key={item.id} item={item} />
          ) : <p className='p-5'>Не нашёл подходящих квартир. Попробуйте увеличить платёж, и я подберу для вас варианты.</p>}
          {dataInfinity?.data?.data?.length ? <div
            data-html2canvas-ignore="true"
            className="fixed right-2 flex gap-2 bottom-2"
          >
            {!pngShare ? (
              <div data-html2canvas-ignore="true">
                <div
                  data-html2canvas-ignore="true"
                  className={`bg-[url('./assets/images/share-active.svg')]`}
                />
                <div
                  data-html2canvas-ignore="true"
                  ref={shareButtonRef}
                  onPointerEnter={() => setButtonShareHover(true)}
                  onPointerLeave={() => setButtonShareHover(false)}
                  onClick={() => !pngShare && !pngLoading && onButtonShareClick()}
                  className={`${pngLoading ? "opacity-50" : ''} cursor-pointer w-[55px] h-[55px] bg-contain bg-center bg-no-repeat transition-all duration-500 ${buttonShareHover ? `bg-[url('./assets/images/share-active.svg')]` : `bg-[url('./assets/images/share.svg')]`}`}
                />
              </div>
            ) : (
              <div className="bg-white flex w-[55px] h-[55px] items-center justify-center rounded-lg">
                <ColorRing
                  visible={true}
                  height="30"
                  width="30"
                  ariaLabel="blocks-loading"
                  wrapperStyle={{}}
                  wrapperClass="blocks-wrapper"
                  colors={[
                    '#92278f',
                    '#c6168d',
                    '#ed1c24',
                    '#c6168d',
                    '#92278f',
                  ]}
                />
              </div>
            )}
            {!pngLoading ? (
              <div data-html2canvas-ignore="true">
                <div
                  data-html2canvas-ignore="true"
                  className={`bg-[url('./assets/images/save-active.svg')]`}
                />
                <div
                  data-html2canvas-ignore="true"
                  onPointerEnter={() => setButtonDownloadHover(true)}
                  onPointerLeave={() => setButtonDownloadHover(false)}
                  onClick={() => !pngShare && !pngLoading && onButtonDownloadClick()}
                  className={`${pngShare ? "opacity-50" : ''} cursor-pointer w-[55px] h-[55px] bg-contain bg-center  bg-no-repeat transition-all duration-500 ${buttonDownloadHover ? `bg-[url('./assets/images/save-active.svg')]` : `bg-[url('./assets/images/save.svg')]`}`}
                />
              </div>
            ) : (
              <div className="bg-white flex w-[55px] h-[55px] items-center justify-center rounded-lg">
                <ColorRing
                  visible={true}
                  height="30"
                  width="30"
                  ariaLabel="blocks-loading"
                  wrapperStyle={{}}
                  wrapperClass="blocks-wrapper"
                  colors={[
                    '#92278f',
                    '#c6168d',
                    '#ed1c24',
                    '#c6168d',
                    '#92278f',
                  ]}
                />
              </div>
            )}
          </div> : null}
          {/* {!hasNextPage && ( */}
          <div
            data-html2canvas-ignore="true"
            ref={refRepeat}
            className={`p-5 w-full bg-gradient-to-r from-[#92278f] via-[#c6168d] to-[#ed1c24]`}
          >
            {dataInfinity?.data?.meta?.pagination?.pageCount > 0 ? <div className='flex justify-between mb-5'>
              <div
                onClick={() =>
                  !isFetching && dataInfinity?.data?.meta?.pagination?.page !== 1 && handlePrev()
                }
                className={`${isFetching || dataInfinity?.data?.meta?.pagination?.page === 1 && "opacity-50"} flex cursor-pointer [-webkit-tap-highlight-color:rgba(0,0,0,0)] transition-all duration-500 active:scale-95 active:brightness-105 active:border-none justify-center items-center h-[45px] w-[45px] rounded-full bg-[rgba(255,255,255,0.4)]`}
              >
                <div className="w-1/3 h-2/4 bg-cover bg-[url('./assets/images/arrow-prev-white.svg')] bg-no-repeat bg-[top_left_-1px]" />
              </div>
              <div className='h-[45px] rounded-full bg-[rgba(255,255,255,0.4)] flex-grow mx-3 flex items-center justify-center'>
                <p className='font-medium text-white text-base'>{paginationPage} из {dataInfinity?.data?.meta?.pagination?.pageCount}</p>
              </div>
              <div
                onClick={() =>
                  !isFetching && dataInfinity?.data?.meta?.pagination?.pageCount > paginationPage && handleNext()
                }
                className={`${isFetching || (dataInfinity?.data?.meta?.pagination?.page === dataInfinity?.data?.meta?.pagination?.pageCount) && "opacity-50"} flex cursor-pointer [-webkit-tap-highlight-color:rgba(0,0,0,0)] transition-all duration-500 active:scale-95 active:brightness-105 active:border-none justify-center items-center h-[46px] w-[46px] rounded-full bg-[rgba(255,255,255,0.4)]`}
              >
                <div className="w-1/3 h-2/4 bg-cover bg-[url('./assets/images/arrow-next-white.svg')] bg-no-repeat bg-[top_left_1px]" />
              </div>
            </div> : null}
            <p className="text-xs text-white opacity-50 mb-3">
              Хотите повторить подбор или управлять результатами подписки?
            </p>
            <div
              className="cursor-pointer py-4 flex justify-center items-center text-xs mb-1 bg-[rgba(255,255,255,0.2)] text-white rounded active:bg-[rgba(255,255,255,0.4)] transition-all duration-500 active:scale-95 active:brightness-105"
              onClick={() => handleRepeat()}
            >
              Повторить подборку
            </div>
            <div
              className="cursor-pointer py-4 flex justify-center items-center text-xs mb-1 bg-[rgba(255,255,255,0.2)] text-white rounded active:bg-[rgba(255,255,255,0.4)] transition-all duration-500 active:scale-95 active:brightness-105"
              onClick={() => handleSubscriptions()}
            >
              Мои подписки
            </div>
            <div
              className="cursor-pointer py-4 flex justify-center items-center text-xs bg-[rgba(255,255,255,0.2)] text-white rounded active:bg-[rgba(255,255,255,0.4)] transition-all duration-500 active:scale-95 active:brightness-105"
              onClick={() => handleFinish()}
            >
              Закончить подборку
            </div>
          </div>
          {/* )} */}
        </div>
        // </InfiniteScroll>
      ) : (
        <div className="flex flex-grow h-full items-center justify-center">
          <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={['#92278f', '#c6168d', '#ed1c24', '#c6168d', '#92278f']}
          />
        </div>
      )}
    </div>
  )
}

export default Collection
