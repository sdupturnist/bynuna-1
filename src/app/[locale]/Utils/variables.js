import {
  PencilIcon,
  HeartIcon,
  ArchiveBoxIcon,
  TruckIcon,
  MapIcon,
  CreditCardIcon,
  StarIcon,
  GiftIcon,
  KeyIcon,
  UserIcon,
  CogIcon,
  CalendarIcon,
  ArrowUturnUpIcon,
} from "@heroicons/react/24/solid";
// import CryptoJS from "crypto-js";

const date = new Date();




//SECRET USER TOCKEN
//export let userTocken = `9AzTrOe80vVVRgu80WPjO5itzqXJzWFVLhfxZjm6ujiCUsQvIQr1kmxT7PFj8QTkuO7QQ0H3CsbHsx3lImBghkdt0gIbA3VSjcKL4G4CEzwCYF`;

//WOOCOMMERECE
export let woocommerceKey =
  "?consumer_key=ck_2d04135ce56ef79ee425fed2269cc101bea5804f&consumer_secret=cs_588ff4bc83df6125ba5d3e0aa383679ff7eeab11";





//.ENV
export let homeUrl = process.env.NEXT_PUBLIC_SITE_URL
//export let homeUrl = `https://ardalmarmoom.com/`;
//export let homeUrl = `https://bynuna-chi.vercel.app/`;
export let apiUrl = process.env.NEXT_PUBLIC_API_URL



//GENERAL CONFIG
export let siteName = "bynuna";
export let siteAuthor = `${siteName} admin`;
export let year = date.getFullYear();




export let copyright = `© ${year} Bynuna. All Rights Reserved!`;
export let siteLogo = `${apiUrl}wp-content/uploads/2025/01/bynuna_logo.png`;
export let siteLogoWhite = `${apiUrl}wp-content/uploads/2025/01/bynuna_logo.png`;

//https://docs.totalpay.global/checkout_integration#request-parameters]
//TOTALPAY
export let totalPayMerchantKeyTest = "cb6b074c-7b0f-11ee-9995-5af3283cdfeb";
export let totalPaymerchantKeyLive = "cb6b0968-7b0f-11ee-a947-5af3283cdfeb";
export let totalPayPassword = "be80eebd9f33e214ad7019a70ffd86f9";
export let totalPayCheckoutUrl =
  "https://checkout.totalpay.global/api/v1/session";

//ADMIN MENU
export let accountMenus = [
  {
    label: "Dashboard",
    url: "account",
    icon: <ArchiveBoxIcon className="sm:size-4 size-[18px] text-primary" />,
  },
  {
    label: "Orders",
    url: "account/orders",
    icon: <ArchiveBoxIcon className="sm:size-4 size-[18px] text-primary" />,
  },
  {
    label: "Wishlist",
    url: "account/wishlist",
    icon: <HeartIcon className="sm:size-4 size-[18px] text-primary" />,
  },
  {
    label: "Address",
    url: "account/address",
    icon: <MapIcon className="sm:size-4 size-[18px] text-primary" />,
  },
  // {
  //   label: 'Payments',
  //   url: 'account/payments',
  //   icon: <CreditCardIcon className="sm:size-4 size-[18px] text-primary" />,
  // },
  // {
  //   label: 'Returns',
  //   url: 'account/returns',
  //   icon: <TruckIcon className="sm:size-4 size-[18px] text-primary" />,
  // },
  {
    label: "Reviews",
    url: "account/reviews",
    icon: <StarIcon className="sm:size-4 size-[18px] text-primary" />,
  },
  // {
  //   label: 'Reward Points',
  //   url: 'account/rewards',
  //   icon: <GiftIcon className="sm:size-4 size-[18px] text-primary" />,
  // },
  // {
  //   label: 'Edit profile',
  //   url: 'account/edit-profile',
  //   icon: <UserIcon className="sm:size-4 size-[18px] text-primary" />,
  // },
  {
    label: "Change password",
    url: "account/change-password",
    icon: <KeyIcon className="sm:size-4 size-[18px] text-primary" />,
  },
];

//EMAIL CONFIG

// GMAIL
export let hostName = "smtp.gmail.com";
export let portNumber = 587;
export let emailUsername = "jaseerali2012@gmail.com";
export let emailPassword = "thmqawimjxglferj";
export let siteEmail = "jaseerali2012@gmail.com";
export let siteFromEmail = "jaseerali2012@gmail.com";


//MAILEROO

// export let hostName = "smtp.maileroo.com"
// export let portNumber =  587
// export let emailUsername = "no-reply@bynuna.ae"
// export let emailPassword = "265e0b1132eb125f2b2454b6"
//  export let siteEmail = "online@bynuna.ae";
//  export let siteFromEmail = "no-reply@bynuna.ae";

