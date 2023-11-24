import { useEffect } from 'react'
import Input from '../../../ui/Input/';
import { useLogsQuery } from '../../../../queries/mutations';

const InputAnswer = ({ item, setShowMainButton, id, setQuestions, questions, itemId, user }) => {
  const logsMutation = useLogsQuery();
  const value = questions?.find(el => el.id === itemId)?.answer || ""

  const handleAnswer = (str) => {
    setQuestions({ id: itemId, answer: str })
    logsMutation.mutate({
      telegram_user: id,
      Action: `Написал ${str}`,
    });
  }

  useEffect(() => {
    if (value && (item?.CitySelector ? user?.cities?.length : true)) {
      setShowMainButton(true)
    } else {
      setShowMainButton(false)
    }
  }, [value, user])

  return <>
    <p>{item?.QuestionTitle}</p>
    <Input
      onChange={handleAnswer}
      value={value}
      placeholder={item?.QuestionAnswers[0]?.QuestionAnswer}
    />
  </>
}

export default InputAnswer