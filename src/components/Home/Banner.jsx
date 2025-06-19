import Link from "next/link";
import SimpleSlider from "../Helpers/SliderCom";
import ShopNowBtn from "../Helpers/Buttons/ShopNowBtn";
import { useRef } from "react";
import bg from "../../../public/images/red.webp";

export default function Banner({ className = "", sliders = [] }) {
  const sliderRef = useRef(null);

  const settings = {
    infinite: true,
    autoplay: true,
    fade: true,
    arrows: false,
    dots: true,
    responsive: [
      {
        breakpoint: 1025,
        settings: { dots: true },
      },
    ],
  };

  return (
    <div
      className={`w-full relative 
        h-[220px] xs:h-[300px] sm:h-[420px] md:h-[520px] lg:h-[620px] xl:h-[733px] 
        ${className}`}
    >
      <div className="w-full h-full">
        <SimpleSlider settings={settings} selector={sliderRef}>
          {sliders.length > 0 &&
            sliders.map((item, i) => (
              <div key={i} className="w-full h-full">
                <div
                  className="w-full h-full min-h-full bg-center bg-no-repeat bg-cover flex items-center justify-center"
                  style={{
                    backgroundImage: `url(${bg.src})`,
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="md:w-[400px] w-[90%] flex items-center justify-center mt-28 md:mt-0">
                      <Link
                        href={{
                          pathname: "/single-product",
                          query: { slug: item.product_slug },
                        }}
                        passHref
                      >
                        <ShopNowBtn
                          className="md:w-[160px] w-[145px] h-[52px] bg-qpurple"
                          textColor="text-white group-hover:text-white"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </SimpleSlider>
      </div>
    </div>
  );
}

