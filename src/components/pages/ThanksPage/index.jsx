import { useEffect } from 'react'
import useTelegramInitData from '../../../hooks/useTelegramInitData'

const ThanksPage = () => {
  const { tg } = useTelegramInitData()

  useEffect(() => {
    tg.BackButton.hide()
  }, [])

  return (
    <div className="p-7 flex-grow flex-col h-full w-full flex justify-center align-center">
      <div className="bg-contain bg-center h-48 w-full bg-[url('./assets/images/thank.svg')] bg-no-repeat" />
      <p className="text-center mt-4">Спасибо за обращение, ждем вас снова.</p>
    </div>
  )
}

export default ThanksPage
