import { useEffect } from 'react'
import { Range } from 'react-range';
import { useLogsQuery } from '../../../../queries/mutations';


const RangeAnswer = ({ item, setShowMainButton, id, setQuestions, questions, itemId, user }) => {
  const range = questions?.find(el => el.id === itemId)?.answer || [+item?.QuestionAnswers[0]?.DefaultValue]
  const logsMutation = useLogsQuery();
  useEffect(() => {
    if (range && (item?.CitySelector ? user?.cities?.length : true)) {
      setShowMainButton(true)
    } else {
      setShowMainButton(false)
    }
  }, [range, user])

  useEffect(() => {
    setQuestions({ id: itemId, answer: range })
  }, [])

  return <>
    <p className="text-center mb-2">{item?.QuestionTitle}</p>
    <div className="mb-7 flex justify-center">
      <div className="bg-contain h-5 w-20 bg-center bg-[url('./assets/images/arrow-bottom.svg')] bg-no-repeat" />
    </div>
    <p className='text-center text-defaultButtonText text-sm'>Размер платежа, ₽</p>
    <p className='text-center text-lg mb-2'>{range}</p>
    <Range
      step={1}
      min={+item?.QuestionAnswers[0]?.MinValue - 1}
      max={+item?.QuestionAnswers[0]?.MaxValue + 1}
      values={range}
      onChange={(values) => { if (values[0] !== +item?.QuestionAnswers[0]?.MinValue - 1 && values[0] !== +item?.QuestionAnswers[0]?.MaxValue + 1) { setQuestions({ id: itemId, answer: values }) } }}
      onFinalChange={(values) => {
        if (values[0] !== item?.QuestionAnswers[0]?.MinValue - 1 && values[0] !== item?.QuestionAnswers[0]?.MaxValue + 1) {
          logsMutation.mutate({
            telegram_user: id,
            Action: `Выбрал ${values[0]}`,
          })
        }
      }}
      renderTrack={({ props, children }) => (
        <div
          {...props}
          style={{
            ...props.style,
          }}
          className='h-0.5 w-full bg-[#92278F] rounded-full'
        >
          {children}
        </div>
      )}
      renderThumb={({ props }) => (
        <div
          {...props}
          style={{
            ...props.style,
          }}
          className='outline-none h-5 w-5 rounded-full bg-[#92278F]'
        />
      )}
    />
    <div className='my-3 flex justify-between'>
      <p className='text-defaultButtonText text-xs'>{item?.QuestionAnswers[0]?.MinValue}</p>
      <p className='text-defaultButtonText text-xs'>{item?.QuestionAnswers[0]?.MaxValue}</p>
    </div>
  </>
}

export default RangeAnswer