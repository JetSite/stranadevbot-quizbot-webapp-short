// import { LazyLoadImage } from 'react-lazy-load-image-component';
import "react-lazy-load-image-component/src/effects/blur.css";
import { Modal } from "../../../../ui/Modal";
import { CollectionButton } from "../../../../blocks/CollectionItems/CollectionButton";
import { CallMeForm } from "../../../../blocks/Forms/CallMeForm";
import { useLogsQuery } from "../../../../../queries/mutations";
import useStore from "../../../../../store";
import { useState } from "react";
// import Placeholder from '../../../../../assets/images/blur.png'

const Item = ({ item, navigate, isFetching }) => {
  const logsMutation = useLogsQuery();
  const [open, setOpen] = useState(false);
  const id = useStore((state) => state.data.id);
  const handleTelMe = () => {
    setOpen(true);
    logsMutation.mutate({
      telegram_user: id,
      Action: `Нажал на кнопку Закажите звонок`,
    });
  };
  return (
    <>
      <div
        onClick={() => handleTelMe()}
        className="p-5 w-full bg-itemBg border border-borderItem"
      >
        <div className="mb-2 flex justify-center">
          <img
            crossOrigin="anonymous"
            className="object-contain min-h-32"
            src={item?.attributes?.image[0]?.link}
          />
        </div>
        <div className="mb-2">
          <p className="text-xs mb-1">
            {item?.attributes?.area?.value ? (
              <p className="text-center">
                {item?.attributes?.property_type}{" "}
                {item?.attributes?.area?.value}
                м²
              </p>
            ) : (
              item?.attributes?.property_type
            )}
          </p>
          <div className="mb-1 border-t border-borderItem" />
          <p className="text-[10px]">
            от{" "}
            <span className="text-buttonSubmit">
              {parseInt(
                item?.attributes?.paymentAmountByCredit
              )?.toLocaleString("ru") ||
                ipotekaPrice?.toLocaleString("ru")}{" "}
              руб.
            </span>{" "}
            в месяц
          </p>
        </div>
        <div className="mb-2 flex justify-between items-start">
          <div className="w-2/4 mr-1 text-left">
            <p className="text-defaultButtonText text-[8px]">Жилой комплекс</p>
            <p className="text-textRed text-[8px]">
              {item?.attributes?.development?.data?.attributes?.name || ""}
            </p>
          </div>
          <div className="w-2/4 text-right">
            <p className="text-defaultButtonText text-[8px]">Адрес</p>
            <p className="text-[8px]">
              {item?.attributes?.development?.data?.attributes?.address || ""}
            </p>
          </div>
        </div>
        <div className="block text-center [-webkit-tap-highlight-color:rgba(0,0,0,0)] w-full py-2 px-2 border-none outline-none cursor-pointer rounded-full transition-all duration-500 active:scale-95 active:brightness-105 text-md bg-textRed text-white">
          Заказать звонок
        </div>
      </div>
      <Modal open={open} setOpen={setOpen}>
        <CallMeForm id={id} setOpen={setOpen} item={item} />
      </Modal>
    </>
  );
};

export default Item;
