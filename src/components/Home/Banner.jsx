import Link from "next/link";
import SimpleSlider from "../Helpers/SliderCom";
import ShopNowBtn from "../Helpers/Buttons/ShopNowBtn";
import { useRef } from "react";

export default function Banner({ className, sliders = [] }) {
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
    <>
      {/* Banner height is now compact */}
      <div className={`w-full mx-auto max-w-7xl relative ${className || ""}`}>
        <div className="main-wrapper w-full h-full">
          {/* slider area */}
          <div className="hero-slider-wrapper xl:h-full mb-10 xl:mb-0 w-full relative">
            <SimpleSlider settings={settings} selector={sliderRef}>
              {sliders.length > 0 &&
                sliders.map((item, i) => (
                  <div key={i} className="item w-full xl:h-[350px] md:h-[250px] sm:h-[200px] h-[140px]">
                    <div
                      className="w-full h-full relative md:bg-center"
                      style={{
                        backgroundImage: `url(${
                          process.env.NEXT_PUBLIC_BASE_URL + item.image
                        })`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                      }}
                    >
                      {/* Add left padding here */}
                      <div className="container-x mx-auto flex items-center h-full pl-0 md:pl-16">
                        <div className="w-full h-full xl:flex items-center pt-10 xl:pt-0">
                          <div className="md:w-[400px] w-full">
                            <p className="md:text-[20px] text-[13px] text-white font-medium text-qpurple mb-1">
                              {item.title_one}
                            </p>
                            <h1 className="md:text-[32px] text-white text-[18px] font-bold text-qblack md:leading-[38px] leading-[22px] mb-5">
                              {item.title_two}
                            </h1>
                            <Link
                              href={{
                                pathname: "/single-product",
                                query: { slug: item.product_slug },
                              }}
                              passHref
                            >
                              <a rel="noopener noreferrer">
                                <ShopNowBtn
                                  className="md:w-[120px] w-[110px] h-[40px] bg-qpurple"
                                  textColor="text-white group-hover:text-white"
                                />
                              </a>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </SimpleSlider>
          </div>
        </div>
      </div>
    </>
  );
}
