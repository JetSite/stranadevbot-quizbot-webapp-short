import { useFormik } from "formik";
import {
  callMeFormSchema,
  callMeInitialValues,
} from "../../../config/formConfig";
import { useLogsQuery } from "../../../queries/mutations";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";
import { pushPhoneNumber } from "../../../api";
import { useEffect, useState } from "react";
import useTelegramInitData from "../../../hooks/useTelegramInitData";

export const CallMeForm = ({ id, setOpen, item }) => {
  const logsMutation = useLogsQuery();
  const { tg } = useTelegramInitData();
  const [success, setSuccess] = useState(false);

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    isValid,
  } = useFormik({
    initialValues: callMeInitialValues,
    isInitialValid: false,
    validateOnChange: true,
    validateOnBlur: false,
    validationSchema: callMeFormSchema,
    onSubmit: (data) => {
      tg.MainButton.disable();
      tg.MainButton.setParams({
        text: "Подтвердить",
        color: "#808080",
      });
      pushPhoneNumber({
        polzovatel_telegram: id,
        PhoneNumber: data.tel.split(" ").join(""),
        zhilye_kompleksy: item?.attributes?.development?.data?.id,
        goroda: item?.attributes?.city?.data?.id,
      });
      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
      }, [1000]);
      logsMutation.mutate({
        telegram_user: id,
        Action: `Отправил номер телефона`,
      });
    },
  });

  useEffect(() => {
    tg.onEvent("mainButtonClicked", handleSubmit);
    return () => {
      tg.offEvent("mainButtonClicked", handleSubmit);
    };
    // eslint-disable-next-line
  }, [handleSubmit]);

  useEffect(() => {
    tg.MainButton.show();
    tg.MainButton.disable();
    tg.MainButton.setParams({
      text: "Подтвердить",
      color: "#808080",
    });
    if (isValid && values.tel.length >= 8) {
      tg.MainButton.enable();
      tg.MainButton.setParams({
        text: "Подтвердить",
        color: "rgb(146, 39, 143)",
      });
    }
  }, [isValid, values]);

  useEffect(() => {
    return () => {
      tg.MainButton.enable();
      tg.MainButton.hide();
      setValues(callMeInitialValues);
    };
  }, []);

  return (
    <>
      <div
        className={!success ? "w-[0px] h-[0px]" : ""}
        onClick={() => setOpen(false)}
      >
        <div className="bg-contain bg-center h-48 w-full bg-[url('./assets/images/thank.svg')] bg-no-repeat" />
      </div>
      <form
        className={success ? "hidden" : "flex flex-col"}
        onSubmit={handleSubmit}
      >
        <input
          name="tel"
          id="tel"
          value={formatPhoneNumber(values.tel)}
          className="w-full text-center py-5"
          placeholder="Ваш номер"
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.tel && values.tel.length >= 8 ? (
          <div className="text-sm text-red-500 mt-1.5">{errors.tel}</div>
        ) : null}
      </form>
    </>
  );
};
