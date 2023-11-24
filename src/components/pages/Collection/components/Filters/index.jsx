import { useEffect, useState } from "react";
import { FilterModal } from "../FilterModal";
import { DevelopmentFilter } from "./DevelopmentFilter";
import useTelegramInitData from "../../../../../hooks/useTelegramInitData.js";
import useStore from "../../../../../store";
import { Range } from "react-range";
import { useLogsQuery } from "../../../../../queries/mutations";

const RangeFilter = ({
  ipotekaPrice,
  dataQuestions,
  setShowRange,
  clearFiltersDevelopment,
}) => {
  const id = useStore((state) => state.data.id);
  const [localValues, setLocalValues] = useState([ipotekaPrice]);
  const min =
    +dataQuestions.find((el) => el.id === 1)?.attributes?.QuestionAnswers[0]
      ?.MinValue - 1;
  const max =
    +dataQuestions.find((el) => el.id === 1)?.attributes?.QuestionAnswers[0]
      ?.MaxValue + 1;
  const setIpotekaPrice = useStore((state) => state.setIpotekaPrice);
  const setPaginationPage = useStore((state) => state.setPaginationPage);
  const logsMutation = useLogsQuery();

  const saveHandle = () => {
    setIpotekaPrice(localValues[0]);
    setShowRange(false);
    clearFiltersDevelopment();
    setPaginationPage(1);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    logsMutation.mutate({
      telegram_user: id,
      Action: `Нажал на сохранить ипотеку`,
    });
  };

  return (
    <>
      <p className="mt-2 text-center text-defaultButtonText text-sm">
        Размер платежа, ₽
      </p>
      <p className="text-center text-lg mb-2">
        {localValues[0]?.toLocaleString("ru")}
      </p>
      {localValues[0] ? (
        <Range
          step={1}
          min={min}
          max={max}
          values={localValues}
          onChange={(values) => {
            if (values[0] !== min && values[0] !== max) {
              setLocalValues(values);
            }
          }}
          onFinalChange={(values) => {
            if (values[0] !== min && values[0] !== max) {
              logsMutation.mutate({
                telegram_user: id,
                Action: `Выбрал ${values[0]}`,
              });
            }
          }}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
              }}
              className="h-0.5 w-full bg-[#92278F] rounded-full"
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              style={{
                ...props.style,
              }}
              className="outline-none h-5 w-5 rounded-full bg-[#92278F]"
            />
          )}
        />
      ) : null}
      <div className="my-3 flex justify-between">
        <p className="text-defaultButtonText text-xs">{min + 1}</p>
        <p className="text-defaultButtonText text-xs">{max - 1}</p>
      </div>
      <div
        onClick={() => saveHandle()}
        className="border border-buttonSubmit rounded-full py-1 px-3 text-buttonSubmit transition-all duration-500 active:scale-95 active:brightness-105 cursor-pointer w-full text-center"
      >
        Сохранить
      </div>
    </>
  );
};

