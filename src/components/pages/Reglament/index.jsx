import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../../../store/index";
import useTelegramInitData from "../../../hooks/useTelegramInitData";
import Button from "../../ui/Button";
import { useLogsQuery } from "../../../queries/mutations";
import CancelButton from "../../ui/CancelButton";

const Reglament = () => {
  const { tg } = useTelegramInitData();
  const navigate = useNavigate();
  const logsMutation = useLogsQuery();
  const nameSuccessBack = useStore((state) => state.data.nameSuccessBack);
  const id = useStore((state) => state.data.id);
  const UserName = useStore((state) => state.data.user.UserName);

  useEffect(() => {
    tg.BackButton.show();
  }, []);

  const backHandle = () => {
    tg.BackButton.hide();
    logsMutation.mutateAsync({
      telegram_user: id,
      Action: "Нажал кнопку назад и перешел на страницу подписок",
    });
    navigate("/subscriptions");
  };

  useEffect(() => {
    tg.onEvent("backButtonClicked", backHandle);
    return () => {
      tg.offEvent("backButtonClicked", backHandle);
    };
    // eslint-disable-next-line
  }, [backHandle]);

  const handleSuccess = () => {
    if (UserName) {
      logsMutation.mutateAsync({
        telegram_user: id,
        Action:
          "Нажал кнопку Спасибо и перешел на страницу Хотите получить подборку квартир?",
      });
      navigate("/selectionQuestion");
    } else {
      logsMutation.mutateAsync({
        telegram_user: id,
        Action:
          "Нажал кнопку Спасибо, я подтверждаю подписку и перешел на страницу ввода имени",
      });
      navigate("/nameSuccess");
    }

  };

  const handleClose = () => {
    logsMutation.mutate({
      telegram_user: id,
      Action: "Нажал кнопку Не хочу подписываться",
    });
    tg.close();
  };

  const handleComplete = () => {
    logsMutation.mutate({
      telegram_user: id,
      Action: "Нажал кнопку Хочу получить подборку квартир и перешел на страницу вопросов",
    });
    tg.BackButton.hide();
    navigate("/questions");
  };

  return (
    <div className="p-7 flex-col w-full">
      <p className="text-center mb-2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.
      </p>
      <div className="mb-7 flex justify-center">
        <div className="bg-contain h-5 w-20 bg-center bg-[url('./assets/images/arrow-bottom.svg')] bg-no-repeat" />
      </div>
      <Button className="my-1" variant="active" onClick={() => handleSuccess()}>
        Я подтверждаю подписку
      </Button>
      <CancelButton className="my-1" onClick={() => handleClose()}>
        Не хочу подписываться
      </CancelButton>
      {!nameSuccessBack ? (
        <Button className="my-1" onClick={() => handleComplete()}>
          Смотреть подборку квартир
        </Button>
      ) : null}
    </div>
  );
};

export default Reglament;
