import Button from "../../../ui/Button";
import { useLogsQuery } from '../../../../queries/mutations';

const Selection = ({ item, setShowMainButton, id, setQuestions, questions, itemId, user }) => {
  const activeAnswers = questions?.find(el => el.id === itemId)?.answer || []
  const logsMutation = useLogsQuery();
  const handleClick = (el) => {
    setQuestions({ id: itemId, answer: [el] })
    logsMutation.mutate({
      telegram_user: id,
      Action: `Выбрал ${el?.QuestionAnswer}`,
    });
  }

  if (activeAnswers?.length && (item?.CitySelector ? user?.cities?.length : true)) {
    setShowMainButton(true)
  } else {
    setShowMainButton(false)
  }

  return <>
    <p className="text-center mb-2">{item?.QuestionTitle}</p>
    <div className="mb-7 flex justify-center">
      <div className="bg-contain h-5 w-20 bg-center bg-[url('./assets/images/arrow-bottom.svg')] bg-no-repeat" />
    </div>
    {item?.QuestionAnswers?.map(el => el?.AnswerEnabled !== false ? <Button
      key={el.id}
      className="my-1 text-sm"
      variant={activeAnswers.find(i => i.id === el.id) ? "active" : ""}
      onClick={() => {
        handleClick(el)
      }}
    >
      {el?.QuestionAnswer}
    </Button> : null)}
  </>
}

export default Selection