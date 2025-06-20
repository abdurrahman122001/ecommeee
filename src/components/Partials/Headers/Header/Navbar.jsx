import Link from "next/link";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import languageModel from "../../../../../utils/languageModel";

export default function Navbar({ className }) {
  const { websiteSetup } = useSelector((state) => state.websiteSetup);
  const categoryList = websiteSetup?.payload?.productCategories || [];
  const [langCntnt, setLangCntnt] = useState(null);

  useEffect(() => {
    setLangCntnt(languageModel());
  }, []);

  return (
    <nav
      className={`w-full border-b border-gray-200 bg-white sticky top-0 z-30 ${className || ""}`}
    >
      <div className="container-x mx-auto px-2 flex justify-center">
        <ul className="flex items-center space-x-7 overflow-x-auto whitespace-nowrap py-3">
          {/* Dynamic categories */}
          {categoryList.map((cat) => (
            <li key={cat.id}>
              <Link
                href={{
                  pathname: "/products",
                  query: { category: cat.slug },
                }}
                passHref
              >
                <a
                  className="text-[15px] md:text-lg lg:text-xl font-medium text-qblack px-1 py-1 border-b-2 border-transparent hover:border-qpurple transition-all duration-200"
                  style={{ minWidth: "max-content" }}
                >
                  {cat.name}
                </a>
              </Link>
            </li>
          ))}

          {/* Static About & Contact Us */}
          <li>
            <Link href="/about" passHref>
              <a className="text-[15px] md:text-lg lg:text-xl font-medium text-qblack px-1 py-1 border-b-2 border-transparent hover:border-qpurple transition-all duration-200">
                {langCntnt?.About || "About"}
              </a>
            </Link>
          </li>
          <li>
            <Link href="/contact-us" passHref>
              <a className="text-[15px] md:text-lg lg:text-xl font-medium text-qblack px-1 py-1 border-b-2 border-transparent hover:border-qpurple transition-all duration-200">
                {langCntnt?.Contact_Us || "Contact Us"}
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