const Filters = ({ dataQuestions }) => {
  const [open, setOpen] = useState(false);
  const [showRange, setShowRange] = useState(false);
  const { tg } = useTelegramInitData();
  const setActiveFilters = useStore((state) => state.setActiveFilters);
  const setActiveCities = useStore((state) => state.setActiveCities);
  const setSortFilterPrice = useStore((state) => state.setSortFilterPrice);
  const setSortFilterRoom = useStore((state) => state.setSortFilterRoom);
  const setPaginationPage = useStore((state) => state.setPaginationPage);
  const clearFiltersDevelopment = useStore((state) => state.clearFiltersDevelopment);

  const {
    filtersData,
    filtersCount,
    sortFilterPrice,
    sortFilterRoom,
    activeFilterPrice,
    activeFilterRoom,
    activeCities,
    activeFilters,
    ipotekaPrice,
  } = useStore((state) => state.data);
  const setFiltersCount = useStore((state) => state.setFiltersCount);

  useEffect(() => {
    if (open) {
      tg.MainButton.show();
      tg.MainButton.setParams({
        text: "Подтвердить выбор",
        color: "rgb(146, 39, 143)",
      });
    } else {
      tg.MainButton.hide();
    }
  }, [open]);

  const onSuccess = () => {
    setOpen(false);
  };

  useEffect(() => {
    tg.onEvent("mainButtonClicked", onSuccess);
    return () => {
      tg.offEvent("mainButtonClicked", onSuccess);
    };
    // eslint-disable-next-line
  }, [onSuccess]);

  useEffect(() => {
    if (!activeFilters.length) {
      setActiveFilters(filtersData?.map((e) => ({ city: e.city, dev: [] })));
    }
    if (!activeCities.length) {
      setActiveCities(filtersData?.map((e) => e.city));
    }
  }, [filtersData]);

  useEffect(() => {
    let initialCount = 0;
    filtersData?.forEach((e) => e.dev.forEach(() => initialCount++));
    setFiltersCount(filtersCount || initialCount);
  }, [filtersData]);

  const handleSortFilterPrice = () => {
    setSortFilterPrice();
    setPaginationPage(1);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSortFilterRoom = () => {
    setSortFilterRoom();
    setPaginationPage(1);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return filtersData?.length > 0 ? (
    <div
      data-html2canvas-ignore="true"
      className="sticky top-0 bg-white p-5 border-slate-200 border-b z-10"
    >
      <div className="flex gap-1">
        <button
          onClick={() => setOpen(true)}
          className="whitespace-nowrap transition-all duration-500 active:scale-95 active:brightness-105 flex text-xs justify-between items-center cursor-pointer  w-full rounded-full bg-slate-100"
        >
          <span className="py-2 px-3">ЖК</span>

          <span className="bg-slate-300 px-3 rounded-full pt-2 pb-1.5">
            {filtersCount}
          </span>
        </button>
        <button
          onClick={() => handleSortFilterPrice()}
          className="whitespace-nowrap transition-all duration-500 active:scale-95 active:brightness-105 flex text-xs justify-between items-center cursor-pointer  w-full rounded-full bg-slate-100"
        >
          <span className="py-2 px-3">Цена</span>
          <img
            className={`bg-slate-300 rounded-full w-8 px-[5px] h-full ${
              sortFilterPrice === "asc" ? "rotate-180" : ""
            } ${activeFilterPrice ? "" : "opacity-50"}`}
            src="./icons/sort.svg"
          />
        </button>
        <button
          onClick={() => handleSortFilterRoom()}
          className="whitespace-nowrap transition-all duration-500 active:scale-95 active:brightness-105 flex text-xs justify-between items-center cursor-pointer  w-full rounded-full bg-slate-100"
        >
          <span className="py-2 px-3">Комнаты</span>
          <img
            className={`bg-slate-300 rounded-full w-8 px-[5px] h-full ${
              sortFilterRoom === "asc" ? "rotate-180" : ""
            } ${activeFilterRoom ? "" : "opacity-50"}`}
            src="./icons/sort.svg"
          />
        </button>
      </div>
      {!showRange ? (
        <div className="flex mt-4 text-sm gap-2 items-center">
          <p>{ipotekaPrice?.toLocaleString("ru")} ₽/в месяц</p>
          <div
            onClick={() => setShowRange(true)}
            className="border border-buttonSubmit rounded-full py-1 px-3 text-buttonSubmit transition-all duration-500 active:scale-95 active:brightness-105 cursor-pointer"
          >
            Изменить
          </div>
        </div>
      ) : (
        <RangeFilter
          setShowRange={setShowRange}
          ipotekaPrice={ipotekaPrice}
          dataQuestions={dataQuestions}
          clearFiltersDevelopment={clearFiltersDevelopment}
        />
      )}
      <FilterModal setOpen={setOpen} open={open}>
        <DevelopmentFilter data={filtersData} open={open} />
      </FilterModal>
    </div>
  ) : null;
};

export default Filters;
