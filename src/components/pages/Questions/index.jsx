import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../../../store/index";
import useTelegramInitData from "../../../hooks/useTelegramInitData";
import { useLogsQuery } from "../../../queries/mutations";
import { getQuestions } from "../../../api";
import { useQuery } from "react-query";
import SelectionMulti from "./components/SelectionMulti";
import Selection from "./components/Selection";
import InputAnswer from "./components/InputAnswer";
import Range from "./components/Range";
import SubmitButton from "../../ui/SubmitButton";
import CityChange from "../../blocks/CityChange";
import Politic from "../../ui/Politic";

const Questions = () => {
  const { tg } = useTelegramInitData();
  const navigate = useNavigate();
  const logsMutation = useLogsQuery();
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [showMainButton, setShowMainButton] = useState(false);
  const id = useStore((state) => state.data.id);
  const user = useStore((state) => state.data.user);
  const questions = useStore((state) => state.data.questions);
  const {
    setQuestions,
    setTags,
    setIpotekaPrice,
    setIpotekaIds,
    setSortActiveFilters,
  } = useStore((state) => state);
  const { data } = useQuery(["questions"], () => getQuestions());

  // const backHandle = () => {
  //   if (activeQuestion !== 0) {
  //     setActiveQuestion(activeQuestion - 1)
  //     logsMutation.mutateAsync({
  //       telegram_user: id,
  //       Action: `Нажал кнопку назад и перешел на вопрос с айди ${data?.data?.data[activeQuestion].id}`,
  //     });
  //   } else {
  //     tg.BackButton.hide();
  //     logsMutation.mutateAsync({
  //       telegram_user: id,
  //       Action: "Нажал кнопку назад и перешел назад",
  //     });
  //     navigate(-1);
  //   }
  // };

  const onComplete = () => {
    logsMutation.mutate({
      telegram_user: id,
      Action: "Прошел цикл вопросов и перешел на страницу квартир",
    });
    setSortActiveFilters({
      activeFilterPrice: false,
      activeFilterRoom: true,
      sortFilterRoom: "desc",
    });
    setTags();
    setIpotekaPrice();
    setIpotekaIds();
    navigate("/collection");
  };

  useEffect(() => {
    tg.onEvent("mainButtonClicked", onComplete);
    return () => {
      tg.offEvent("mainButtonClicked", onComplete);
    };
    // eslint-disable-next-line
  }, [onComplete]);

  useEffect(() => {
    if (showMainButton) {
      tg.MainButton.show();
      tg.MainButton.setParams({
        text: "Подтвердить",
        color: "rgb(146, 39, 143)",
      });
    } else {
      tg.MainButton.hide();
    }
  }, [showMainButton]);

  useEffect(() => {
    return () => {
      tg.MainButton.hide();
    };
  }, []);

  // useEffect(() => {
  //   tg.onEvent("backButtonClicked", backHandle);
  //   return () => {
  //     tg.offEvent("backButtonClicked", backHandle);
  //   };
  //   // eslint-disable-next-line
  // }, [backHandle]);

  // useEffect(() => {
  //   tg.BackButton.show();
  // }, []);

  return (
    <div className={`p-7 flex-col w-full`}>
      {data?.data?.data
        .sort((a, b) => (+a?.attributes?.Order > b?.attributes?.Order ? 1 : -1))
        .map((item, idx) => {
          // if (item.attributes.QuestionType === 'Selection(multi)' && idx === activeQuestion) {
          //   return <> {item?.attributes?.CitySelector ? <CityChange /> : null} <SelectionMulti questions={questions} id={id} setQuestions={setQuestions} setShowMainButton={setShowMainButton} key={idx} item={item?.attributes} itemId={item?.id} user={user} />{idx === 0 ? <Politic /> : null}</>
          // }
          // if (item.attributes.QuestionType === 'Selection' && idx === activeQuestion) {
          //   return <>{item?.attributes?.CitySelector ? <CityChange /> : null}<Selection id={id} questions={questions} setQuestions={setQuestions} setShowMainButton={setShowMainButton} key={idx} item={item?.attributes} itemId={item?.id} user={user} />{idx === 0 ? <Politic /> : null}</>
          // }
          // if (item.attributes.QuestionType === 'Text' && idx === activeQuestion) {
          //   return <>{item?.attributes?.CitySelector ? <CityChange /> : null}<InputAnswer id={id} questions={questions} setQuestions={setQuestions} setShowMainButton={setShowMainButton} key={idx} item={item?.attributes} itemId={item?.id} user={user} />{idx === 0 ? <Politic /> : null}</>
          // }
          if (
            item.attributes.QuestionType === "Range" &&
            idx === activeQuestion
          ) {
            return (
              <>
                {item?.attributes?.CitySelector ? <CityChange /> : null}
                <Range
                  id={id}
                  questions={questions}
                  setQuestions={setQuestions}
                  setShowMainButton={setShowMainButton}
                  key={idx}
                  item={item?.attributes}
                  itemId={item?.id}
                  user={user}
                />
                {idx === 0 ? <Politic /> : null}
              </>
            );
          }
        })}
      {/* {showMainButton ? (
        <SubmitButton onClick={() => onComplete()}>
          Подтвердить
        </SubmitButton>
      ) : null} */}
    </div>
  );
};

export default Questions;
