import { useMutation, useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { getUser, registerUser } from "../../../api";
import useTelegramInitData from "../../../hooks/useTelegramInitData";
import { useLogsQuery } from "../../../queries/mutations";
import useStore from "../../../store";
import { formatUserData } from "../../../utils/formatUserData";
import { useEffect, useState } from "react";
import { ColorRing } from "react-loader-spinner";

const AuthProvider = ({ children }) => {
  const { setUser, setId, clearActiveDevelopment } = useStore((state) => state);
  const { user, tg } = useTelegramInitData();
  const location = useLocation();
  const [localLoading, setLocalLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const logsMutation = useLogsQuery();
  const navigate = useNavigate();
  const { mutate: registerUserMutation } = useMutation(
    () => {
      const data = {
        UserTelegamID: `${user?.id}`,
        UserTelegramUsername: user?.username || "",
        UserTelegramName: user?.first_name || "",
        UserName: "",
        subscriptions: [],
        user_logs: [],
        cities: [],
      };
      return registerUser(data);
    },
    {
      onSuccess: (data) => {
        logsMutation.mutate({
          telegram_user: data?.data?.data?.id,
          Action: `${data?.data?.data?.id} Зарегистрировался в приложении`,
        });
        setUser(formatUserData(data?.data?.data));
        setId(data?.data?.data?.id);
        setLocalLoading(false);
      },
    }
  );

  useEffect(() => {
    //TODO: desable

    if (firstLoad) {
      navigate("/");
      setFirstLoad(false);
      tg.BackButton.hide();
    }
  }, [firstLoad]);
  useEffect(() => {
    if (
      location.pathname !== "/collection" &&
      location.pathname !== "/collectionItem"
    ) {
      clearActiveDevelopment();
    }
  }, [location]);
  const { refetch } = useQuery(["user"], () => getUser(user?.id), {
    onSuccess: (data) => {
      if (!data?.data?.data?.length) {
        registerUserMutation();
      } else {
        logsMutation.mutate({
          telegram_user: data?.data?.data[0]?.id,
          Action: `${data?.data?.data[0]?.id} Вошел в приложение`,
        });
        setUser(formatUserData(data?.data?.data[0]));
        setId(data?.data?.data[0]?.id);
        setLocalLoading(false);
      }
    },
    onError: (data) => {
      if (
        data.message === "Request failed with status code 404" ||
        data?.error?.status === 404
      ) {
        registerUserMutation();
      }
    },
    enabled: false,
    retry: false,
  });

  useEffect(() => {
    if (user?.id) {
      refetch();
    }
    //TODO: not desable
    else {
      // setLocalLoading(false)
    }
  }, [user]);

  if (localLoading) {
    return (
      <div className="flex flex-grow h-full items-center justify-center">
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={["#92278f", "#c6168d", "#ed1c24", "#c6168d", "#92278f"]}
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
