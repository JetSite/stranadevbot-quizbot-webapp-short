import useTelegramInitData from '../../../hooks/useTelegramInitData'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getCities, getQuestions, getSubscriptions } from '../../../api'
import useStore from '../../../store'
import { useLogsQuery, useUpdateUser } from '../../../queries/mutations'
import Politic from '../../ui/Politic'

const Start = () => {
  const navigate = useNavigate()
  const { tg } = useTelegramInitData()
  const { updateUserStore } = useStore((state) => state)
  // const userState = useStore((state) => state.data.user);
  const id = useStore((state) => state.data.id)
  const logsMutation = useLogsQuery()
  const updateUserMutation = useUpdateUser()
  useQuery(['cities'], () => getCities())
  useQuery(['subscriptions'], () => getSubscriptions())
  useQuery(['questions'], () => getQuestions())

  const onComplete = () => {
    logsMutation.mutateAsync({
      telegram_user: id,
      Action: 'Нажал кнопку Далее и перешел на страницу вопросов',
    })
    updateUserStore(updateUserMutation)
    navigate('/questions')
  }

  useEffect(() => {
    tg.onEvent('mainButtonClicked', onComplete)
    return () => {
      tg.offEvent('mainButtonClicked', onComplete)
    }
    // eslint-disable-next-line
  }, [onComplete])

  useEffect(() => {
    tg.MainButton.show()
    tg.MainButton.setParams({
      text: 'Далее',
      color: 'rgb(146, 39, 143)',
    })
  }, [])
  useEffect(() => {
    return () => {
      tg.MainButton.hide()
    }
  }, [])

  return (
    <div
      className={`p-7 flex-col w-full flex-grow flex justify-between h-full`}
    >
      <div>
        <p className="font-bold text-[22px] text-center mb-3">
          Платите за своё!
        </p>
        <p className="text-base text-center mb-2">
          Ответьте на 4 вопроса и подберите подходящую Вам квартиру с платежом
          по ипотеке ниже, чем за съемную — в Москве, Тюмени или Екатеринбурге.
        </p>
        <div className="mb-7 flex justify-center">
          <div className="bg-contain h-5 w-20 bg-center bg-[url('./assets/images/arrow-bottom.svg')] bg-no-repeat" />
        </div>
      </div>
      <Politic />
      {/* <Button variant="active" onClick={() => onComplete()}>
          Далее
        </Button> */}
    </div >
  )
}

export default Start
