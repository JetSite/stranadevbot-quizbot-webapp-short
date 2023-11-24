import { useEffect } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { getSubscriptions } from "../../../api";
import useTelegramInitData from "../../../hooks/useTelegramInitData";
import { useLogsQuery, useUpdateUser } from "../../../queries/mutations";
import useStore from "../../../store";
import Button from "../../ui/Button";
import SubscriptionsSkeleton from "../../ui/Skeletons/SubscriptionsSkeleton";
import CancelButton from "../../ui/CancelButton";

const Subscriptions = () => {
  const { tg } = useTelegramInitData();
  const navigate = useNavigate();
  const logsMutation = useLogsQuery();
  const updateUserMutation = useUpdateUser();
  const userState = useStore((state) => state.data.user);
  const { setSubscriptions, updateUserStore } = useStore((state) => state);
  const { isLoading, data } = useQuery(["subscriptions"], () =>
    getSubscriptions()
  );
  const id = useStore((state) => state.data.id);

  useEffect(() => {
    tg.BackButton.show();
  }, []);

  const backHandle = () => {
    tg.BackButton.hide();
    logsMutation.mutateAsync({
      telegram_user: id,
      Action: "Нажал кнопку назад и перешел на страницу выбора города",
    });
    navigate("/main");
  };

  const onComplete = () => {
    logsMutation.mutateAsync({
      telegram_user: id,
      Action: "Нажал кнопку Подтвердить и перешел на страницу регламента",
    });
    updateUserStore(updateUserMutation);
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
    if (userState.subscriptions?.length) {
      tg.MainButton.show();
      tg.MainButton.setParams({
        text: "Далее",
        color: "rgb(146, 39, 143)"
      });
    } else {
      tg.MainButton.hide();
    }
  }, [userState.subscriptions]);
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

  const handleClick = (item) => {
    setSubscriptions(item, logsMutation);
  };

  const handleClose = () => {
    logsMutation.mutate({
      telegram_user: id,
      Action: "Нажал кнопку не хочу проходить опрос",
    });
    tg.close();
  };

  if (isLoading) {
    return <SubscriptionsSkeleton />;
  }

  return (
    <div className={`p-7 flex-col w-full`}>
      <p className="text-center mb-2">Какие подписки вас интересуют?</p>
      <div className="mb-7 flex justify-center">
        <div className="bg-contain h-5 w-20 bg-center bg-[url('./assets/images/arrow-bottom.svg')] bg-no-repeat" />
      </div>
      {data?.data?.data.map((item) => (
        <Button
          key={item.id}
          variant={
            userState?.subscriptions?.find((el) => el.id === item.id)
              ? "active"
              : ""
          }
          className="my-1 text-sm"
          onClick={() => {
            handleClick(item);
          }}
        >
          {item?.attributes?.SubscriptionTitle}
        </Button>
      ))}
      <CancelButton className="my-1 text-sm" onClick={() => handleClose()}>
        Не хочу подписываться
      </CancelButton>
      {/* {userState.subscriptions?.length ? (
        <SubmitButton onClick={() => onComplete()}>
          Подтвердить
        </SubmitButton>
      ) : null} */}
    </div>
  );
};

export default Subscriptions;
