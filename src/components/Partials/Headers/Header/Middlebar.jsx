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
              className={`w-full h-[240px] bg-white delay-300 shadow transition-all duration-300 ease-in-out fixed left-0 top-0 transform ${
                searchToggle ? `translate-y-0` : "-translate-y-[100vh]"
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
              className={`w-full h-screen transition-all duration-300 ease-in-out bg-black bg-opacity-50 fixed left-0 top-0 z-40 transform ${
                searchToggle ? `translate-y-0` : "-translate-y-[100vh]"
              }`}
            ></div>

            {/* Right menu */}
            <div className="flex space-x-6 items-center relative">
              {/* Search Icon */}
              <div
                onClick={() => setSearchToggle(true)}
                className="w-[52px] h-[52px] bg-qyellow flex justify-center items-center rounded-full cursor-pointer"
              >
                <span>
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.9708 16.4151C12.5227 17.4021 10.9758 17.9723 9.27353 18.0062C5.58462 18.0802 2.75802 16.483 1.05056 13.1945C-1.76315 7.77253 1.33485 1.37571 7.25086 0.167548C12.2281 -0.848249 17.2053 2.87895 17.7198 7.98579C17.9182 9.95558 17.5566 11.7939 16.5852 13.5061C16.4512 13.742 16.483 13.8725 16.6651 14.0553C18.2412 15.6386 19.8112 17.2272 21.3735 18.8244C22.1826 19.6513 22.2058 20.7559 21.456 21.4932C20.7697 22.1678 19.7047 22.1747 18.9764 21.4793C18.3623 20.8917 17.7774 20.2737 17.1796 19.6688C16.118 18.5929 15.0564 17.5153 13.9708 16.4151ZM2.89545 9.0364C2.91692 12.4172 5.59664 15.1164 8.91967 15.1042C12.2384 15.092 14.9138 12.3493 14.8889 8.98505C14.864 5.63213 12.1826 2.92508 8.89047 2.92857C5.58204 2.93118 2.87397 5.68958 2.89545 9.0364Z"
                      fill="#232532"
                    />
                  </svg>
                </span>
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
                        {/* SVG ICON OMITTED FOR BREVITY */}
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M22 11.0094C21.997 17.0881 17.0653 22.007 10.9802 22C4.90444 21.9931 -0.00941233 17.0569 1.3538e-05 10.9688C0.00943941 4.89602 4.95157 -0.0133673 11.0422 2.73441e-05C17.0961 0.013422 22.003 4.94315 22 11.0094ZM6.16553 10.7812C6.40365 7.62357 8.72192 6.28609 10.5868 6.19927C12.3305 6.11791 14.4529 7.33534 14.7465 8.61428C14.2425 8.61428 13.7459 8.61428 13.2429 8.61428C13.2429 9.02406 13.2429 9.39861 13.2429 9.79748C14.308 9.79748 15.3374 9.80641 16.3668 9.79301C16.7805 9.78755 17.0102 9.52909 17.0147 9.10046C17.0221 8.34143 17.0172 7.5824 17.0172 6.82337C17.0172 6.55795 17.0172 6.29254 17.0172 6.0311C16.5836 6.0311 16.2165 6.0311 15.7908 6.0311C15.7908 6.60459 15.7908 7.15724 15.7908 7.79374C13.9379 5.04436 10.8447 4.4545 8.48578 5.48241C6.21811 6.47064 4.90792 8.84695 5.04682 10.7817C5.40997 10.7812 5.77609 10.7812 6.16553 10.7812ZM15.8191 11.2178C15.7581 12.4576 15.3498 13.547 14.4742 14.4286C13.5976 15.3111 12.5265 15.772 11.2858 15.8008C9.57472 15.8405 7.568 14.6424 7.2495 13.3892C7.75403 13.3892 8.25013 13.3892 8.76012 13.3892C8.76012 12.9809 8.76012 12.6064 8.76012 12.2041C7.68458 12.2041 6.64178 12.1921 5.59997 12.21C5.19962 12.2169 5.00069 12.4839 4.99771 12.9442C4.99176 13.803 4.99573 14.6612 4.99573 15.52C4.99573 15.6698 4.99573 15.8196 4.99573 15.964C5.4318 15.964 5.79692 15.964 6.20224 15.964C6.20224 15.3895 6.20224 14.8418 6.20224 14.1686C7.07984 15.4912 8.16976 16.3465 9.58216 16.7617C11.0184 17.1839 12.4114 17.0494 13.7548 16.4035C15.8191 15.4113 17.0946 13.1466 16.9507 11.2178C16.5861 11.2178 16.2209 11.2178 15.8191 11.2178Z"
                            fill="#6E6D79"
                          />
                          {/* White overlays omitted for brevity */}
                        </svg>
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
                        {/* SVG ICON OMITTED FOR BREVITY */}
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M22 11.0094C21.997 17.0881 17.0653 22.007 10.9802 22C4.90444 21.9931 -0.00941233 17.0569 1.3538e-05 10.9688C0.00943941 4.89602 4.95157 -0.0133673 11.0422 2.73441e-05C17.0961 0.013422 22.003 4.94315 22 11.0094ZM6.16553 10.7812C6.40365 7.62357 8.72192 6.28609 10.5868 6.19927C12.3305 6.11791 14.4529 7.33534 14.7465 8.61428C14.2425 8.61428 13.7459 8.61428 13.2429 8.61428C13.2429 9.02406 13.2429 9.39861 13.2429 9.79748C14.308 9.79748 15.3374 9.80641 16.3668 9.79301C16.7805 9.78755 17.0102 9.52909 17.0147 9.10046C17.0221 8.34143 17.0172 7.5824 17.0172 6.82337C17.0172 6.55795 17.0172 6.29254 17.0172 6.0311C16.5836 6.0311 16.2165 6.0311 15.7908 6.0311C15.7908 6.60459 15.7908 7.15724 15.7908 7.79374C13.9379 5.04436 10.8447 4.4545 8.48578 5.48241C6.21811 6.47064 4.90792 8.84695 5.04682 10.7817C5.40997 10.7812 5.77609 10.7812 6.16553 10.7812ZM15.8191 11.2178C15.7581 12.4576 15.3498 13.547 14.4742 14.4286C13.5976 15.3111 12.5265 15.772 11.2858 15.8008C9.57472 15.8405 7.568 14.6424 7.2495 13.3892C7.75403 13.3892 8.25013 13.3892 8.76012 13.3892C8.76012 12.9809 8.76012 12.6064 8.76012 12.2041C7.68458 12.2041 6.64178 12.1921 5.59997 12.21C5.19962 12.2169 5.00069 12.4839 4.99771 12.9442C4.99176 13.803 4.99573 14.6612 4.99573 15.52C4.99573 15.6698 4.99573 15.8196 4.99573 15.964C5.4318 15.964 5.79692 15.964 6.20224 15.964C6.20224 15.3895 6.20224 14.8418 6.20224 14.1686C7.07984 15.4912 8.16976 16.3465 9.58216 16.7617C11.0184 17.1839 12.4114 17.0494 13.7548 16.4035C15.8191 15.4113 17.0946 13.1466 16.9507 11.2178C16.5861 11.2178 16.2209 11.2178 15.8191 11.2178Z"
                            fill="#6E6D79"
                          />
                          {/* White overlays omitted for brevity */}
                        </svg>
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
