import useTelegramInitData from "../../../hooks/useTelegramInitData";
import Button from "../../ui/Button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getCities, getQuestions, getSubscriptions } from "../../../api";
import MainSkeleton from "../../ui/Skeletons/MainSkeleton";
import useStore from "../../../store";
import { useLogsQuery, useUpdateUser } from "../../../queries/mutations";
import { useEffect } from "react";

const Main = () => {
  const navigate = useNavigate();
  const { user, tg } = useTelegramInitData();
  const { setCities, updateUserStore } = useStore((state) => state);
  const userState = useStore((state) => state.data.user);
  const id = useStore((state) => state.data.id);
  const logsMutation = useLogsQuery();
  const updateUserMutation = useUpdateUser();
  const { isLoading, data } = useQuery(["cities"], () => getCities());
  useQuery(["subscriptions"], () => getSubscriptions());
  useQuery(["questions"], () => getQuestions());

  const handleClickCity = (item) => {
    setCities(item, logsMutation);
  };

  const onComplete = () => {
    logsMutation.mutateAsync({
      telegram_user: id,
      Action: "Нажал кнопку Подтвердить и перешел на страницу подписок",
    });
    updateUserStore(updateUserMutation);
    tg.MainButton.hide();
    // navigate("/subscriptions");
    navigate("/questions");
  };

  useEffect(() => {
    tg.onEvent("mainButtonClicked", onComplete);
    return () => {
      tg.offEvent("mainButtonClicked", onComplete);
    };
    // eslint-disable-next-line
  }, [onComplete]);

  useEffect(() => {
    if (userState.cities?.length) {
      tg.MainButton.show();
      tg.MainButton.setParams({
        text: "Подтвердить",
        color: "rgb(146, 39, 143)"
      });
    } else {
      tg.MainButton.hide();
    }
  }, [userState.cities]);

  useEffect(() => {
    return () => {
      tg.MainButton.hide();
    }
  }, []);

  // const handleClose = () => {
  //   logsMutation.mutate({
  //     telegram_user: id,
  //     Action: "Нажал кнопку не хочу проходить опрос",
  //   });
  //   tg.close();
  // };

  if (isLoading) {
    return <MainSkeleton />;
  }

  return (
    <div className={`p-7 flex-col w-full`}>
      {user?.first_name ? (
        <p className="text-center text-textColor">
          Добрый день,
          {` ${user?.first_name || ""}` + " " + `${user?.last_name || ""}`}
        </p>
      ) : (
        <p className="text-center text-textColor">Добрый день, {user?.username}</p>
      )}
      <p className="text-center text-textColor mb-2">Какой город вас интересует?</p>
      <div className="mb-7 flex justify-center">
        <div className="bg-contain h-5 w-20 bg-center bg-[url('./assets/images/arrow-bottom.svg')] bg-no-repeat" />
      </div>
      {data?.data?.data.map((item) => (
        <Button
          key={item.id}
          variant={
            userState?.cities?.find((el) => el.id === item.id) ? "active" : ""
          }
          className="my-1 text-sm"
          onClick={() => {
            handleClickCity(item);
          }}
        >
          {item?.attributes?.CityName}
        </Button>
      ))}
      {/* {userState.cities?.length ? (
        <SubmitButton onClick={() => onComplete()}>
          Подтвердить
        </SubmitButton>
      ) : null} */}
    </div>
  );
};

export default Main;
