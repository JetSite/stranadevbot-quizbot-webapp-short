export const formatUserData = (data) => {
  return {
    UserTelegamID: data?.attributes?.UserTelegamID,
    UserTelegramUsername: data?.attributes?.UserTelegramUsername,
    UserTelegramName: data?.attributes?.UserTelegramName,
    UserName: data?.attributes?.UserName,
    subscriptions: data?.attributes?.subscriptions?.data,
    cities: data?.attributes?.cities?.data,
  };
};
