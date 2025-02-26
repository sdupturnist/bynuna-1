import { createContext, useContext, useEffect, useState } from "react";
import {
  apiUrl,
  siteName,
  woocommerceKey,
} from "../Utils/variables";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(0);
  const [cartItems, setCartItems] = useState([]); // Ensure this is initialized as an empty array
  const [cartSubTotal, setCartSubTotal] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [couponCode, setCouponCode] = useState(false);
  const [couponCodeName, setCouponCodeName] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("");
  const [couponData, setCouponData] = useState([]);
  const [guestUser, setGuestUser] = useState(false);
  const [guestUserData, setGuestUserData] = useState(null);
  const [guestUserDataValidation, setGuestUserDataValidation] = useState(false);
  const [cartListedItems, setCartListedItems] = useState([]);
  const [haveShippingCharge, setHaveShippingCharge] = useState(0);
  const [maximumCouponApplied, setMaximumCouponApplied] = useState(0);
  const [refundable, setRefundable] = useState('');
  const [payAmount, setPayAmount] = useState(0);

    const [vat, setVat] = useState([]);
    const [vatAmount, setVatAmount] = useState(0);
    const [price, setPrice] = useState('');
    const [eligibleFreeShipping, setEligibleFreeShipping] = useState(false);
    const [finalDiscount, setFinalDiscount] = useState(0);
    const [shippingCharge, setShippingCharge] = useState([]);
    

    const shippingChargeLimit = 999



    //VAT
    const vatData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}wp-json/wc/v3/taxes${woocommerceKey}`,
          {
            next: { revalidate: 60 },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch vat");
        }
        const data = await response.json();
      //  console.log(data[0])
        setVat(data[0]);
      } catch (error) {
        console.error(error);
      }
    };
  
  
      //SHIPIING CHARGE
      const currentShippingCharge = async () => {
        try {
          const response = await fetch(
            `${apiUrl}wp-json/wp/v2/shipping-charge`,
            {
              next: { revalidate: 60 },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch categories");
          }
          const data = await response.json();
        //  console.log(data[0])
          setShippingCharge(data[0]);
        } catch (error) {
          console.error(error);
        }
      };
  


  useEffect(() => {
    
    vatData()
    currentShippingCharge()

  }, []);


  // Load cartItems from localStorage when the component mounts
  useEffect(() => {


    
    if (typeof window !== "undefined") {
      const storedCartItems = typeof window !== "undefined" &&  localStorage.getItem(`${siteName}_cart`);
      // Ensure cartItems is always an array
      setCartItems(storedCartItems ? JSON.parse(storedCartItems) : []);
    }
  }, []); // Empty dependency array ensures this only runs once on mount

  // Fetch product data whenever cartItems change
  useEffect(() => {
    if (cartItems.length > 0) {
      const productIds = cartItems
        .map((product) => product.product_id)
        .join(",");
      fetch(
        `${apiUrl}wp-json/wc/v3/products${woocommerceKey}&include=${productIds}`
      )
        .then((res) => res.json())
        .then((data) => {
          setCartListedItems(data);
        })
        .catch((error) => {
          console.error("Error fetching product data:", error);
        });
    }
  }, [cartItems]); // This effect runs when cartItems changes

  // Calculate the subtotal and shipping charge
  useEffect(() => {
    if (cartListedItems.length > 0 && cartItems.length > 0) {
      const filteredData = cartListedItems
        .map((product) => {
          const cartItem = cartItems.find(
            (item) => item.product_id === product.id
          );
          if (cartItem) {
            const price = parseFloat(product.price);
            return {
              ...product,
              totalPrice: price * cartItem.quantity,
              quantity: cartItem.quantity,
            };
          }
          return null;
        })
        .filter((item) => item !== null);

      const subtotal = filteredData.reduce(
        (total, item) => total + item.totalPrice,
        0
      );
      setCartSubTotal(subtotal);

      // Check shipping charge based on subtotal
      //setHaveShippingCharge(subtotal < shippingChargeLimit);
    }
  }, [cartListedItems, cartItems]); // This effect depends on both cartItems and cartListedItems

  // Update localStorage whenever cartItems change
  useEffect(() => {
    if (typeof window !== "undefined" && cartItems.length > 0) {
      localStorage.setItem(`${siteName}_cart`, JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (item) => {
    const updatedCartItems = [...cartItems, item];
    setCartItems(updatedCartItems);
  };

  const removeFromCart = (itemId) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCartItems);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        cartItems,
        setCartItems,
        cartSubTotal,
        setCartSubTotal,
        couponCode,
        setCouponCode,
        couponCodeName,
        setCouponCodeName,
        eligibleFreeShipping, setEligibleFreeShipping,
        discount,
        discountType,
        setDiscountType,
        setDiscount,
        addToCart,
        removeFromCart,
        cartTotal,
        setCartTotal,
        couponData,
        setCouponData,
        guestUser,
        refundable, 
        payAmount,
        vatAmount, setVatAmount,
        setPayAmount,
        setRefundable,
        setGuestUser,
        guestUserData,
        finalDiscount, setFinalDiscount,
        maximumCouponApplied, 
        setMaximumCouponApplied,
        setGuestUserData,
        guestUserDataValidation,
        setGuestUserDataValidation,
        cartListedItems,
        setCartListedItems,
        haveShippingCharge,
        setHaveShippingCharge,
        vat, setVat,
        price, setPrice,
        shippingCharge, setShippingCharge
      }}

    
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  return useContext(CartContext);
}
