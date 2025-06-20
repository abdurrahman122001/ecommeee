import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import apiRequest from "../../../../../utils/apiRequest";
import { fetchWishlist } from "../../../../store/wishlistData";
import Cart from "../../../Cart";
import ThinBag from "../../../Helpers/icons/ThinBag";
import ThinPeople from "../../../Helpers/icons/ThinPeople";
import SearchBox from "../../../Helpers/SearchBox";
import languageModel from "../../../../../utils/languageModel";
import DefaultUser from "../../../../contexts/DefaultUser";
import { Search, ShoppingCart, UserRound, Heart } from "lucide-react";
import { Shuffle } from "lucide-react";

function AccountDropdown({ defaultImage, user, auth, logout }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User icon and (if logged in) user info */}
      <button
        onClick={() => setProfileOpen((v) => !v)}
        className="flex items-center outline-none focus:ring-0"
        type="button"
        tabIndex={0}
        aria-label="User menu"
      >
        <div className="w-[52px] h-[52px] rounded-full bg-qyellow flex justify-center items-center overflow-hidden relative">
          {auth && user && user.image ? (
            <Image
              layout="fill"
              objectFit="cover"
              src={process.env.NEXT_PUBLIC_BASE_URL + user.image}
              alt="user"
            />
          ) : auth && defaultImage ? (
            <Image
              layout="fill"
              objectFit="cover"
              src={process.env.NEXT_PUBLIC_BASE_URL + defaultImage}
              alt="user"
            />
          ) : (
            <ThinPeople className="w-8 h-8 text-[#6E6D79]" />
          )}
        </div>
        {auth && user && (
          <div className="ml-2 flex flex-col space-y-1">
            <h3 className="text-md text-qblack font-semibold leading-none">
              {user.name}
            </h3>
            <p className="text-sm text-qgray leading-none">{user.phone}</p>
          </div>
        )}
      </button>
      {/* Dropdown */}
      {profileOpen && (
        <div className="w-[210px] bg-white absolute right-0 top-[60px] z-40 border-t-4 border-qpurple flex flex-col rounded-lg shadow-xl">
          <div className="p-4">
            <ul className="flex flex-col space-y-4">
              {auth ? (
                <>
                  <li>
                    <Link href="/profile#dashboard">
                      <a
                        className="text-qgray hover:text-qblack hover:font-semibold block"
                        onClick={() => setProfileOpen(false)}
                      >
                        Account
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/tracking-order">
                      <a
                        className="text-qgray hover:text-qblack hover:font-semibold block"
                        onClick={() => setProfileOpen(false)}
                      >
                        Track Order
                      </a>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      className="text-qred hover:font-semibold text-left w-full"
                    >
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link href="/login">
                    <a
                      className="text-qgray hover:text-qblack hover:font-semibold block"
                      onClick={() => setProfileOpen(false)}
                    >
                      Login
                    </a>
                  </Link>
                </li>

              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Middlebar({ className, settings }) {
  const { websiteSetup } = useSelector((state) => state.websiteSetup);
  const { wishlistData } = useSelector((state) => state.wishlistData);
  const wishlists = wishlistData && wishlistData.wishlists;
  const { compareProducts } = useSelector((state) => state.compareProducts);
  const { cart } = useSelector((state) => state.cart);

  const router = useRouter();
  const dispatch = useDispatch();
  const value = useContext(DefaultUser);

  const [searchToggle, setSearchToggle] = useState(false);
  const [user, setUser] = useState(null);
  const [defaultImage, setDefaultImage] = useState(null);
  const [auth, setAuth] = useState(null);
  const [cartItems, setCartItem] = useState(null);
  const [langCntnt, setLangCntnt] = useState(null);

  // Handle user data from context
  useEffect(() => {
    setUser(value.user);
  }, [value]);
  // Set default image from setup
  useEffect(() => {
    if (websiteSetup && !defaultImage) {
      setDefaultImage(websiteSetup.payload?.defaultProfile?.image);
    }
  }, [websiteSetup, defaultImage]);
  // Handle auth from localStorage
  useEffect(() => {
    setAuth(JSON.parse(localStorage.getItem("auth")));
  }, []);
  // Set cart items
  useEffect(() => {
    cart && setCartItem(cart.cartProducts);
  }, [cart]);
  // Language content
  useEffect(() => {
    setLangCntnt(languageModel());
  }, []);

  // Logout function
  const logout = () => {
    if (auth) {
      apiRequest.logout(auth.access_token);
      localStorage.removeItem("auth");
      localStorage.removeItem("active-user");
      dispatch(fetchWishlist());
      router.push("/login");
    }
  };

  return (
    <div className={`w-full h-[86px] bg-white ${className}`}>
      <div className="container-x mx-auto h-full">
        <div className="relative h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <div className="relative">
              <Link href="/" passHref>
                <a rel="noopener noreferrer">
                  {settings && (
                    <Image
                      width="153"
                      height="44"
                      objectFit="scale-down"
                      src={`${process.env.NEXT_PUBLIC_BASE_URL + settings.logo}`}
                      alt="logo"
                    />
                  )}
                </a>
              </Link>
            </div>

            {/* Search Overlay */}
            <div
              className={`w-full h-[240px] bg-white delay-300 shadow transition-all duration-300 ease-in-out fixed left-0 top-0 transform ${searchToggle ? `translate-y-0` : "-translate-y-[100vh]"
                }`}
              style={{ zIndex: 99 }}
            >
              <div className="w-full h-full flex justify-center items-center relative">
                <div className="w-[620px] h-[60px]">
                  <SearchBox />
                </div>
                <button
                  onClick={() => setSearchToggle(false)}
                  type="button"
                  className="text-qred absolute right-5 top-5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            {/* Search Overlay Blackout */}
            <div
              onClick={() => setSearchToggle(false)}
              className={`w-full h-screen transition-all duration-300 ease-in-out bg-black bg-opacity-50 fixed left-0 top-0 z-40 transform ${searchToggle ? `translate-y-0` : "-translate-y-[100vh]"
                }`}
            ></div>

            {/* Right menu */}
            <div className="flex space-x-6 items-center relative">
              {/* Search Icon */}
              <div
                onClick={() => setSearchToggle(true)}
                className="w-[52px] h-[52px] bg-yellow flex justify-center items-center rounded-full cursor-pointer"
              >
                <Search size={22} className="text-[#232532]" />
              </div>
              {/* Compare */}
              <div className="compaire relative">
                {auth ? (
                  <Link href="/products-compaire" passHref>
                    <a
                      rel="noopener noreferrer"
                      className="flex space-x-4 items-center"
                    >
                      <span className="cursor-pointer text-[#6E6D79]">
                        <Shuffle s size={22} className="text-[#6E6D79]" />
                      </span>
                      <span className="text-base text-qgray font-medium">
                        Compare
                      </span>
                    </a>
                  </Link>
                ) : (
                  <Link href="/login" passHref>
                    <a
                      rel="noopener noreferrer"
                      className="flex space-x-4 items-center"
                    >
                      <span className="cursor-pointer text-[#6E6D79]">
                        <Heart size={22} className="text-[#6E6D79]" />
                      </span>
                      <span className="text-base text-qgray font-medium capitalize">
                        {langCntnt && langCntnt.compare}
                      </span>
                    </a>
                  </Link>
                )}
                <span className="w-[18px] h-[18px] rounded-full  absolute -top-1.5 left-4 flex justify-center items-center text-[9px]">
                  {compareProducts ? compareProducts.products.length : 0}
                </span>
              </div>

              {/* Wishlist */}
              <div className="favorite relative">
                <Link href="/wishlist" passHref>
                  <a rel="noopener noreferrer" className="flex space-x-4 items-center">
                    <span className="cursor-pointer text-[#6E6D79]">
                      {/* SVG ICON OMITTED FOR BREVITY */}
                      <svg
                        width="23"
                        height="22"
                        viewBox="0 0 23 22"
                        className="fill-current"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M11.4048 3.54989C11.6188 3.30247 11.807 3.07783 12.0028 2.86001C15.0698 -0.54838 20.3879 0.51717 22.1581 4.60443C23.4189 7.5161 22.8486 10.213 20.9966 12.6962C19.6524 14.498 17.95 15.9437 16.2722 17.4108C15.0308 18.4964 13.7741 19.5642 12.5247 20.6408C11.6987 21.3523 11.1109 21.3607 10.2924 20.6397C8.05184 18.6657 5.79232 16.7125 3.59037 14.6964C2.35873 13.5686 1.33274 12.2553 0.638899 10.7086C-0.626827 7.88722 0.0325472 4.41204 2.22314 2.41034C4.84019 0.0185469 8.81764 0.369176 11.1059 3.19281C11.1968 3.30475 11.2908 3.41404 11.4048 3.54989Z" />
                      </svg>
                    </span>
                    <span className="text-base text-qgray font-medium capitalize">
                      {langCntnt && langCntnt.Wishlist}
                    </span>
                  </a>
                </Link>
                <span className="w-[18px] h-[18px] rounded-full  absolute -top-1.5 left-4 flex justify-center items-center text-[9px]">
                  {wishlists ? wishlists.data.length : 0}
                </span>
              </div>

              {/* Cart */}
              <div className="cart-wrapper group relative py-4">
                <div className="cart relative cursor-pointer">
                  <Link href="/cart" passHref>
                    <a rel="noopener noreferrer" className="flex space-x-4 items-center">
                      <span className="cursor-pointer text-[#6E6D79]">
                        <ThinBag className="fill-current" />
                      </span>
                      <span className="text-base text-qgray font-medium">
                        {langCntnt && langCntnt.Cart}
                      </span>
                    </a>
                  </Link>
                  <span className="w-[18px] h-[18px] rounded-full  absolute -top-1.5 left-4 flex justify-center items-center text-[9px]">
                    {cartItems ? cartItems.length : 0}
                  </span>
                </div>
                <Cart className="absolute -right-[45px] top-14 z-50 hidden group-hover:block rounded" />
              </div>

              {/* Account Dropdown */}
              <AccountDropdown
                defaultImage={defaultImage}
                user={user}
                auth={auth}
                logout={logout}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
