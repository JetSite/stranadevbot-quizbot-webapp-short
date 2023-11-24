import { useQuery } from "react-query";
import { getCities } from "../../../api";
import useTelegramInitData from "../../../hooks/useTelegramInitData";
import useStore from "../../../store";
import Button from "../../ui/Button";
import { useLogsQuery, useUpdateUser } from "../../../queries/mutations";

const CityChange = () => {
  const { user } = useTelegramInitData();
  const { setCities, updateUserStore } = useStore((state) => state);
  const userState = useStore((state) => state.data.user);
  const updateUserMutation = useUpdateUser();
  const logsMutation = useLogsQuery();
  const { data } = useQuery(["cities"], () => getCities());

  const handleClickCity = (item) => {
    const cityScroll = document.querySelector('#city');
    cityScroll.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setCities(item, logsMutation);
    updateUserStore(updateUserMutation);
  };

  return <div className={`p-7 pb-2 pt-0 flex-col w-full`}>
    {user?.first_name ? (
      <p className="text-center text-xs text-textColor">
        Добрый день,
        {` ${user?.first_name || ""}` + " " + `${user?.last_name || ""}`}
      </p>
    ) : (
      <p className="text-center text-xs text-textColor">Добрый день, {user?.username}</p>
    )}
    <p className="text-center text-textColor mb-2 text-xs">Какой город вас интересует?</p>
    <div className="mb-2 flex justify-center">
      <div className="bg-contain h-5 w-20 bg-center bg-[url('./assets/images/arrow-bottom.svg')] bg-no-repeat" />
    </div>
    <div id="city">
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
    </div>
  </div>

}

export default CityChange