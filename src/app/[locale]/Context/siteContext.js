import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiUrl, siteName, woocommerceKey, woocommerceKeyAdd } from "../Utils/variables";
import { userId } from "../Utils/UserInfo";
import { useParams, useRouter } from "next/navigation";

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale;

  const [editData, setEditData] = useState(null);

  const [contactData, setContactData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeWishlist, setActiveWishlist] = useState([]);
  const [hideCartItem, setHideCartItem] = useState({});
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [filters, setFilters] = useState([]);
  const [brands, setBrands] = useState([]);
  const [showNavCatItem, setShowNavCatItem] = useState("");
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [activeCurrency, setActiveCurrency] = useState("");
  const [activeCurrencySymbol, setActiveCurrencySymbol] = useState("");
  const [headerMenu, setHeaderMenu] = useState([]);
  const [footerMenu, setFooterMenu] = useState([]);
  const [footerMenuPages, setFooterMenuPages] = useState([]);
  const [mainCatMenues, setMainCatMenues] = useState([]);
  const [searchMobileVisible, setSearchMobileVisible] = useState(false);
  const [queryUpdated, setQueryUpdated] = useState(false);
 const [savedAddress, setSavedAddress] = useState([]);

  //CATEGORIES MENUS

  const mainCatMenuData = async () => {
    try {
      const response = await fetch(
        `${apiUrl}wp-json/custom/v1/menus/main-categories`,
        {
          next: { revalidate: 60 },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch main categories menus");
      }
      const data = await response.json();
      setMainCatMenues(data);
    } catch (error) {
      console.error(error);
    }
  };

  //HEADER MENUS

  const headerMenuData = async () => {

   
    
    
        try {
          const response = await fetch(
            `${apiUrl}wp-json/custom/v1/menus/header-menu`,
            // `${apiUrl}wp-json/custom/v1/menus/test`,
            {
              next: { revalidate: 60 },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch header menus");
          }
          const data = await response.json();
         setHeaderMenu(data);
         // console.log('ddddddddd',data)
    
        } catch (error) {
          console.error(error);
        }
      };

      



//   const headerMenuData = async () => {

// if(localStorage.getItem(`${siteName}_menu`)){
//   return false
// }


//     try {
//       const response = await fetch(
//         `${apiUrl}wp-json/custom/v1/menus/header-menu`,
//         // `${apiUrl}wp-json/custom/v1/menus/test`,
//         {
//           next: { revalidate: 60 },
//         }
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch header menus");
//       }
//       const data = await response.json();
//       typeof window !== "undefined" && localStorage.setItem(`${siteName}_menu`, JSON.stringify(data))
//       setHeaderMenu(data);
//      // console.log('ddddddddd',data)

//     } catch (error) {
//       console.error(error);
//     }
//   };

  //FOOTER MENUS

  const footerMenuData = async () => {
    try {
      const response = await fetch(
        `${apiUrl}wp-json/custom/v1/menus/footer-menu`,
        {
          next: { revalidate: 60 },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch footer menus");
      }
      const data = await response.json();
      setFooterMenu(data);
    } catch (error) {
      console.error(error);
    }
  };

  //FOOTER MENU PAGES

  const footerMenuPagesData = async () => {
    try {
      const response = await fetch(
        `${apiUrl}wp-json/custom/v1/menus/footer-menu-pages`,
        {
          next: { revalidate: 60 },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch footer menu pages");
      }
      const data = await response.json();
      setFooterMenuPages(data);
    } catch (error) {
      console.error(error);
    }
  };

  //CURRENCIES
  const currency = async () => {
    try {
      const response = await fetch(
        `${apiUrl}wp-json/wp/v2/currency?orderby=id&order=asc&lang=${
          locale || "en"
        }`,
        {
          next: { revalidate: 60 },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCurrencies(data);
    } catch (error) {
      console.error(error);
    }
  };

  //MAIN CATEGOREIS
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${apiUrl}wp-json/wp/v2/main-categories?per_page=99&lang=${
          locale || "en"
        }`,
        {
          next: { revalidate: 60 },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  //SUB CATEGOREIS
  const fetchSubCategories = async () => {
    try {
      const response = await fetch(
        `${apiUrl}wp-json/wp/v2/sub-categories?per_page=99`,
        {
          next: { revalidate: 60 },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch sub categories");
      }
      const data = await response.json();
      setSubCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  //CHILD CATEGOREIS
  const fetchChildategories = async () => {
    try {
      const response = await fetch(
        `${apiUrl}wp-json/wp/v2/child-categories?per_page=99&lang=${
          locale || "en"
        }`,
        {
          next: { revalidate: 60 },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch child categories");
      }
      const data = await response.json();
      setChildCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  //FILTERS
  const fetchFilters = async () => {
    try {
      const response = await fetch(
        `${apiUrl}wp-json/wp/v2/filter?per_page=99&lang=${locale || "en"}`,
        {
          next: { revalidate: 60 },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch child categories");
      }
      const data = await response.json();
      setFilters(data);
    } catch (error) {
      console.error(error);
    }
  };

 

  //WISH LIST
  const fetchWishlist = async () => {
    try {
      const response = await fetch(
        `${apiUrl}wp-json/wishlist/v1/get/${userId || 1}${woocommerceKey}`,
        {
          next: { revalidate: 60 },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }
      const data = await response.json();
      setActiveWishlist(data);
    } catch (error) {
      console.error(error);
    }
  };



  
  



  //CONTACT INFO
  const fetchContactInfo = async () => {
    try {
      const response = await fetch(
        `${apiUrl}wp-json/wp/v2/contact-info?lang=${locale || "en"}`,
        {
          next: { revalidate: 60 },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setContactData(data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  //BRANDS
  const fetchBrands = async () => {
    try {
      const response = await fetch(
        `${apiUrl}wp-json/wp/v2/brands?lang=en&per_page=99`,
        {
          next: { revalidate: 60 },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error(error);
    }
  };

  //ACTIVE CURRENCY

  useEffect(() => {
    //  typeof window !== "undefined" && localStorage.setItem(`${siteName}_currency`, 'AED')
    //  typeof window !== "undefined" && localStorage.setItem(`${siteName}_currency_symbol`, 'AED')
    const currency =
      typeof window !== "undefined" &&
      localStorage.getItem(`${siteName}_currency`);
    const currencySymbol =
      typeof window !== "undefined" &&
      localStorage.getItem(`${siteName}_currency_symbol`);

    setActiveCurrency(currency || "AED");
    setActiveCurrencySymbol(currencySymbol || "AED");
  }, [activeCurrency]);

  useEffect(() => {
    mainCatMenuData();
    footerMenuPagesData();
    footerMenuData();
    headerMenuData();
    currency();
    fetchCategories();
    fetchSubCategories();
    fetchChildategories();
    fetchWishlist();
    fetchContactInfo();
    fetchBrands();
    fetchFilters();
    //  fetchMedia();

    if (!userId) {
      console.warn("User is not logged in. Fetching wishlist for guest.");
      return; // Exit early or handle it differently
    }
  }, [userId, locale]);

  return (
    <SiteContext.Provider
      value={{
        editData,
        setEditData,
        contactData,
        setContactData,
        activeWishlist,
        mainCatMenues,
        setMainCatMenues,
        headerMenu,
        setHeaderMenu,
        setActiveWishlist,
        hideCartItem,
        setHideCartItem,
        showMegaMenu,
        footerMenu,
        setFooterMenu,
        setShowMegaMenu,
        footerMenuPages,
        setFooterMenuPages,
        categories,
        setCategories,
        subCategories,
        setSubCategories,
        childCategories,
        setChildCategories,
        showNavCatItem,
        setShowNavCatItem,
        searchMobileVisible,
        setSearchMobileVisible,
        brands,
        setBrands,
        showNewAddress,
        setShowNewAddress,
        filters,
        setFilters,
        activeCurrency,
        setActiveCurrency,
        activeCurrencySymbol,
        setActiveCurrencySymbol,
        selectedFilters,
        setSelectedFilters,
        currencies,
        setCurrencies,
        showFilter,
        setShowFilter,
        queryUpdated,
        setQueryUpdated,
        loading,
        savedAddress, setSavedAddress,
        error, // Pass loading and error to context
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteContext = () => {
  return useContext(SiteContext);
};
