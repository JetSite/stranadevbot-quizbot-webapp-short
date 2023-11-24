import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTelegramInitData from "../../../hooks/useTelegramInitData";
import { useLogsQuery } from "../../../queries/mutations";
import useStore from "../../../store";
import Button from "../../ui/Button";

const SelectionQuestion = () => {
  const { tg } = useTelegramInitData();
  const navigate = useNavigate();
  const logsMutation = useLogsQuery();
  const id = useStore((state) => state.data.id);
  const UserName = useStore((state) => state.data.user.UserName);

  useEffect(() => {
    tg.BackButton.show();
  }, []);

  const onComplete = () => {
    tg.BackButton.hide();
    logsMutation.mutateAsync({
      telegram_user: id,
      Action: "Нажал кнопку Да и перешел на страницу Вопросов",
    });
    navigate("/questions");
  };

  const onClose = () => {
    tg.BackButton.hide();
    logsMutation.mutateAsync({
      telegram_user: id,
      Action: "Нажал кнопку Нет и перешел на страницу Благодарность",
    });
    navigate("/thanksPage");
  };

  const backHandle = () => {
    tg.BackButton.hide();
    if (UserName) {
      logsMutation.mutate({
        telegram_user: id,
        Action: "Нажал кнопку назад и перешел на страницу регламент",
      });
      navigate("/reglament");
    } else {
      logsMutation.mutate({
        telegram_user: id,
        Action: "Нажал кнопку назад и перешел на страницу выбора имени",
      });
      navigate("/nameSuccess");
    }
  };

  useEffect(() => {
    tg.onEvent("backButtonClicked", backHandle);
    return () => {
      tg.offEvent("backButtonClicked", backHandle);
    };
    // eslint-disable-next-line
  }, [backHandle]);

  return (
    <div className="p-7 flex-col w-full">
      <p className="text-center mb-2">Хотите получать подборку квартир?</p>
      <div className="mb-7 flex justify-center">
        <div className="bg-contain h-5 w-20 bg-center bg-[url('./assets/images/arrow-bottom.svg')] bg-no-repeat" />
      </div>
      <Button className="my-1" onClick={() => onComplete()}>
        Да
      </Button>
      <Button className="my-1" onClick={() => onClose()}>
        Нет
      </Button>
    </div>
  );
};

export default SelectionQuestion;