//DEFAULT META TAGS

export let metaTitle =
  "BYNUNA Military & Hunting Equipment Trading LLC | Specialized Hunting, Shooting & Law Enforcement Gear in UAE";
export let metaDescription =
  "BYNUNA Military & Hunting Equipment Trading LLC, formerly known as Bynuna Hunting & Shooting Equipment, offers high-quality military, hunting, and law enforcement products in the UAE. Established in 2012, we cater to both governmental and civilian customers with top global brands.";
export let metaAuthor = "BYNUNA Team";
export let metaKeywords =
  "Military Equipment, Hunting Gear, Shooting Equipment, Law Enforcement Gear, Outdoor Sports Equipment, UAE Hunting Store, UAE Military Supplier, Hunting and Shooting UAE, Outdoor Sports UAE, Law Enforcement UAE, Best Military Brands, Bynuna Hunting & Shooting Equipment.";
export let metaViewport = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
export let metaRobots = "index, follow";

// Open Graph Tags
export let metaOgTitle =
  "BYNUNA Military & Hunting Equipment Trading LLC | Specialized Hunting, Shooting & Law Enforcement Gear in UAE";
export let metaOgDescription =
  "BYNUNA Military & Hunting Equipment Trading LLC, formerly known as Bynuna Hunting & Shooting Equipment, offers high-quality military, hunting, and law enforcement products in the UAE. Established in 2012, we cater to both governmental and civilian customers with top global brands.";
export let metaOgImage = siteLogo;
export let metaOgUrl = homeUrl;
export let metaOgSiteName = siteName;

// Twitter Tags
export let metaTwitterCard = "summary_large_image";
export let metaTwitterSite = "@bynuna";
export let metaTwitterCreator = "@bynuna";
export let metaTwitterImage = siteLogo;

// Additional Meta Tags
export let metaCharset = "utf-8";
export let metaThemeColor = "#ffffff";
export let metaFavicon =
  "https://admin.bynunaonlinestore.com/uploads/website-images/favicon-2024-02-02-04-49-35-2532.png";

export let language = [
  {
    label: "Arabic",
    short_label: "ar",
  },
  {
    label: "English",
    short_label: "en",
  },
];

export const getTranslation = (translations, englishText, language) => {
  if (!translations || !englishText) {
    return englishText; // Return the original text if translations or englishText is invalid
  }

  // Ensure englishText is a valid string before trimming
  const trimmedEnglishText = typeof englishText === 'string' ? englishText.trim() : '';

  if (language === "ar") {
    const translation = translations.find(
      (item) =>
        item.english.trim().toLowerCase() === trimmedEnglishText.toLowerCase()
    );

    if (translation) {
      return translation.arabic || trimmedEnglishText;
    }

    return trimmedEnglishText;
  }

  return englishText;
};


export const translateStatusToArabic = (status) => {
  const statusTranslations = {
    "item-received": "تم استلام العنصر",
    "item-collected": "تم جمع العنصر",
    "return-approved": "تمت الموافقة على الإرجاع",
    "return-rejected": "تم رفض الإرجاع",
    "return-completed": "تم الإرجاع",
    "refund-initiated": "تم بدء استرداد الأموال",
    returned: "تم الإرجاع",
    processing: "جار المعالجة",
    pending: "معلق",
    delivered: "تم التسليم",
    shipped: "تم الشحن",
    packed: "تم التعبئة",
  };

  return statusTranslations[status] || ""; // Default case if the status is not in the dictionary
};

export const languageText = (en) => {
  if (en !== undefined || en !== null || en !== "") {
    return en;
  } else {
  }

  // let text = "";

  // if (language === "en") {
  //   text = `${en}${separation === "yes" ? ", " : ""}`;
  // } else if (language === "ar" && ar !== "") {
  //   text = `${ar}${separation === "yes" ? ", " : ""}`;
  // } else {
  //   text = en; // Default to English if no valid condition is met
  // }

  // // Remove the last comma if there was one
  // if (separation === "yes" && text.endsWith(", ")) {
  //   text = text.slice(0, -2); // Remove the last 2 characters (comma and space)
  // }

  // return text.replace(/,([^ ])/g, ", $1");
};

export let paymentCurrency = "INR";

