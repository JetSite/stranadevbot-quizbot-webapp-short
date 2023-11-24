// import { LazyLoadImage } from 'react-lazy-load-image-component';
import "react-lazy-load-image-component/src/effects/blur.css";
// import Placeholder from '../../../../../assets/images/blur.png'

const Item = ({ item, navigate, isFetching }) => {
  return (
    <div
      onClick={() => {
        !isFetching &&
          navigate("/collectionItem", { state: { idItem: item.id } });
      }}
      className="p-5 w-full bg-itemBg border border-borderItem"
    >
      <div className="mb-2 flex justify-center">
        {/* <LazyLoadImage
        alt={"photo"}
        effect="blur"
        placeholderSrc={Placeholder}
        className='object-contain min-h-32'
        src={item?.attributes?.Photos[0]?.FullUrl || ""}
      /> */}
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
              {item?.attributes?.property_type} {item?.attributes?.area?.value}
              м²
            </p>
          ) : (
            item?.attributes?.property_type
          )}
        </p>
        <div className="mb-1 border-t border-borderItem" />
        <p className="text-[10px]">
          {item?.attributes?.price?.value.toLocaleString("ru") || 0} ₽
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
      {/* <div className='mb-2 flex justify-between items-start'>
      <div className='w-2/4 mr-1 text-left'><p className='text-defaultButtonText text-[8px]'>Жилой комплекс</p><p className='text-textRed text-[8px]'>{item?.attributes?.development?.data?.attributes?.name || ""}</p></div>
      <div className='w-2/4 text-right'><p className='text-defaultButtonText text-[8px]'>Этаж</p><p className='text-[8px]'>{item?.attributes?.floor && item?.attributes?.floor + ' из ' + item?.attributes?.house?.floorsTotal || ""}</p></div>
    </div> */}
      {/* <div className='mb-2 flex justify-between items-start'>
      <div className='w-2/4 mr-1 text-left'><p className='text-defaultButtonText text-[8px]'>Дом</p><p className='text-[8px]'>{item?.attributes?.house?.name || ""}</p></div>
      <div className='w-2/4 text-right'><p className='text-defaultButtonText text-[8px]'>Номер квартиры</p><p className='text-[8px]'>{item?.attributes?.number || 0}</p></div>
    </div> */}
      {/* <div className='flex justify-between items-start'>
      <div className='w-2/4 mr-1 text-left'><p className='text-defaultButtonText text-[8px]'>Город</p><p className='text-[8px]'>{item?.attributes?.city?.data?.attributes?.CityName || ""}</p></div>
      <div className='w-2/4 text-right'><p className='text-defaultButtonText text-[8px]'>Адрес</p><p className='text-[8px]'>{item?.attributes?.development?.data?.attributes?.address || ""}</p></div>
    </div> */}
    </div>
  );
};

export default Item;
