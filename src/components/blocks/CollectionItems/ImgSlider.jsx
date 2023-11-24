import { useEffect, useRef, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'

export const ImgSlider = ({ item }) => {
  const [index, setIndex] = useState(-1)
  const [defaultPosition, setDefaultPosition] = useState({})
  const [selectImgs, setSelectImgs] = useState(null)
  const ref = useRef()

  const settings = {
    dots: true,
    dotsClass: 'slick-dots slick-thumb',
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  useEffect(() => {
    ref?.current && ref.current.slickGoTo(0)
  }, [item])

  const prepareImgArr = item?.attributes?.image.map((item, i) => ({
    src: item.link,
    index: i,
  }))

  return (
    <>
      <div className="px-5">
        <Slider
          ref={ref}
          className="mt-3 flex"
          {...settings}
        >
          {item?.attributes?.image?.map((item, i) => (
            <button
              className="w-full bg-slate-100 rounded-xl max-w-sm max-h-96"
              key={item.id}
              onMouseDown={(e) => setDefaultPosition({ x: e.screenX, y: e.screenY })}
              onClick={(e) => {
                if (e.screenX === defaultPosition.x && e.screenY === defaultPosition.y) {
                  setIndex(i)
                  setSelectImgs(prepareImgArr)
                }
              }}
            >
              <img crossOrigin="anonymous" className="h-full w-full object-contain" src={item?.link} />
            </button>
          ))}
        </Slider>
      </div>
      <Lightbox
        slides={selectImgs}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        plugins={[Fullscreen, Zoom]}
        controller={{ closeOnBackdropClick: true }}
        zoom={{ scrollToZoom: true, maxZoomPixelRatio: 2 }}
      />
    </>
  )
}
