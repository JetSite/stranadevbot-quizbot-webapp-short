import { useEffect, useState } from "react";

const tg = window.Telegram.WebApp;

function useTelegramInitData() {
  const [data, setData] = useState({});

  const onClose = () => {
    tg.close();
  };

  const onToggleButton = () => {
    if (tg.MainButton.isVisible) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  };

  useEffect(() => {
    const firstLayerInitData = Object.fromEntries(
      new URLSearchParams(window.Telegram.WebApp.initData)
    );

    const initData = {};

    for (const key in firstLayerInitData) {
      try {
        initData[key] = JSON.parse(firstLayerInitData[key]);
      } catch {
        initData[key] = firstLayerInitData[key];
      }
    }

    setData(initData);
  }, []);

  return {
    onClose,
    onToggleButton,
    tg,
    user: data?.user,
    queryId: data?.query_id,
  };
}

export default useTelegramInitData;
