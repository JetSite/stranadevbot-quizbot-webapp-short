import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTelegramInitData from "../../../hooks/useTelegramInitData";
import { useLogsQuery, useUpdateUser } from "../../../queries/mutations";
import useStore from "../../../store";
import Input from "../../ui/Input";

const NameSuccess = () => {
  const { tg } = useTelegramInitData();
  const navigate = useNavigate();
  const logsMutation = useLogsQuery();
  const updateUserMutation = useUpdateUser();
  const { setNameSuccessBack, setUserName, updateUserStore } = useStore(
    (state) => state
  );
  const id = useStore((state) => state.data.id);
  const { UserName } = useStore((state) => state.data.user);
  const [defaultName, setDefautName] = useState();
  useEffect(() => {
    setDefautName(UserName);
    tg.BackButton.show();
  }, []);

  const onComplete = () => {
    logsMutation.mutateAsync({
      telegram_user: id,
      Action:
        "Нажал кнопку Подтвердить и перешел на страницу Хотите получить подборку квартир?",
    });
    navigate("/selectionQuestion");
    updateUserStore(updateUserMutation);
  };

  const backHandle = () => {
    logsMutation.mutate({
      telegram_user: id,
      Action: "Нажал кнопку назад и перешел на страницу регламент",
    });
    setUserName(defaultName);
    tg.BackButton.hide();
    setNameSuccessBack(true);
    navigate("/reglament");
  };

  useEffect(() => {
    tg.onEvent("mainButtonClicked", onComplete);
    return () => {
      tg.offEvent("mainButtonClicked", onComplete);
    };
    // eslint-disable-next-line
  }, [onComplete]);

  useEffect(() => {
    if (UserName) {
      tg.MainButton.show();
      tg.MainButton.setParams({
        text: "Продолжить",
        color: "rgb(146, 39, 143)"
      });
    } else {
      tg.MainButton.hide()
    }
  }, [UserName]);
  useEffect(() => {
    return () => {
      tg.MainButton.hide();
    }
  }, []);

  useEffect(() => {
    tg.onEvent("backButtonClicked", backHandle);
    return () => {
      tg.offEvent("backButtonClicked", backHandle);
    };
    // eslint-disable-next-line
  }, [backHandle]);

  const handleName = (e) => {
    logsMutation.mutate({
      telegram_user: id,
      Action: `Ввел имя ${e}`,
    });
    setUserName(e);
  };

  return (
    <div className="p-7 flex-col w-full">
      <p className="text-center mb-2">Благодарим за подписку! Как мы можем к вам обращаться?</p>
      <div className="mb-7 flex justify-center">
        <div className="bg-contain h-5 w-20 bg-center bg-[url('./assets/images/arrow-bottom.svg')] bg-no-repeat" />
      </div>
      <Input
        onChange={(e) => handleName(e)}
        value={UserName}
        placeholder="Введите Ваше имя"
      />
      {/* {UserName ? (
        <SubmitButton onClick={() => onComplete()}>
          Продолжить
        </SubmitButton>
      ) : null} */}
    </div>
  );
};

export default NameSuccess;
