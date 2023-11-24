import { useRef } from 'react'
import { CollectionButton } from './CollectionButton'
import { useNavigate } from 'react-router-dom'
import { useLogsQuery } from '../../../queries/mutations'
import { Modal } from '../../ui/Modal'
import { useEffect } from 'react'
import { CallMeForm } from '../Forms/CallMeForm'
import { ColorRing } from 'react-loader-spinner'
import useTelegramInitData from '../../../hooks/useTelegramInitData'

export const CollectionItemActions = ({
  id,
  onButtonDownloadClick,
  onButtonShareClick,
  pngLoading,
  pdf,
  setPdf,
  setOpen,
  open,
  item
}) => {

  const navigate = useNavigate()
  const logsMutation = useLogsQuery()
  const { tg } = useTelegramInitData();
  const shareButtonRef = useRef()

  const handleDialog = () => {
    logsMutation.mutate({
      telegram_user: id,
      Action: `Нажал на кнопку Задайте вопросы в чате`,
    })
    tg.openTelegramLink("https://t.me/stranadevelopment_bot")
  }
  const handleSubs = () => {
    logsMutation.mutate({
      telegram_user: id,
      Action: `Нажал на кнопку Мои подписки`,
    })
    tg.openTelegramLink("https://t.me/strana_themes_bot")
  }

  // const handleTel = () => {
  //   logsMutation.mutate({
  //     telegram_user: id,
  //     Action: `Нажал на кнопку Позвоните менеджеру`,
  //   })
  // }
  const handleBackButton = () => {
    logsMutation.mutate({
      telegram_user: id,
      Action: `Нажал на кнопку Вернитесь к предложению и перешел на страницу квартир`,
    })
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    navigate(-1)
  }
  const handleTelMe = () => {
    setOpen(true)
    logsMutation.mutate({
      telegram_user: id,
      Action: `Нажал на кнопку Закажите звонок`,
    })
  }
  useEffect(() => {
    if (pdf !== "none") {
      shareButtonRef.current.onclick = () =>
        tg.openLink(`https://t.me/share/url?url=${pdf}`, {
          try_instant_view: true,
        })
      shareButtonRef.current?.onclick()
      setPdf('none')
    }
  }, [pdf, shareButtonRef]);
  return (
    <>
      <div className="mt-7 flex flex-col gap-2 mb-5">
        <CollectionButton
          color="red"
          title="Заказать звонок"
          onClick={() => handleTelMe()}
        />
        <CollectionButton
          color="violet"
          title="Задать вопросы в чате"
          onClick={() => handleDialog()}
        />
        <CollectionButton
          color="violet"
          title="Мои подписки"
          onClick={() => handleSubs()}
        />
        {/* <CollectionButton
          color="violet"
          title="Позвоните менеджеру"
          onClick={() => { handleTel() }}
        /> */}
        <Modal open={open} setOpen={setOpen}>
          <CallMeForm id={id} setOpen={setOpen} item={item} />
        </Modal>
        {!pngLoading ? <CollectionButton
          color="grayDark"
          title="Сохранить подборку"
          onClick={() => onButtonDownloadClick()}
        /> : <div className="flex pb-5 flex-grow h-full items-center justify-center"><ColorRing
          visible={true}
          height="30"
          width="30"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={['#92278f', '#c6168d', '#ed1c24', '#c6168d', '#92278f']}
        /></div>}
        {!pngLoading ? (<div
          ref={shareButtonRef}
          className='block text-center [-webkit-tap-highlight-color:rgba(0,0,0,0)] w-full py-4 px-4 border-none outline-none cursor-pointer rounded-full transition-all duration-500 active:scale-95 active:brightness-105 text-lg bg-slate-200 text-slate-700'
          onClick={() => onButtonShareClick()}
        >Отправить подборку другу
        </div>) :
          <div className="flex pb-5 flex-grow h-full items-center justify-center"><ColorRing
            visible={true}
            height="30"
            width="30"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={['#92278f', '#c6168d', '#ed1c24', '#c6168d', '#92278f']}
          /></div>}
      </div>
      <CollectionButton
        color="gray"
        title="Вернуться к предложению"
        onClick={() => handleBackButton()}
      />
    </>
  )
}
