import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import ProductCardStyleOne from "../Helpers/Cards/ProductCardStyleOne";
import DataIteration from "../Helpers/DataIteration";
import Star from "../Helpers/icons/Star";
import Layout from "../Partials/Layout";
import ProductsFilter from "./ProductsFilter";
import OneColumnAdsTwo from "../Home/ProductAds/OneColumnAdsTwo";
import ProductCardRowStyleOne from "../Helpers/Cards/ProductCardRowStyleOne";
import languageModel from "../../../utils/languageModel";
import LoaderStyleOne from "../Helpers/Loaders/LoaderStyleOne";
import { useRouter } from "next/router";
import image from "../../../public/images/banner.jpg"
export default function AllProductPage({ response, sellerInfo }) {
  const router = useRouter();
  const [categoryExistInRoute, setCategoryExistInRoute] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  useEffect(() => {
    if (response.data && response.data.products.data.length === 0) {
      if (router.query.search && router.query.category) {
        setCategoryExistInRoute(true);
      }
    }
  }, [response]);
  useEffect(() => {
    if (categoryExistInRoute) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/product?category=${router.query.category}`
        )
        .then((res) => {
          if (res && res.status === 200) {
            if (res.data && res.data.products.data.length > 0) {
              const getProducts = res.data.products.data.map((item) => {
                return {
                  id: item.id,
                  title: item.name,
                  slug: item.slug,
                  image: process.env.NEXT_PUBLIC_BASE_URL + item.thumb_image,
                  price: item.price,
                  offer_price: item.offer_price,
                  campaingn_product: null,
                  review: parseInt(item.averageRating),
                  variants: item.active_variants ? item.active_variants : [],
                };
              });
              setRelatedProducts(getProducts);
            } else {
              setRelatedProducts([]);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [categoryExistInRoute]);

  const [resProducts, setProducts] = useState(null);
  const [nxtPage, setNxtPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [variantsFilter, setVariantsFilter] = useState(null);
  const [categoriesFilter, setCategoriesFilter] = useState(null);
  const [brands, setBrands] = useState(null);
  const [cardViewStyle, setCardViewStyle] = useState("col");

  const products =
    resProducts &&
    resProducts.length > 0 &&
    resProducts.map((item) => {
      return {
        id: item.id,
        title: item.name,
        slug: item.slug,
        image: process.env.NEXT_PUBLIC_BASE_URL + item.thumb_image,
        price: item.price,
        offer_price: item.offer_price,
        campaingn_product: null,
        review: parseInt(item.averageRating),
        variants: item.active_variants ? item.active_variants : [],
      };
    });

  const [selectedVarientFilterItem, setSelectedVarientFilterItem] = useState(
    []
  );
  const [selectedCategoryFilterItem, setSelectedCategoryFilterItem] = useState(
    []
  );
  const [selectedBrandsFilterItem, setSelectedBrandsFilterItem] = useState([]);
  // const [volume, setVolume] = useState({ min: 0, max: 0 });
  const [volume, setVolume] = useState([0, 0]);
  const volumeHandler = (value) => {
    setVolume(value);
  };
  const varientHandler = (e) => {
    const { name } = e.target;
    const filterVariant =
      variantsFilter &&
      variantsFilter.length > 0 &&
      variantsFilter.map((varient) => {
        return {
          ...varient,
          active_variant_items:
            varient.active_variant_items &&
            varient.active_variant_items.length > 0 &&
            varient.active_variant_items.map((variant_item) => {
              if (variant_item.name === name) {
                return {
                  ...variant_item,
                  selected: !variant_item.selected,
                };
              } else {
                return {
                  ...variant_item,
                };
              }
            }),
        };
      });
    setVariantsFilter(filterVariant);
    if (selectedVarientFilterItem.includes(name)) {
      const newArr = selectedVarientFilterItem.filter((like) => like !== name);
      setSelectedVarientFilterItem(newArr);
    } else {
      setSelectedVarientFilterItem((p) => [...p, name]);
    }
  };
// Handler
const categoryHandler = (e) => {
  const { name } = e.target; // name = category id
  const catObj = categoriesFilter.find((cat) => cat.id.toString() === name);

  // Toggle in filter UI
  setCategoriesFilter(categoriesFilter.map((cat) =>
    cat.id.toString() === name ? { ...cat, selected: !cat.selected } : cat
  ));

  // Toggle in selected state
  if (selectedCategoryFilterItem.some((cat) => cat.id === name)) {
    setSelectedCategoryFilterItem(selectedCategoryFilterItem.filter((cat) => cat.id !== name));
  } else {
    setSelectedCategoryFilterItem([...selectedCategoryFilterItem, { id: name, slug: catObj.slug }]);
  }
};

// Filter useEffect (inside AllProductPage)
useEffect(() => {
  if (response.data) {
    const min = Math.min(...response.data.products.data.map((item) => parseInt(item.price)));
    const max = Math.max(...response.data.products.data.map((item) => parseInt(item.price)));
    const check =
      selectedVarientFilterItem.length > 0 ||
      selectedCategoryFilterItem.length > 0 ||
      selectedBrandsFilterItem.length > 0 ||
      (volume[0] && volume[0] !== min) ||
      (volume[1] && volume[1] !== max);

    if (check) {
      const brandsQuery = selectedBrandsFilterItem.length
        ? selectedBrandsFilterItem.map((value) => `brands[]=${value}`)
        : [];
      const brandString = brandsQuery.length ? brandsQuery.map((value) => value + "&").join("") : "";

      const categoryQuery = selectedCategoryFilterItem.length
        ? selectedCategoryFilterItem.map((cat) => `categories[]=${cat.slug}`)
        : [];
      const categoryString = categoryQuery.length ? categoryQuery.map((value) => value + "&").join("") : "";

      const variantQuery = selectedVarientFilterItem.length
        ? selectedVarientFilterItem.map((value) => `variantItems[]=${value}`)
        : [];
      const variantString = variantQuery.length ? variantQuery.map((value) => value + "&").join("") : "";

      axios
        .get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/search-product?${brandString}${categoryString}${variantString}min_price=${volume[0]}&max_price=${volume[1]}${sellerInfo ? `&shop_name=${sellerInfo.seller.slug}` : ""}`
        )
        .then((res) => {
          res.data && res.data.products.data.length > 0
            ? setProducts(res.data.products.data)
            : setProducts([]);
          setNxtPage(res.data && res.data.products.next_page_url);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // fallback: show all products
      if (router.query.category) {
        axios
          .get(
            `${process.env.NEXT_PUBLIC_BASE_URL}api/product?category=${router.query.category}`
          )
          .then((res) => {
            setProducts(res.data.products.data);
            setNxtPage(res.data.products.next_page_url);
          });
      } else {
        setNxtPage(response.data && response.data.products.next_page_url);
        setProducts(response.data.products.data);
      }
    }
  }
}, [
  selectedVarientFilterItem,
  selectedCategoryFilterItem,
  selectedBrandsFilterItem,
  volume,
  response.data,
]);

  const brandsHandler = (e) => {
    const { name } = e.target;
    const filterBrands =
      brands &&
      brands.length > 0 &&
      brands.map((item) => {
        if (parseInt(item.id) === parseInt(name)) {
          return {
            ...item,
            selected: !item.selected,
          };
        } else {
          return {
            ...item,
          };
        }
      });
    setBrands(filterBrands);
    if (selectedBrandsFilterItem.includes(name)) {
      const newArr = selectedBrandsFilterItem.filter((like) => like !== name);
      setSelectedBrandsFilterItem(newArr);
    } else {
      setSelectedBrandsFilterItem((p) => [...p, name]);
    }
  };

  const [filterToggle, setToggle] = useState(false);

  useEffect(() => {
    setProducts(response.data && response.data.products.data);
    setNxtPage(response.data && response.data.products.next_page_url);
    setCategoriesFilter(
      response.data &&
      response.data.categories.length > 0 &&
      response.data.categories.map((item) => {
        return {
          ...item,
          selected: false,
        };
      })
    );
    setVariantsFilter(
      response.data &&
      response.data.activeVariants.length > 0 &&
      response.data.activeVariants.map((varient) => {
        return {
          ...varient,
          active_variant_items:
            varient.active_variant_items &&
            varient.active_variant_items.length > 0 &&
            varient.active_variant_items.map((variant_item) => {
              return {
                ...variant_item,
                selected: false,
              };
            }),
        };
      })
    );
    setBrands(
      response.data &&
      response.data.brands.length > 0 &&
      response.data.brands.map((item) => {
        return {
          ...item,
          selected: false,
        };
      })
    );
    const min = response.data &&
      response.data.products.data &&
      Math.min(
        ...response.data.products.data.map((item) => parseInt(item.price))
      );
    const max = response.data &&
      response.data.products.data &&
      Math.max(
        ...response.data.products.data.map((item) => parseInt(item.price))
      );
    const volumeArr = [min, max];
    setVolume(volumeArr);
  }, [response.data]);
  useEffect(() => {
    if (response.data) {
      const min =
        response.data &&
        Math.min(
          ...response.data.products.data.map((item) => parseInt(item.price))
        );
      const max =
        response.data &&
        Math.max(
          ...response.data.products.data.map((item) => parseInt(item.price))
        );
      const check =
        selectedVarientFilterItem.length > 0 ||
        selectedCategoryFilterItem.length > 0 ||
        selectedBrandsFilterItem.length > 0 ||
        (volume[0] && volume[0] !== min) ||
        (volume[1] && volume[1] !== max);
      if (check) {
        const brandsQuery =
          selectedBrandsFilterItem.length > 0
            ? selectedBrandsFilterItem.map((value) => {
              return `brands[]=${value}`;
            })
            : [];
        const brandString =
          brandsQuery.length > 0
            ? brandsQuery.map((value) => value + "&").join("")
            : "";

        // --- THIS PART IS UPDATED! ---
const categoryQuery =
  selectedCategoryFilterItem.length > 0
    ? selectedCategoryFilterItem.map((cat) => `categories[]=${cat.slug}`)
    : [];
const categoryString =
  categoryQuery.length > 0
    ? categoryQuery.map((value) => value + "&").join("")
    : "";
        const variantQuery =
          selectedVarientFilterItem.length > 0
            ? selectedVarientFilterItem.map((value) => {
              return `variantItems[]=${value}`;
            })
            : [];
        const variantString =
          variantQuery.length > 0
            ? variantQuery.map((value) => value + "&").join("")
            : "";
        axios
          .get(
            `${process.env.NEXT_PUBLIC_BASE_URL}api/search-product?${brandString &&
            brandString
            }${categoryString && categoryString}${variantString &&
            variantString
            }min_price=${volume[0]}&max_price=${volume[1]}${sellerInfo
              ? `&shop_name=${sellerInfo.seller.slug}`
              : ""
            }`
          )
          .then((res) => {
            res.data && res.data.products.data.length > 0
              ? setProducts(res.data.products.data)
              : setProducts(response.data.products.data);
            setNxtPage(res.data && res.data.products.next_page_url);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        if (router.query.category) {
          axios
            .get(
              `${process.env.NEXT_PUBLIC_BASE_URL}api/product?category=${router.query.category}`
            )
            .then((res) => {
              setProducts(res.data.products.data);
              setNxtPage(res.data.products.next_page_url);
            });
        } else {
          setNxtPage(response.data && response.data.products.next_page_url);
          setProducts(response.data.products.data);
        }
      }
    } else {
      return;
    }
  }, [
  selectedVarientFilterItem,
  selectedCategoryFilterItem,   // must be here!
  selectedBrandsFilterItem,
  volume,
  response.data,
  ]);

  const nextPageHandler = async () => {
    setLoading(true);
    if (nxtPage) {
      await axios
        .get(`${nxtPage}`)
        .then((res) => {
          setLoading(false);
          if (res.data && res.data.products.data.length > 0) {
            setProducts((prev) => [...prev, ...res.data.products.data]);
            setNxtPage(res.data.products.next_page_url);
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    } else if (nxtPage === "null") {
      setLoading(false);
      return false;
    } else {
      setLoading(false);
      return false;
    }
  };
  const [langCntnt, setLangCntnt] = useState(null);
  useEffect(() => {
    setLangCntnt(languageModel());
  }, []);
  return (
    <>
      <Layout childrenClasses="pt-0 pb-0">
        <div className="products-page-wrapper w-full bg-white pt-[60px] pb-[114px]">
          <div className="container-x mx-auto">
            {sellerInfo && (
              <div
                data-aos="fade-right"
                className="saller-info w-full mb-[40px] sm:h-[328px]  sm:flex justify-between items-center px-11 overflow-hidden relative py-10 sm:py-0 rounded"
                style={{
                  background: `url(../../../public/images/banner.jpg) no-repeat`,
                  backgroundSize: "cover",
                  backgroundPosition: 'top'
                }}
              >
                <div className="saller-text-details  w-72">
                  <ul>
                    <li className="text-qblack flex space-x-5 items-center leading-9 text-base font-normal">
                      <span>
                        <svg
                          width="16"
                          height="12"
                          viewBox="0 0 16 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.00250844 3.36719C0.156817 3.46656 0.260523 3.53094 0.362354 3.59906C2.3971 4.95656 4.43123 6.31406 6.46598 7.67156C7.55426 8.39781 8.44825 8.39844 9.53591 7.67281C11.5794 6.30969 13.6217 4.94531 15.6652 3.58219C15.7582 3.52031 15.8544 3.46219 15.9856 3.37969C15.9913 3.50031 15.9994 3.58781 15.9994 3.67594C16 5.91656 16.0013 8.15656 15.9994 10.3972C15.9988 11.3853 15.3903 11.9984 14.4038 11.9991C10.135 12.0009 5.86624 12.0009 1.59682 11.9991C0.612871 11.9984 0.00313317 11.3834 0.00250844 10.3959C0.00125898 8.15469 0.00250844 5.91469 0.00250844 3.67406C0.00250844 3.59156 0.00250844 3.50844 0.00250844 3.36719Z"
                            fill="#232532"
                          />
                          <path
                            d="M8.00103 0.00122449C10.1557 0.00122449 12.3104 -0.00252551 14.4651 0.00309949C15.366 0.00559949 16.0345 0.6806 15.9963 1.53997C15.9732 2.05935 15.7058 2.4331 15.2792 2.71622C13.4156 3.95435 11.5564 5.1981 9.6953 6.43998C9.42729 6.61873 9.15928 6.79873 8.89002 6.97685C8.29715 7.3706 7.70428 7.37185 7.11141 6.97623C4.97483 5.54935 2.83637 4.12435 0.699789 2.6956C0.100046 2.29435 -0.126731 1.68935 0.0681849 1.04747C0.256229 0.42685 0.820362 0.00559949 1.50507 0.00372449C3.33741 -0.00252551 5.16912 0.00122449 7.00146 0.00122449C7.33506 0.00122449 7.66805 0.00122449 8.00103 0.00122449Z"
                            fill="#232532"
                          />
                        </svg>
                      </span>
                      <span>{sellerInfo.seller.email}</span>
                    </li>
                    <li className="text-qblack flex space-x-5 items-center leading-9 text-base font-normal">
                      <span>
                        <svg
                          width="15"
                          height="14"
                          viewBox="0 0 15 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.5085 14.0001C10.5529 13.9553 9.6013 13.6377 8.6926 13.1988C6.27351 12.0295 4.30056 10.3639 2.60467 8.39981C1.65664 7.30216 0.854189 6.11977 0.351704 4.78105C0.0963526 4.09939 -0.084448 3.40133 0.0405862 2.66719C0.106332 2.27908 0.266587 1.9347 0.568313 1.65372C1.00388 1.24812 1.43592 0.838683 1.87618 0.437996C2.50077 -0.129964 3.37366 -0.152376 4.00587 0.410664C4.71205 1.03985 5.40649 1.68215 6.07862 2.34304C6.80124 3.05367 6.54589 4.09666 5.5826 4.47384C4.70383 4.81768 4.37452 5.42773 4.72966 6.25151C5.4106 7.8324 6.63746 8.94153 8.32865 9.57454C9.12171 9.87137 9.85842 9.52698 10.1918 8.7923C10.6145 7.86082 11.7292 7.63069 12.5129 8.33093C13.2114 8.9552 13.8936 9.59477 14.5669 10.2425C15.1533 10.8067 15.1416 11.6299 14.5475 12.2077C14.1014 12.6417 13.64 13.0627 13.1792 13.483C12.7383 13.8864 12.1842 13.999 11.5085 14.0001Z"
                            fill="#232532"
                          />
                        </svg>
                      </span>
                      <span>{sellerInfo.seller.phone}</span>
                    </li>
                    <li className="text-qblack flex space-x-5 items-center leading-9 text-base font-normal">
                      <span>
                        <svg
                          width="14"
                          height="19"
                          viewBox="0 0 14 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.97116 2.68819e-05C2.96055 0.0118815 -0.248362 3.57049 0.0150623 7.72998C0.107867 9.19477 0.60259 10.5136 1.45069 11.6909C3.13831 14.0337 4.82379 16.3787 6.5107 18.7214C6.77412 19.0875 7.21745 19.0934 7.47659 18.734C9.17135 16.3816 10.8761 14.0359 12.5566 11.6724C15.2879 7.83075 14.0101 2.65546 9.84454 0.632026C9.03428 0.239342 7.93562 -0.00293677 6.97116 2.68819e-05ZM6.99257 9.29479C5.81395 9.29035 4.85877 8.29975 4.85734 7.08094C4.85592 5.8614 5.80752 4.86931 6.98686 4.86116C8.17762 4.85301 9.14708 5.85769 9.13994 7.09428C9.13351 8.3116 8.16977 9.29924 6.99257 9.29479Z"
                            fill="#232532"
                          />
                        </svg>
                      </span>
                      <span>{sellerInfo.seller.address}</span>
                    </li>
                  </ul>
                </div>

                <div className="saller-name lg:block hidden">
                  <h1 className="text-[60px] font-bold text-qblack">
                    {sellerInfo.seller.shop_name}
                  </h1>

                  <div className="flex justify-center space-x-0.5">
                    {Array.from(
                      Array(parseInt(sellerInfo.seller.averageRating)),
                      () => (
                        <span
                          key={
                            parseInt(sellerInfo.seller.averageRating) +
                            Math.random()
                          }
                        >
                          <Star />
                        </span>
                      )
                    )}
                    {parseInt(sellerInfo.seller.averageRating) < 5 && (
                      <>
                        {Array.from(
                          Array(5 - parseInt(sellerInfo.seller.averageRating)),
                          () => (
                            <span
                              key={
                                parseInt(sellerInfo.seller.averageRating) +
                                Math.random()
                              }
                              className="text-qgray"
                            >
                              <svg
                                width="18"
                                height="17"
                                viewBox="0 0 18 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="fill-current"
                              >
                                <path d="M9 0L11.0206 6.21885H17.5595L12.2694 10.0623L14.2901 16.2812L9 12.4377L3.70993 16.2812L5.73056 10.0623L0.440492 6.21885H6.97937L9 0Z" />
                              </svg>
                            </span>
                          )
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="saller-logo mt-5 sm:mt-5">
                  <div className="flex sm:justify-center justify-start">
                    <div className="w-[170px] h-[170px] flex justify-center items-center rounded-full bg-white relative mb-1 overflow-hidden">
                      <Image
                        layout="fill"
                        objectFit="scale-down"
                        src={`${process.env.NEXT_PUBLIC_BASE_URL +
                          sellerInfo.seller.logo
                          }`}
                        alt="logo"
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex sm:justify-center justify-start">
                    <span className="text-[30px] font-medium text-center text-qblack">
                      {sellerInfo.seller.shop_name}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div
              className="w-full mb-5 flex items-center justify-center"
              style={{
                backgroundImage: "url('/images/banner.jpg')", // Change the path as needed
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "0.75rem", // rounded-xl
                minHeight: "100px",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black opacity-30"></div>

              {/* Breadcrumb Content */}
              <nav
                className="relative z-10 text-sm flex items-center justify-center space-x-2 py-7"
                aria-label="Breadcrumb"
              >
                <Link href="/" passHref>
                  <span className="hover:underline text-white cursor-pointer">Home</span>
                </Link>
                <span className="mx-1 text-white">/</span>
                {selectedCategoryFilterItem && selectedCategoryFilterItem.length > 0 && categoriesFilter ? (
                  categoriesFilter
                    .filter((cat) => selectedCategoryFilterItem.some(item => item.id === cat.id.toString()))
                    .map((cat, idx, arr) => (
                      <span key={cat.id} className="flex items-center">
                        <span className="text-white font-semibold">{cat.name}</span>
                        {idx < arr.length - 1 && <span className="mx-1 text-white">/</span>}
                      </span>
                    ))
                ) : (
                  <span className="text-white">All Products</span>
                )}
                {router.query.search && (
                  <>
                    <span className="mx-1 text-white">/</span>
                    <span className="text-qyellow font-medium">
                      Search: "{router.query.search}"
                    </span>
                  </>
                )}
              </nav>
            </div>

            {/*<BreadcrumbCom />*/}
            <div className="w-full xl:flex xl:space-x-[30px]">
              <div className="xl:w-[270px]">
                <ProductsFilter
                  filterToggle={filterToggle}
                  filterToggleHandler={() => setToggle(!filterToggle)}
                  categories={categoriesFilter}
                  varientHandler={varientHandler}
                  categoryHandler={categoryHandler}
                  brandsHandler={brandsHandler}
                  volume={volume}
                  priceMax={
                    response.data &&
                    Math.max(
                      ...response.data.products.data.map((item) =>
                        parseInt(item.price)
                      )
                    )
                  }
                  priceMin={
                    response.data &&
                    Math.min(
                      ...response.data.products.data.map((item) =>
                        parseInt(item.price)
                      )
                    )
                  } 
                  volumeHandler={(value) => volumeHandler(value)}
                  className="mb-[30px]"
                  variantsFilter={variantsFilter}
                  selectedCategoryFilterItem={selectedCategoryFilterItem}
                />

                {response.data && response.data.shopPageSidebarBanner && parseInt(response.data.shopPageSidebarBanner.status) === 1 && (
                  <div
                    style={{
                      backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_URL +
                        response.data.shopPageSidebarBanner.image
                        })`,
                      backgroundSize: `cover`,
                      backgroundRepeat: `no-repeat`,
                    }}
                    className="w-full hidden py-[35px] pl-[40px] group xl:block h-[295px] relative rounded"
                  >
                    <div className="flex flex-col justify-between w-full h-full">
                      <div>
                        <div className="mb-[10px]">
                          <span className="text-qblack uppercase text-xs font-semibold">
                            {response.data.shopPageSidebarBanner.title_one}
                          </span>
                        </div>
                        <div className="mb-[30px]">
                          <h1 className="w-[162px] text-[24px] leading-[30px] text-qblack font-semibold">
                            {response.data.shopPageSidebarBanner.title_two}
                          </h1>
                        </div>
                      </div>
                      <div className="w-[90px]">
                        <Link
                          href={{
                            pathname: "/products",
                            query: {
                              category:
                                response.data.shopPageSidebarBanner
                                  .product_slug,
                            },
                          }}
                          passHref
                        >
                          <a rel="noopener noreferrer">
                            <div className="cursor-pointer w-full relative  ">
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
                                    className={`fill-current`}
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <rect
                                      x="2.08984"
                                      y="0.636719"
                                      width="6.94219"
                                      height="1.54271"
                                      transform="rotate(45 2.08984 0.636719)"
                                    />
                                    <rect
                                      x="7"
                                      y="5.54492"
                                      width="6.94219"
                                      height="1.54271"
                                      transform="rotate(135 7 5.54492)"
                                    />
                                  </svg>
                                </span>
                              </div>
                              <div className="w-[82px] transition-all duration-300 ease-in-out group-hover:h-4 h-[2px] bg-qyellow absolute left-0 bottom-0 z-10"></div>
                            </div>
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1">
                {response.data && response.data.products.data.length > 0 ? (
                  <div className="w-full">
                    <div
                      style={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 15px 64px" }}
                      className="products-sorting w-full bg-white md:h-[70px] flex md:flex-row flex-col md:space-y-0 space-y-5 md:justify-between md:items-center p-[30px] mb-[40px]"
                    >
                      <div>
                        <p className="font-400 text-[14px] text-qgray capitalize">
                          <span className="">
                            {" "}
                            {langCntnt && langCntnt.Showing}
                          </span>{" "}
                          1–
                          {response.data.products.data.length}{" "}
                          {langCntnt && langCntnt.of}{" "}
                          {response.data.products.total}{" "}
                          {langCntnt && langCntnt.results}
                        </p>
                      </div>
                      <div className="flex space-x-3 items-center">
                        <span className="font-bold  text-qblack text-[13px]">
                          {langCntnt && langCntnt.View_by} :
                        </span>
                        <button
                          onClick={() => setCardViewStyle("col")}
                          type="button"
                          className={`hover:text-qpurple w-6 h-6 ${cardViewStyle === "col"
                            ? "text-qpurple"
                            : "text-qgray"
                            }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="fill-current"
                          >
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path d="M11 5H5v14h6V5zm2 0v14h6V5h-6zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setCardViewStyle("row")}
                          type="button"
                          className={`hover:text-qpurple w-6 h-6 ${cardViewStyle === "row"
                            ? "text-qpurple"
                            : "text-qgray"
                            }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="fill-current"
                          >
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path d="M19 11V5H5v6h14zm0 2H5v6h14v-6zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={() => setToggle(!filterToggle)}
                        type="button"
                        className="w-10 lg:hidden h-10 rounded flex justify-center items-center border border-qpurple text-qpurple"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                          />
                        </svg>
                      </button>
                    </div>
                    {products && cardViewStyle === "col" && (
                      <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1  xl:gap-[30px] gap-5 mb-[40px]">
                        <DataIteration
                          datas={products && products}
                          startLength={0}
                          endLength={
                            products && products.length >= 6
                              ? 6
                              : products && products.length
                          }
                        >
                          {({ datas }) => (
                            <div data-aos="fade-up" key={datas.id}>
                              <ProductCardStyleOne datas={datas} />
                            </div>
                          )}
                        </DataIteration>
                      </div>
                    )}
                    {products && cardViewStyle === "row" && (
                      <div className="grid lg:grid-cols-2 grid-cols-1  xl:gap-[30px] gap-5 mb-[40px]">
                        <DataIteration
                          datas={products && products}
                          startLength={0}
                          endLength={
                            products && products.length >= 6
                              ? 6
                              : products && products.length
                          }
                        >
                          {({ datas }) => (
                            <div data-aos="fade-up" key={datas.id}>
                              <ProductCardRowStyleOne datas={datas} />
                            </div>
                          )}
                        </DataIteration>
                      </div>
                    )}
                    {response.data && response.data.shopPageCenterBanner && parseInt(response.data.shopPageCenterBanner.status) === 1 && (
                      <div className="w-full relative text-qblack mb-[40px]">
                        <OneColumnAdsTwo
                          data={response.data.shopPageCenterBanner}
                        />
                      </div>
                    )}

                    {products && cardViewStyle === "col" && (
                      <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-[30px] gap-5">
                        <DataIteration
                          datas={products && products}
                          startLength={6}
                          endLength={
                            products && products.length >= 14
                              ? 14
                              : products && products.length
                          }
                        >
                          {({ datas }) => (
                            <div data-aos="fade-up" key={datas.id}>
                              <ProductCardStyleOne datas={datas} />
                            </div>
                          )}
                        </DataIteration>
                      </div>
                    )}
                    {products && cardViewStyle === "row" && (
                      <div className="grid lg:grid-cols-2 grid-cols-1 xl:gap-[30px] gap-5">
                        <DataIteration
                          datas={products && products}
                          startLength={6}
                          endLength={
                            products && products.length >= 14
                              ? 14
                              : products && products.length
                          }
                        >
                          {({ datas }) => (
                            <div data-aos="fade-up" key={datas.id}>
                              <ProductCardRowStyleOne datas={datas} />
                            </div>
                          )}
                        </DataIteration>
                      </div>
                    )}
                    {nxtPage && nxtPage !== "null" && (
                      <div className="flex justify-center">
                        <button
                          onClick={nextPageHandler}
                          type="button"
                          className="w-[180px] h-[54px] bg-qpurple rounded mt-10"
                        >
                          <div className="flex justify-center w-full h-full items-center group rounded relative transition-all duration-300 ease-in-out overflow-hidden cursor-pointer">
                            <div className="flex items-center transition-all duration-300 ease-in-out relative z-10  text-white">
                              <span className="text-sm font-600 tracking-wide leading-7 mr-2">
                                {langCntnt && langCntnt.Show_more}...
                              </span>
                              {loading && (
                                <span
                                  className="w-5 "
                                  style={{ transform: "scale(0.3)" }}
                                >
                                  <LoaderStyleOne />
                                </span>
                              )}
                            </div>
                            <div
                              style={{
                                transition: `transform 0.25s ease-in-out`,
                              }}
                              className="w-full h-full bg-black absolute top-0 left-0 right-0 bottom-0 transform scale-x-0 group-hover:scale-x-100 origin-[center_left] group-hover:origin-[center_right]"
                            ></div>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  // <div className={"mt-5 flex justify-center"}>
                  //   <h1 className="text-2xl font-medium text-tblack">
                  //     Products not available
                  //   </h1>
                  // </div>
                  <div className="mt-5">
                    {router.route === "/search" ? (
                      <>
                        <h2 className="text-2xl font-bold text-tblack mb-2">
                          Search Results:
                        </h2>
                        {!categoryExistInRoute &&
                          relatedProducts.length === 0 ? (
                          <>
                            <p className="text-lg text-qgray  mb-[200px]">
                              Your search -{" "}
                              <span className="font-bold text-qpurple text-xl">
                                "{router.query.search}"
                              </span>{" "}
                              - did not match any Products.
                            </p>
                            <div className="flex justify-center">
                              <div className="w-[200px] h-[200px] relative">
                                <Image
                                  layout="fill"
                                  objectFit="scale-down"
                                  src="/assets/images/search-not-found.png"
                                  alt="blog"
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-lg text-qgray mb-10">
                              Your search -{" "}
                              <span className="font-bold text-qpurple text-xl">
                                "{router.query.search}"
                              </span>{" "}
                              - did not match any Products. But still you can
                              choose products from same category.
                            </p>
                            <div className="suggested">
                              <h2 className="text-lg font-medium text-qgray mb-6">
                                Suggested Products:
                              </h2>
                              <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1  xl:gap-[30px] gap-5 mb-[40px]">
                                <DataIteration
                                  datas={relatedProducts && relatedProducts}
                                  startLength={0}
                                  endLength={
                                    relatedProducts && relatedProducts.length
                                  }
                                >
                                  {({ datas }) => (
                                    <div data-aos="fade-up" key={datas.id}>
                                      <ProductCardStyleOne datas={datas} />
                                    </div>
                                  )}
                                </DataIteration>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flex justify-center mt-20">
                          <div className="w-[200px] h-[200px] relative">
                            <Image
                              layout="fill"
                              objectFit="scale-down"
                              src="/assets/images/search-not-found.png"
                              alt="blog"
                            />
                          </div>
                        </div>
                        <div className="flex justify-center items-center mt-10">
                          <p className="text-2xl font-bold text-tblack">
                            Product Not Found
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}