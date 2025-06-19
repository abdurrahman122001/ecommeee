import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Multivendor from "../../../Shared/Multivendor";
import languageModel from "../../../../../utils/languageModel";
import React from "react";
// import FontAwesomeCom from "../../../Helpers/icons/FontAwesomeCom";
import Image from "next/image";

export default function Navbar({ className }) {
  const { websiteSetup } = useSelector((state) => state.websiteSetup);
  const categoryList = websiteSetup && websiteSetup.payload.productCategories;
  const mageMenuList = websiteSetup && websiteSetup.payload.megaMenuCategories;
  const megaMenuBanner = websiteSetup && websiteSetup.payload.megaMenuBanner;
  const customPages = websiteSetup && websiteSetup.payload.customPages;
  const [categoryToggle, setToggle] = useState(false);
  const [subCatHeight, setHeight] = useState(null);
  const handler = () => {
    setToggle(!categoryToggle);
  };

  useEffect(() => {
    let categorySelector = document.querySelector(".category-dropdown");
    setHeight(categorySelector.offsetHeight);
  }, [categoryToggle]);
  const [langCntnt, setLangCntnt] = useState(null);
  useEffect(() => {
    setLangCntnt(languageModel());
  }, []);
  return (
    <div
      className={`nav-widget-wrapper w-full  h-[70px] relative z-30  ${
        className || ""
      }`}
    >
      <div className="container-x mx-auto h-full">
        <div className="w-full h-full relative">
          <div className="w-full h-full flex justify-between items-center">
            <div className="category-and-nav flex xl:space-x-7 space-x-3 items-center">
              <div className="category rounded-t-md relative">
                <button
                  onClick={handler}
                  type="button"
                  className="w-full h-full flex justify-between items-center"
                >
                  <div className="flex space-x-3 items-center">
                    <span className="text-white flex justify-center items-center w-[48px] h-[48px] bg-qpurple shadow-2xl rounded-full">
                      <svg
                        width="14"
                        height="9"
                        viewBox="0 0 14 9"
                        fill="none"
                        className="fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="14" height="1" />
                        <rect y="8" width="14" height="1" />
                        <rect y="4" width="10" height="1" />
                      </svg>
                    </span>
                    <span className="text-sm font-600 text-white">
                      {langCntnt && langCntnt.All_Categories}
                    </span>
                  </div>
                </button>
                {categoryToggle && (
                  <>
                    <div
                      className="fixed top-0 left-0 w-full h-full -z-10"
                      onClick={handler}
                    ></div>
                  </>
                )}
                <div
                  style={{
                    boxShadow: " 0px 15px 50px 0px rgba(0, 0, 0, 0.14)",
                  }}
                  className={`category-dropdown  w-[270px] absolute left-0 top-[60px]  ${
                    categoryToggle ? "block" : "hidden"
                  }`}
                >
                  <ul className="categories-list relative">
                    {categoryList &&
                      categoryList.map((item) => (
                        <li
                          key={item.id}
                          className="category-item transition-all duration-300 ease-in-out"
                        >
                          <Link
                            href={{
                              pathname: "/products",
                              query: { category: item.slug },
                            }}
                            passHref
                          >
                            <a rel="noopener noreferrer">
                              <div className=" flex justify-between items-center px-5 h-10 cursor-pointer">
                                <div className="flex items-center space-x-6">
                                  <span className="icon">
                                    {/*<FontAwesomeCom*/}
                                    {/*  className="w-4 h-4"*/}
                                    {/*  icon={item.icon}*/}
                                    {/*/>*/}
                                    <Image
                                      width="20px"
                                      height="20px"
                                      objectFit="scale-down"
                                      src={
                                        process.env.NEXT_PUBLIC_BASE_URL +
                                        item.image
                                      }
                                      alt=""
                                    />
                                  </span>
                                  <span className="name text-sm font-400">
                                    {item.name}
                                  </span>
                                </div>
                                <div>
                                  <span className="icon-arrow">
                                    <svg
                                      width="6"
                                      height="9"
                                      viewBox="0 0 6 9"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="fill-current"
                                    >
                                      <rect
                                        x="1.49805"
                                        y="0.818359"
                                        width="5.78538"
                                        height="1.28564"
                                        transform="rotate(45 1.49805 0.818359)"
                                      />
                                      <rect
                                        x="5.58984"
                                        y="4.90918"
                                        width="5.78538"
                                        height="1.28564"
                                        transform="rotate(135 5.58984 4.90918)"
                                      />
                                    </svg>
                                  </span>
                                </div>
                              </div>
                            </a>
                          </Link>
                          <div
                            className={`sub-category-lvl-two absolute left-[270px] top-0 z-10 w-[270px] ${
                              item.active_sub_categories.length > 0
                                ? "bg-white"
                                : ""
                            }`}
                            style={{ height: `${subCatHeight}px` }}
                          >
                            <ul className="">
                              {item.active_sub_categories.length > 0 &&
                                item.active_sub_categories.map((subItem) => (
                                  <li
                                    key={subItem.id}
                                    className="category-item"
                                  >
                                    <Link
                                      href={{
                                        pathname: "/products",
                                        query: { sub_category: subItem.slug },
                                      }}
                                      passHref
                                    >
                                      <a rel="noopener noreferrer">
                                        <div className=" flex justify-between items-center px-5 h-10 transition-all duration-300 ease-in-out cursor-pointer">
                                          <div>
                                            <span className="text-sm font-400">
                                              {subItem.name}
                                            </span>
                                          </div>
                                          <div>
                                            <span>
                                              <svg
                                                width="6"
                                                height="9"
                                                viewBox="0 0 6 9"
                                                fill="none"
                                                className="fill-current"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <rect
                                                  x="1.49805"
                                                  y="0.818359"
                                                  width="5.78538"
                                                  height="1.28564"
                                                  transform="rotate(45 1.49805 0.818359)"
                                                />
                                                <rect
                                                  x="5.58984"
                                                  y="4.90918"
                                                  width="5.78538"
                                                  height="1.28564"
                                                  transform="rotate(135 5.58984 4.90918)"
                                                />
                                              </svg>
                                            </span>
                                          </div>
                                        </div>
                                      </a>
                                    </Link>
                                    <div
                                      className={`sub-category-lvl-three absolute left-[270px] top-0 z-10 w-[270px] ${
                                        subItem.active_child_categories.length >
                                        0
                                          ? "bg-white"
                                          : ""
                                      }`}
                                      style={{ height: `${subCatHeight}px` }}
                                    >
                                      <ul className="">
                                        {subItem.active_child_categories
                                          .length > 0 &&
                                          subItem.active_child_categories.map(
                                            (subsubitem) => (
                                              <li
                                                key={subsubitem.id}
                                                className="category-item"
                                              >
                                                <Link
                                                  href={{
                                                    pathname: "/products",
                                                    query: {
                                                      child_category:
                                                        subsubitem.slug,
                                                    },
                                                  }}
                                                  passHref
                                                >
                                                  <a rel="noopener noreferrer">
                                                    <div className=" flex justify-between items-center px-5 h-10 transition-all duration-300 ease-in-out cursor-pointer">
                                                      <div>
                                                        <span className="text-sm font-400">
                                                          {subsubitem.name}
                                                        </span>
                                                      </div>
                                                    </div>
                                                  </a>
                                                </Link>
                                              </li>
                                            )
                                          )}
                                      </ul>
                                    </div>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="nav">
              <ul className="nav-wrapper flex xl:space-x-10 space-x-5">
                <li>
                  <span className="flex items-center text-sm font-600 cursor-pointer ">
                    <span>{langCntnt && langCntnt.Shop}</span>
                    <span className="ml-1.5 ">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.37789 5.89467C1.88334 5.89467 1.3884 5.90326 0.893852 5.89193C0.443053 5.88178 0.107884 5.59427 0.0176461 5.17003C-0.0643884 4.78486 0.137573 4.3618 0.508681 4.20281C0.659077 4.13835 0.835647 4.10983 1.0005 4.10827C1.93764 4.09968 2.87518 4.10436 3.81233 4.10397C4.07054 4.10397 4.10335 4.07038 4.10374 3.80865C4.10452 2.85822 4.10179 1.90818 4.10491 0.957757C4.10648 0.512817 4.33578 0.176867 4.71197 0.0499086C5.30731 -0.151271 5.88545 0.278043 5.89366 0.937443C5.90147 1.56208 5.89561 2.1871 5.89561 2.81213C5.89561 3.14417 5.89483 3.47621 5.896 3.80787C5.89678 4.06999 5.9292 4.10397 6.18664 4.10397C7.13706 4.10475 8.0871 4.10241 9.03753 4.10514C9.48481 4.10632 9.8192 4.33211 9.9485 4.70751C10.1532 5.30168 9.72584 5.88412 9.06761 5.89389C8.50782 5.90209 7.94803 5.89584 7.38825 5.89584C6.97807 5.89584 6.56829 5.89467 6.15812 5.89662C5.93897 5.89779 5.89678 5.93998 5.89639 6.16226C5.89522 7.11893 5.89756 8.076 5.89522 9.03268C5.89405 9.48192 5.67216 9.81552 5.29715 9.94717C4.70416 10.155 4.1182 9.72958 4.10648 9.07292C4.09749 8.57837 4.10452 8.08343 4.10452 7.58888C4.10452 7.12011 4.10531 6.65173 4.10413 6.18296C4.10374 5.93373 4.06819 5.89701 3.82365 5.89662C3.34199 5.89545 2.86034 5.89623 2.37868 5.89623C2.37789 5.89506 2.37789 5.89506 2.37789 5.89467Z"
                          fill="white"
                        />
                      </svg>
                    </span>
                  </span>
                  <div className="sub-menu w-full absolute left-0 top-[70px]">
                    <div
                      className="mega-menu-wrapper w-full bg-white rounded p-[30px] flex justify-between items-center "
                      style={{
                        minHeight: "295px",
                        boxShadow: "0px 15px 50px 0px rgba(0, 0, 0, 0.14)",
                      }}
                    >
                      <div className="categories-wrapper flex-1 h-full flex justify-around -ml-[70px]">
                        {mageMenuList &&
                          mageMenuList.slice(0, 3).map((megaItem) => (
                            <div key={megaItem.id}>
                              <div className="category">
                                <Link
                                  href={{
                                    pathname: "/products",
                                    query: {
                                      category: megaItem.category.slug,
                                    },
                                  }}
                                >
                                  <h1 className="text-sm font-700 text-qblack uppercase mb-[13px] cursor-pointer">
                                    {megaItem.category.name}
                                  </h1>
                                </Link>
                              </div>
                              <div className="category-items">
                                <ul className="flex flex-col space-y-3">
                                  {megaItem.sub_categories.length > 0 &&
                                    megaItem.sub_categories.map((subItem) => (
                                      <li key={subItem.id}>
                                        <Link
                                          href={{
                                            pathname: "/products",
                                            query: {
                                              sub_category:
                                                subItem.sub_category &&
                                                subItem.sub_category.slug,
                                            },
                                          }}
                                          passHref
                                        >
                                          <a rel="noopener noreferrer">
                                            <span className="text-qgray text-sm font-400 border-b border-transparent hover:border-qpurple hover:text-qpurple cursor-pointer cursor-pointer">
                                              {subItem.sub_category &&
                                                subItem.sub_category.name}
                                            </span>
                                          </a>
                                        </Link>
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                      </div>
                      {megaMenuBanner && parseInt(megaMenuBanner.status)===1&& (
                        <div
                          style={{
                            backgroundImage: `url(${
                              process.env.NEXT_PUBLIC_BASE_URL +
                              megaMenuBanner.image
                            })`,
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                          }}
                          className="thumbnil w-[348px] h-[235px] relative flex items-center pl-[40px] group rounded"
                        >
                          <div className="flex flex-col justify-between">
                            <div>
                              <div className=" mb-[10px]">
                                <span className="text-qblack uppercase text-xs font-semibold">
                                  {megaMenuBanner.title_one}
                                </span>
                              </div>
                              <div className="mb-[30px]">
                                <h1 className="w-[160px] text-[24px] leading-[32px] text-qblack font-semibold">
                                  {megaMenuBanner.title_two}
                                </h1>
                              </div>
                            </div>
                            <div className="w-[90px]">
                              <Link
                                href={{
                                  pathname: "/products",
                                  query: {
                                    category: megaMenuBanner.product_slug,
                                  },
                                }}
                                passHref
                              >
                                <a rel="noopener noreferrer">
                                  <div className="cursor-pointer w-full relative">
                                    <div className="inline-flex  space-x-1.5 items-center relative z-20">
                                      <span className="text-sm text-qblack font-medium leading-[30px]">
                                        {langCntnt && langCntnt.Shop_Now}
                                      </span>
                                      <span className="leading-[30px]">
                                        <svg
                                          width="7"
                                          height="11"
                                          viewBox="0 0 7 11"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <rect
                                            x="2.08984"
                                            y="0.636719"
                                            width="6.94219"
                                            height="1.54271"
                                            transform="rotate(45 2.08984 0.636719)"
                                            fill="#1D1D1D"
                                          />
                                          <rect
                                            x="7"
                                            y="5.54492"
                                            width="6.94219"
                                            height="1.54271"
                                            transform="rotate(135 7 5.54492)"
                                            fill="#1D1D1D"
                                          />
                                        </svg>
                                      </span>
                                    </div>
                                    <div className="w-[82px] transition-all duration-300 ease-in-out group-hover:h-4 h-[0px] bg-qyellow absolute left-0 bottom-0 z-10"></div>
                                  </div>
                                </a>
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </li>

                <li>
                  <Link href="/sellers" passHref>
                    <a rel="noopener noreferrer">
                      <span className="flex items-center text-sm font-600 cursor-pointer ">
                        <span>{langCntnt && langCntnt.Sellers}</span>
                      </span>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/blogs" passHref>
                    <a rel="noopener noreferrer">
                      <span className="flex items-center text-sm font-600 cursor-pointer capitalize">
                        <span>{langCntnt && langCntnt.blogs}</span>
                      </span>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/about" passHref>
                    <a rel="noopener noreferrer">
                      <span className="flex items-center text-sm font-600 cursor-pointer ">
                        <span>{langCntnt && langCntnt.About}</span>
                      </span>
                    </a>
                  </Link>
                </li>
                <li className="relative">
                  <span className="flex items-center text-sm font-600 cursor-pointer ">
                    <span>{langCntnt && langCntnt.Pages}</span>
                    <span className="ml-1.5 ">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.37789 5.89467C1.88334 5.89467 1.3884 5.90326 0.893852 5.89193C0.443053 5.88178 0.107884 5.59427 0.0176461 5.17003C-0.0643884 4.78486 0.137573 4.3618 0.508681 4.20281C0.659077 4.13835 0.835647 4.10983 1.0005 4.10827C1.93764 4.09968 2.87518 4.10436 3.81233 4.10397C4.07054 4.10397 4.10335 4.07038 4.10374 3.80865C4.10452 2.85822 4.10179 1.90818 4.10491 0.957757C4.10648 0.512817 4.33578 0.176867 4.71197 0.0499086C5.30731 -0.151271 5.88545 0.278043 5.89366 0.937443C5.90147 1.56208 5.89561 2.1871 5.89561 2.81213C5.89561 3.14417 5.89483 3.47621 5.896 3.80787C5.89678 4.06999 5.9292 4.10397 6.18664 4.10397C7.13706 4.10475 8.0871 4.10241 9.03753 4.10514C9.48481 4.10632 9.8192 4.33211 9.9485 4.70751C10.1532 5.30168 9.72584 5.88412 9.06761 5.89389C8.50782 5.90209 7.94803 5.89584 7.38825 5.89584C6.97807 5.89584 6.56829 5.89467 6.15812 5.89662C5.93897 5.89779 5.89678 5.93998 5.89639 6.16226C5.89522 7.11893 5.89756 8.076 5.89522 9.03268C5.89405 9.48192 5.67216 9.81552 5.29715 9.94717C4.70416 10.155 4.1182 9.72958 4.10648 9.07292C4.09749 8.57837 4.10452 8.08343 4.10452 7.58888C4.10452 7.12011 4.10531 6.65173 4.10413 6.18296C4.10374 5.93373 4.06819 5.89701 3.82365 5.89662C3.34199 5.89545 2.86034 5.89623 2.37868 5.89623C2.37789 5.89506 2.37789 5.89506 2.37789 5.89467Z"
                          fill="white"
                        />
                      </svg>
                    </span>
                  </span>
                  <div className="sub-menu w-[280px] absolute left-0 top-[70px]">
                    <div
                      className="w-full bg-white rounded flex justify-between items-center "
                      style={{
                        boxShadow: "0px 15px 50px 0px rgba(0, 0, 0, 0.14)",
                      }}
                    >
                      <div className="categories-wrapper w-full h-full p-5">
                        <div>
                          <div className="category-items">
                            <ul className="flex flex-col space-y-3">
                              <li>
                                <Link href="/faq" passHref>
                                  <a rel="noopener noreferrer">
                                    <span className="text-qgray text-sm font-400 border-b border-transparent hover:border-qpurple hover:text-qpurple cursor-pointer">
                                      {langCntnt && langCntnt.FAQ}
                                    </span>
                                  </a>
                                </Link>
                              </li>
                              <li>
                                <Link href="/privacy-policy" passHref>
                                  <a rel="noopener noreferrer">
                                    <span className="text-qgray text-sm font-400 border-b border-transparent hover:border-qpurple hover:text-qpurple cursor-pointer">
                                      {langCntnt && langCntnt.Privacy_Policy}
                                    </span>
                                  </a>
                                </Link>
                              </li>
                              <li>
                                <Link href="/terms-condition" passHref>
                                  <a rel="noopener noreferrer">
                                    <span className="text-qgray text-sm font-400 border-b border-transparent hover:border-qpurple hover:text-qpurple cursor-pointer">
                                      {langCntnt &&
                                        langCntnt.Term_and_Conditions}
                                    </span>
                                  </a>
                                </Link>
                              </li>
                              {Multivendor() === 1 && (
                                <li>
                                  <Link href="seller-terms-condition" passHref>
                                    <a rel="noopener noreferrer">
                                      <span className="text-qgray text-sm font-400 border-b border-transparent hover:border-qpurple hover:text-qpurple cursor-pointer">
                                        {langCntnt &&
                                          langCntnt.Seller_terms_and_conditions}
                                      </span>
                                    </a>
                                  </Link>
                                </li>
                              )}

                              {customPages &&
                                customPages.length > 0 &&
                                customPages.map((item, i) => (
                                  // eslint-disable-next-line react/jsx-key
                                  <React.Fragment key={i}>
                                    <li>
                                      <Link
                                        href={`/pages?custom=${item.slug}`}
                                        passHref
                                      >
                                        <a rel="noopener noreferrer">
                                          <span className="text-qgray text-sm font-400 border-b border-transparent hover:border-qpurple hover:text-qpurple cursor-pointer">
                                            {item.page_name}
                                          </span>
                                        </a>
                                      </Link>
                                    </li>
                                  </React.Fragment>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
