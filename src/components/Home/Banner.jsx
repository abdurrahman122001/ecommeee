import SimpleSlider from "../Helpers/SliderCom";
import { useRef } from "react";

export default function Banner({ className = "" }) {
  const sliderRef = useRef(null);

  // Define the images array INSIDE the component
  const sliders = [
    { image: "/bg.jpg" },
    { image: "/red.webp" },
    // Add more images here as needed
  ];

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

  // Slightly smaller heights for the banner
  const heightClasses = `
    h-[150px] xs:h-[220px] sm:h-[300px] md:h-[400px] lg:h-[480px] xl:h-[540px]
  `;

  return (
    <div className={`w-full mx-auto max-w-7xl relative ${heightClasses} ${className}`}>
      <div className="w-full h-full">
        <SimpleSlider settings={settings} selector={sliderRef}>
          {sliders.map((item, i) => (
            <div key={i} className="w-full h-full">
              <div
                className="w-full h-full min-h-full bg-center bg-no-repeat flex items-center justify-center"
                style={{
                  backgroundImage: `url(/images/${item.image})`,
                  backgroundPosition: 'top',
                  backgroundSize: 'cover'
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className="md:w-[400px] w-[90%] flex items-center justify-center mt-14 md:mt-0">
                    {/* Add overlay content here if needed */}
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
