import React from "react";
import Image from "next/image";
import Link from "next/link";

function CategorySection({ sectionTitle, categories }) {
  const visibleCategories = categories.slice(0, 4);

  return (
    <div className="w-full py-10 bg-white">
      <div className="mx-auto max-w-7xl px-2 sm:px-4">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-8 sm:mb-10">
          {sectionTitle}
        </h2>

        {/* ✅ Mobile & Tablet: 2-column grid | ✅ Desktop: 4 in row */}
        <div className="grid grid-cols-2 sm:flex sm:flex-row justify-center gap-4 sm:gap-8">
          {visibleCategories.map((item, idx) => (
            <Link
              key={idx}
              href={{
                pathname: "/products",
                query: { category: item.slug },
              }}
              passHref
            >
              <a className="w-full sm:w-[260px] rounded-2xl shadow-md overflow-hidden relative group transition-transform duration-300 hover:scale-105">
                <div className="relative w-full h-[200px] sm:h-[400px]">
                  <Image
                    src={
                      item.image.startsWith("http")
                        ? item.image
                        : process.env.NEXT_PUBLIC_BASE_URL + item.image
                    }
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-105"
                    priority={idx === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                  <span className="absolute bottom-4 left-0 w-full text-center text-white text-sm sm:text-xl font-semibold z-20">
                    {item.name}
                  </span>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategorySection;