export let convertStringToJSON = (offerString) => {
  // Split the offerString into parts, handling the line breaks, commas, and trimming unnecessary spaces
  let parts =
    offerString &&
    offerString
      .replace(/\r\n/g, "\n") // Normalize line breaks
      .split(",") // Split by commas to get individual offers
      .map((part) => part.trim()) // Trim each part to remove extra spaces
      .filter((part) => part !== ""); // Remove empty strings from the array

  // Map each part to an object that contains both the offer description and the price
  let offerData =
    parts &&
    parts.map((part) => {
      // Split by the colon to separate the offer description from the price
      let [description, price] = part.split(":").map((item) => item.trim());

      // Check if there's a price, and return the object
      return {
        item: description,
        price: price || null, // If no price is available, set it to null
      };
    });

  return offerData;
};

export let metaStaticData = {
  title: "BYNUNA Military & Hunting Equipment Trading LLC",
  description: "Specialized Emirati company serving Military, Hunting, and Law Enforcement customers in the UAE since 2012. Offering top-quality products from the best global brands.",
  author: "BYNUNA Military & Hunting Equipment Trading LLC",
  keywords: "military, hunting, shooting, law enforcement, outdoor sports, UAE, equipment, hunting gear, military supplies",
  robots: "index, follow",
  canonical: `${homeUrl}en`,  // Update with the actual URL
  og_locale: "en_US",
  og_type: "website",
  og_title: "BYNUNA Military & Hunting Equipment Trading LLC",
  og_description: "Providing the best military, hunting, and law enforcement equipment in the UAE. Trusted by professionals since 2012.",
  og_url: `${homeUrl}en`,  // Update with the actual URL
  ogImage: `${homeUrl}favicon.ico`,  // Update with a proper image URL if needed
  og_site_name: "BYNUNA Military & Hunting Equipment Trading LLC",
  article_modified_time: "",
  twitter_card: "summary_large_image",
  
  twitter_misc: {
    "Est. reading time": "2 minutes",
  },
  twitter_site: "@bynunaofficial",  // Update with the actual Twitter handle
  twitter_creator: "@bynunaofficial",  // Update with the actual Twitter handle
  twitter_image: `${homeUrl}favicon.ico`,  // Update with a proper image URL if needed
};


export let truncateText = (text, length) => {
  if (!text) return "";

  return text.length > length ? text.slice(0, length - 3) + "..." : text;
};

export let formatDateString = (dateStr) => {
  const date = new Date(dateStr);

  // Array of month names to convert numeric month to name
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get the components of the date
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  // Return formatted date as "Month Day, Year"
  return `${month} ${day}, ${year}`;
};

export let formatDateStringWithTime = (dateStr) => {
  const date = new Date(dateStr);

  // Array of month names to convert numeric month to name
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get the components of the date
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  // Get the time components
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Format the time as "HH:MM:SS"
  const formattedTime = `${hours}:${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;

  // Return date with optional time
  if (dateStr.includes("T")) {
    return `${month} ${day}, ${year} ${formattedTime}`;
  } else {
    return `${month} ${day}, ${year}`;
  }
};

//GET CURRENCY RATE BY CURRENCY TYPE
// export let currencyRate = (currencies, currencyType) => {
//   const rate = currencies?.find(currency => currency.slug === String(currencyType).toLowerCase().replace(/ /g, '-'))
//     return rate

//   }

//1USD×3.67AED/USD=3.67AED

//CONVERT THE AED TO ANOTHER CURRENCIES
export let convertCurrency = (price, rate) => {
  const amount = price / rate;

  // Multiply by 1000000 to avoid rounding errors, then round, and divide back by 1000000
  const preciseAmount = Math.round(amount * 1000000) / 1000000;

  return preciseAmount.toFixed(2); // Force 2 decimal places
};

//URL SLUG
export let linkSlug = (item) => {
  const slug = item && item?.toLowerCase().replace(/ /g, "-");

  return slug;
};

export let emailTemplate = () => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Enquiry Notification</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9f9f9;">
     <div style="margin: 0; padding: 0; font-family: 'Arial, sans-serif'; background-color: #fff;">
            <table role="presentation" width="100%" cellSpacing="0" cellPadding="0" style="border-collapse: collapse; background-color: #fff;">
                <!-- Header -->
               

                <!-- Footer -->
                <tr>
                    <td style="background-color: #15181E; color: #fff; text-align: center; padding: 10px; font-size: 14px;">
                       
                    </td>
                </tr>
            </table>
        </div>
</body>
</html>`;
};

export let isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};




export const sortByStockStatus = (data) => {
      return [...data].sort((a, b) => {
        const aStock = a.meta_data.find(item => item.key === "_stock_status")?.value;
        const bStock = b.meta_data.find(item => item.key === "_stock_status")?.value;
    
        if (aStock === "outofstock" && bStock !== "outofstock") return 1;
        if (aStock !== "outofstock" && bStock === "outofstock") return -1;
        return 0;
      });
    };