"use client";
import { useEffect, useRef, useState } from "react";
import "react-country-state-city/dist/react-country-state-city.css";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import {
  apiUrl,
  getTranslation,
} from "../../Utils/variables";
import Alerts from "../Alerts";
import { useAuthContext } from "../../Context/authContext";
import FloatingLabelInput from "../FloatingLabelInput";
import { useJwt } from "../../Context/jwtContext";
import "ol/ol.css";
import { Map } from "ol";
import { View } from "ol";
import { Tile } from "ol/layer";
import { OSM } from "ol/source";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { fromLonLat, toLonLat } from "ol/proj";
import { Icon, Style } from "ol/style";
import { useLanguageContext } from "../../Context/LanguageContext";
import { userId } from "../../Utils/UserInfo";
import LoadingItem from "../LoadingItem";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

export default function UpdateAddressForm({ addressCount }) {
  const id = useParams();

  const router = useRouter();
  const params = useParams();  
  const locale = params.locale; 

  const [updateAddress, setUpdateAddress] = useState([]);

  const fetchAddressData = async () => {
    try {
      const response = await fetch(
        `${apiUrl}wp-json/custom/v1/customer/${userId}/get-address/${id?.id}`
      );
      const data = await response.json();
      setUpdateAddress(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAddressData();
  }, [updateAddress]);


  const { translation } = useLanguageContext();

  const mapRef = useRef(null); // Reference for the map container
  const [coordinates, setCoordinates] = useState({
    longitude: null,
    latitude: null,
  });

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [map, setMap] = useState(null);

  const { userData } = useAuthContext();

  // const [region, setRegion] = useState("");
  // const [countryid, setCountryid] = useState(0);
  // const [stateid, setstateid] = useState(0);
  const [country, setCountry] = useState("United Arab Emirates");
  const [street, setStreet] = useState("");
  const [houseName, setHousename] = useState("");
  const [state, setstate] = useState("");
  const [city, setCity] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");

  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { token } = useJwt();

  useEffect(() => {
    setstate(state);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const requestData = {
      meta_data: [
        {
          key: "additional_addresses",
          value: {
            full_name: firstName || updateAddress?.full_name,
            last_name: "",
            company: "",
            country: country || updateAddress?.country,
            address_1: houseName || updateAddress?.address_1,
            address_2: houseName || updateAddress?.address_1,
            landmark: "" || "",
            state: state || updateAddress?.state,
            city: city || updateAddress?.city,
            pincode: "" || "",
            phone: phone || updateAddress?.phone,
            id: parseInt(id?.id),
          },
        },
      ],
    };

    // {
    //   address: {
    //     firstName: firstName || updateAddress?.full_name,
    //     lastName: "",
    //     country: country || updateAddress?.country,
    //     houseName: houseName || updateAddress?.address_1,
    //     street: street || updateAddress?.address_2,
    //     landmark: "" || updateAddress?.landmark,
    //     state: state || updateAddress?.state,
    //     city: city || updateAddress?.city,
    //     pinCode: "" || updateAddress?.pincode,
    //     phone: phone || updateAddress?.phone,
    //   },
    // };

    try {
      // Submit the review
      const response = await fetch(
        `${apiUrl}wp-json/custom/v1/customer/${userId}/update-address?address_id=${id?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        //  onAddressAdded();
        setLoading(false);
        setStatus(true);

        setTimeout(() => {
          setStatus(false);
        }, 1000);

        setCountry("");
        setstate("");
        setCity("");
        setFirstName("");
        setPhone("");
        setStreet("");
        setHousename("");

        router.back();
        
      } else {
        const errorResponse = await response.json();
        console.error(
          "Failed to submit review",
          response.status,
          errorResponse
        );
        setError(true);
        setLoading(false);
        setStatus(false);
      }
    } catch (error) {
      setError(true);
      setLoading(false);
      setStatus(false);
      console.error("An error occurred:", error);
    } finally {
    }
  };

  //LOCATION CHOOSE

  
  // List of GCC countries
  const gccCountries = [
    "Bahrain",
    "Kuwait",
    "Oman",
    "Qatar",
    "Saudi Arabia",
    "United Arab Emirates",
  ];

  // Function to fetch address from Nominatim API
  const fetchAddress = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
      );
      const data = await response.json();
      if (data && data.address) {
        const { address } = data;
        const country = address.country || "";
        if (gccCountries.includes(country)) {
          setAddress({
            street: address.road || "",
            city: address.city || address.town || address.village || "",
            state: address.state || "",
            country: country,
            pincode: address.postcode || "", // Adding pincode (postal code)
          });

          // Set individual address components
          setCountry(address.country);
          setStreet(address.road || "");
          setstate(address.state || "");
          setCity(address.city || "");
        } else {
          // Skip the map update for non-GCC countries
          console.log(`Location is outside GCC countries: ${country}`);
        }
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // Function to get user's geolocation
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6),
          });
          fetchAddress(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          const fallbackLatitude = 24.7136; // Example for Riyadh, Saudi Arabia
          const fallbackLongitude = 46.6753;
          setCoordinates({
            latitude: fallbackLatitude.toFixed(6),
            longitude: fallbackLongitude.toFixed(6),
          });
          fetchAddress(fallbackLatitude, fallbackLongitude);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      const fallbackLatitude = 24.7136; // Example for Riyadh, Saudi Arabia
      const fallbackLongitude = 46.6753;
      setCoordinates({
        latitude: fallbackLatitude.toFixed(6),
        longitude: fallbackLongitude.toFixed(6),
      });
      fetchAddress(fallbackLatitude, fallbackLongitude);
    }
  };

  // Handle the search functionality
  const handleSearch = async () => {
    if (searchQuery) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json&addressdetails=1`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          const firstResult = data[0];
          const { lat, lon } = firstResult;

          setCoordinates({
            latitude: lat,
            longitude: lon,
          });

          fetchAddress(lat, lon);

          // Only update the map for GCC countries
          if (gccCountries.includes(firstResult.address.country)) {
            // If map is initialized, update the map center and zoom
            if (map) {
              const view = map.getView();
              view.setCenter(fromLonLat([lon, lat]));
              view.setZoom(15);
            }

            // Add a marker at the searched location
            const marker = new Feature({
              geometry: new Point(fromLonLat([lon, lat])),
            });

            const iconStyle = new Style({
              image: new Icon({
                anchor: [0.5, 1],
                src: `https://cdn-icons-png.flaticon.com/512/9356/9356230.png`,
                scale: 0.1,
              }),
            });

            marker.setStyle(iconStyle);

            const vectorSource = new VectorSource({
              features: [marker],
            });

            const markerLayer = new VectorLayer({
              source: vectorSource,
            });

            // Remove any previous marker layers before adding the new one
            map.getLayers().forEach((layer) => {
              if (layer instanceof VectorLayer) {
                map.removeLayer(layer);
              }
            });

            map.addLayer(markerLayer);
          } else {
            console.log("Location is outside GCC countries.");
          }
        } else {
          // alert("Location not found.");
        }
      } catch (error) {
        console.error("Error during search:", error);
        // alert("Error searching location");
      }
    }
  };

  useEffect(() => {
    // Initialize the map on mount
    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new Tile({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    // Set the map state once the map is initialized
    setMap(initialMap);

    // Get the user's location when the component mounts
    getUserLocation();

    // Event listener to handle clicks on the map
    initialMap.on("click", (event) => {
      const coords = event.coordinate;
      const lonLat = toLonLat(coords);

      setCoordinates({
        longitude: lonLat[0].toFixed(6),
        latitude: lonLat[1].toFixed(6),
      });

      fetchAddress(lonLat[1], lonLat[0]);

      // Only add marker for GCC countries
      const country = event.coordinate; // Add logic to fetch country if needed

      if (gccCountries.includes(country)) {
        const marker = new Feature({
          geometry: new Point(coords),
        });

        const iconStyle = new Style({
          image: new Icon({
            anchor: [0.5, 1],
            src: "/images/map_pin.svg",
            scale: 0.2,
          }),
        });

        marker.setStyle(iconStyle);

        const vectorSource = new VectorSource({
          features: [marker],
        });

        const markerLayer = new VectorLayer({
          source: vectorSource,
        });

        initialMap.getLayers().forEach((layer) => {
          if (layer instanceof VectorLayer) {
            initialMap.removeLayer(layer);
          }
        });

        initialMap.addLayer(markerLayer);
      }
    });

    return () => {
      initialMap.setTarget(null);
    };
  }, []);


   // List of important places in the GCC region
   const places = [
    { id: 0, name: "Dubai" },
    { id: 1, name: "Abu Dhabi" },
    { id: 2, name: "Sharjah" },
    { id: 3, name: "Ajman" },
    { id: 4, name: "Fujairah" },
    { id: 5, name: "Ras Al Khaimah" },
    { id: 6, name: "Al Ain" },
    { id: 7, name: "Al Barsha" },
    { id: 8, name: "Deira" },
    { id: 9, name: "Business Bay" },
    { id: 10, name: "Jumeirah" },
    { id: 11, name: "Dubai Marina" },
    { id: 12, name: "Palm Jumeirah" },
    { id: 13, name: "Dubai Silicon Oasis" },
    { id: 14, name: "Dubai Internet City" },
    { id: 15, name: "Dubai Media City" },
    { id: 16, name: "Al Garhoud" },
    { id: 17, name: "Al Nahda" },
    { id: 18, name: "Mirdif" },
    { id: 19, name: "Al Quoz" },
    { id: 20, name: "International City" },
    { id: 21, name: "Al Warqa" },
    { id: 22, name: "Jumeirah Beach" },
    { id: 23, name: "Burj Khalifa" },
    { id: 24, name: "Dubai Creek" },
    { id: 25, name: "Jumeirah Village" },
    { id: 26, name: "Al Karama" },
    { id: 27, name: "Al Safa" },
    { id: 28, name: "Al Mizhar" },
    { id: 29, name: "Al Khawaneej" },
    { id: 30, name: "Al Jaddaf" },
    { id: 31, name: "Al Qusais" },
    { id: 32, name: "Al Mamzar" },
    { id: 33, name: "Al Bada'a" },
    { id: 34, name: "Satwa" },
    { id: 35, name: "Emirates Hills" },
    { id: 36, name: "Motor City" },
    { id: 37, name: "Dubai Sports City" },
    { id: 38, name: "Green Community" },
    { id: 39, name: "Downtown Dubai" },
    { id: 40, name: "Al Hudaiba" },
    { id: 41, name: "Al Rashidiya" },
    { id: 42, name: "Al Quoz 1" },
    { id: 43, name: "Al Quoz 2" },
    { id: 44, name: "Al Quoz 3" },
    { id: 45, name: "Al Quoz 4" },
    { id: 46, name: "Jumeirah Lakes Towers" },
    { id: 47, name: "Dubai Design District" },
    { id: 48, name: "Dubai Investment Park" },
    { id: 49, name: "Al Khobar" },
    { id: 50, name: "Al Barsha South" },
    { id: 51, name: "Al Warqa 1" },
    { id: 52, name: "Al Warqa 2" },
    { id: 53, name: "Al Warqa 3" },
    { id: 54, name: "Al Warqa 4" },
    { id: 55, name: "Nad Al Hammar" },
    { id: 56, name: "Al Ruwaya" },
    { id: 57, name: "Al Garhoud" },
    { id: 58, name: "Al Shaab" },
    { id: 59, name: "Al Ittihad Road" },
    { id: 60, name: "Khalidiyah" },
    { id: 61, name: "Al Rashidiya" },
    { id: 62, name: "Umm Suqeim" },
    { id: 63, name: "Al Manara" },
    { id: 64, name: "Al Furjan" },
    { id: 65, name: "Al Nahda 1" },
    { id: 66, name: "Al Nahda 2" },
    { id: 67, name: "Al Nahda 3" },
    { id: 68, name: "Silicon Oasis" },
    { id: 69, name: "Dubai Hills Estate" },
    { id: 70, name: "Jumeirah Park" },
    { id: 71, name: "Dubai South" },
    { id: 72, name: "Al Maktoum International Airport" },
    { id: 73, name: "Dubai World Trade Center" },
    { id: 74, name: "Dubai Design District" },
    { id: 75, name: "Dubai Creek Harbour" },
    { id: 76, name: "Dubai International Financial Center" },
    { id: 77, name: "Dubai Marina Walk" },
    { id: 78, name: "Meydan" },
    { id: 79, name: "Dubai Healthcare City" },
    { id: 80, name: "Dubai International Airport" },
    { id: 81, name: "Al Jumeirah" },
    { id: 82, name: "Al Qudra" },
    { id: 83, name: "Al Fisht" },
    { id: 84, name: "Al Safa 2" },
    { id: 85, name: "Al Wasl" },
    { id: 86, name: "Al Raffa" },
    { id: 87, name: "Dubai Festival City" },
    { id: 88, name: "Business Bay" },
    { id: 89, name: "Al Qasba" },
    { id: 90, name: "Tecom" },
    { id: 91, name: "Al Bada'a" },
    { id: 92, name: "Al Awir" },
    { id: 93, name: "Dubai Pearl" },
    { id: 94, name: "Dubai Hills" },
    { id: 95, name: "Umm Al Quwain" },
    { id: 96, name: "Doha" },
    { id: 97, name: "Lusail" },
    { id: 98, name: "Al Dafna" },
    { id: 99, name: "West Bay" },
    { id: 100, name: "Al Sadd" },
    { id: 101, name: "The Pearl-Qatar" },
    { id: 102, name: "Al Wakrah" },
    { id: 103, name: "Mushereib" },
    { id: 104, name: "Al Rayyan" },
    { id: 105, name: "Al Khor" },
    { id: 106, name: "Al Thumama" },
    { id: 107, name: "Muaither" },
    { id: 108, name: "Al Hilal" },
    { id: 109, name: "Al Gharaffa" },
    { id: 110, name: "Al Nasr" },
    { id: 111, name: "Al Duhail" },
    { id: 112, name: "Al Wukair" },
    { id: 113, name: "Al Shamal" },
    { id: 114, name: "Al Muntazah" },
    { id: 115, name: "Al Jelaiah" },
    { id: 116, name: "Al Qassar" },
    { id: 117, name: "Barwa City" },
    { id: 118, name: "Al Wakrah Souq" },
    { id: 119, name: "Doha Corniche" },
    { id: 120, name: "Al Fardah" },
    { id: 121, name: "Fereej Bin Mahmoud" },
    { id: 122, name: "Al Matar Al Qadeem" },
    { id: 123, name: "Fereej Al Soudan" },
    { id: 124, name: "Al Ghanim" },
    { id: 125, name: "Muaither South" },
    { id: 126, name: "Abu Hamour" },
    { id: 127, name: "Al Nasser" },
    { id: 128, name: "Bin Omran" },
    { id: 129, name: "Al Wadi" },
    { id: 130, name: "Al Luqta" },
    { id: 131, name: "Al Doha" },
    { id: 132, name: "Al Madinat Khalifa" },
    { id: 133, name: "Al Khor Corniche" },
    { id: 134, name: "Al Aziziya" },
    { id: 135, name: "Al Mesila" },
    { id: 136, name: "Al Jasra" },
    { id: 137, name: "Al Maamoura" },
    { id: 138, name: "Umm Salal" },
    { id: 139, name: "Musherib" },
    { id: 140, name: "Mekaines" },
    { id: 141, name: "Ain Khaled" },
    { id: 142, name: "Fereej Al Fikrit" },
    { id: 143, name: "Salwa" },
    { id: 144, name: "Mesaimeer" },
    { id: 145, name: "Al Sayliyah" },
    { id: 146, name: "Al Maidan" },
    { id: 147, name: "Al Jaidah" },
    { id: 148, name: "Doha Festival City" },
    { id: 149, name: "Doha Souq Waqif" },
    { id: 150, name: "Qatar University" },
    { id: 151, name: "Al Markhiya" },
    { id: 152, name: "Al Rayyan Stadium" },
    { id: 153, name: "Al Soudan" },
    { id: 154, name: "Al Rayyan Souq" },
    { id: 155, name: "Al Seer" },
    { id: 156, name: "Al Mutayr" },
    { id: 157, name: "Al Mukhayyam" },
    { id: 158, name: "Umm Salal Ali" },
    { id: 159, name: "Umm Salal Mohammed" },
    { id: 160, name: "Al Shakab" },
    { id: 161, name: "Wadi Msheireb" },
    { id: 162, name: "Al Muaither" },
    { id: 163, name: "Saddd" },
    { id: 164, name: "Sama" },
    { id: 165, name: "Qatar Sports Club" },
    { id: 166, name: "Ain Khaled" },
    { id: 167, name: "Al Hidd" },
    { id: 168, name: "Mesaimeer Industrial Area" },
    { id: 169, name: "Doha Port" },
  ];

  const handleOnSearch = (string, results) => {
    setSearchQuery(string);
  };

  const handleOnSelect = (item) => {
    setSearchQuery(item?.name);
  };

  const formatResult = (item) => {
    return (
      <>
        <span style={{ display: "block", textAlign: "left" }}>{item.name}</span>
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="none" style={{

    opacity:  updateAddress?.length === 0 && '0.3',
    pointerEvents:  updateAddress?.length === 0 && 'none'
     

    }}>
        <div className="grid gap-8">
          {status && (
            <Alerts
              status="green"
              title={getTranslation(
                translation[0]?.translations,
                "You have successfully added your new address.",
                locale || 'en'
              )}
            />
          )}
          {error && (
            <Alerts
              status="red"
              title={getTranslation(
                translation[0]?.translations,
                "There was an issue adding your new address. Please try again.",
                locale || 'en'
              )}
            />
          )}
          <FloatingLabelInput
            defaultValue={
              (updateAddress && updateAddress?.full_name) ||
              updateAddress?.shipping?.firstName
            }
            type="text"
            className="input"
            label={getTranslation(
              translation[0]?.translations,
              "Full Name",
              locale || 'en'
            )}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoComplete="none"
          />

          <FloatingLabelInput
            defaultValue={
              (updateAddress && updateAddress?.phone) ||
              updateAddress?.shipping?.phone
            }
            type="number"
            className="input"
            label={getTranslation(
              translation[0]?.translations,
              "Contact Number",
              locale || 'en'
            )}
            onChange={(e) => setPhone(e.target.value)}
            required
            autoComplete="none"
          />

          <div className="grid gap-5">
            <small className="uppercase text-sm font-light text-primary flex w-full">
              {getTranslation(
                translation[0]?.translations,
                "Select address from map",
                locale || 'en'
              )}
            </small>

            <div className="relative flex w-full z-10">
                      <div className="w-full">
                        <ReactSearchAutocomplete
                          items={places}
                          onSearch={handleOnSearch}
                          onSelect={handleOnSelect}
                          formatResult={formatResult}
                          value={searchQuery}
                          // onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
          
                      {/* <input
                        type="text"
                        placeholder={getTranslation(
                          translation[0]?.translations,
                          "Search for a location",
                          locale
                        )}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input join-item w-full"
                      /> */}
                      <button
                        className="btn join-item border border-border"
                        type="button"
                        onClick={handleSearch}
                      >
                        {getTranslation(translation[0]?.translations, "Search", locale)}
                      </button>
                    </div>

            <div
              id="map"
              ref={mapRef}
              className="w-full min-h-[50vh] border border-border relative"
            ></div>
          </div>
          <FloatingLabelInput
            defaultValue={
              (updateAddress && updateAddress?.address_1) ||
              updateAddress?.shipping?.address_1
            }
            type="text"
            className="input"
            label={getTranslation(
              translation[0]?.translations,
              "Address",
              locale || 'en'
            )}
            onChange={(e) => setHousename(e.target.value)}
            required
            autoComplete="none"
            value={houseName}
          />

          <FloatingLabelInput
            defaultValue={street}
            type="text"
            className="input"
            label={getTranslation(
              translation[0]?.translations,
              "Street",
              locale || 'en'
            )}
            onChange={(e) => setStreet(e.target.value)}
            required
            autoComplete="none"
            value={street}
          />

          <FloatingLabelInput
            defaultValue={city}
            type="text"
            className="input"
            label={getTranslation(
              translation[0]?.translations,
              "City",
              locale || 'en'
            )}
            onChange={(e) => setCity(e.target.value)}
            required
            autoComplete="none"
            value={city}
          />

          <FloatingLabelInput
            defaultValue={state}
            type="text"
            className="input"
            label={getTranslation(
              translation[0]?.translations,
              "State",
              locale || 'en'
            )}
            onChange={(e) => setstate(e.target.value)}
            required
            autoComplete="none"
            value={state}
          />

          {/* <FloatingLabelInput
            defaultValue={country}
            type="text"
            className="input"
            label={getTranslation(
              translation[0]?.translations,
              "Country",
              locale || 'en'
            )}
            onChange={(e) => setCountry(e.target.value)}
            required
            autoComplete="none"
            value={country}
          /> */}

<div className="w-full">
          {/* <label className=" bg-white block mb-2 transform transition-all cursor-pointer text-start label-input w-fit   uppercase text-primary  text-[12px] ">
            {getTranslation(translation[0]?.translations, "Country", locale)}
          </label> */}
          <select
            className="input w-full"
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value={country} selected>
              {getTranslation(translation[0]?.translations, country, locale)}
            </option>
            <option value="Bahrain">
              {getTranslation(translation[0]?.translations, "Bahrain", locale)}
            </option>
            <option value="Kuwait">
              {getTranslation(translation[0]?.translations, "Kuwait", locale)}
            </option>
            <option value="Oman">
              {getTranslation(translation[0]?.translations, "Oman", locale)}
            </option>
            <option value="Qatar">
              {getTranslation(translation[0]?.translations, "Qatar", locale)}
            </option>
            <option value="Saudi Arabia">
              {getTranslation(
                translation[0]?.translations,
                "Saudi Arabia",
                locale
              )}
            </option>
            <option value="United Arab Emirates">
              {getTranslation(
                translation[0]?.translations,
                "United Arab Emirates",
                locale
              )}
            </option>
          </select>
        </div>

          <div>
            <button 
             disabled={loading}
            className="btn btn-primary btn-mobile-full" type="submit">
              {loading ? (
                <>
                  <LoadingItem dot classes="bg-white size-4" />
                  {getTranslation(
                    translation[0]?.translations,
                    "Update in progress...",
                    locale || 'en'
                  )}
                </>
              ) : (
                getTranslation(
                  translation[0]?.translations,
                  "Update Address",
                  locale || 'en'
                )
              )}
            </button>
          </div>
        </div>
 
    </form>
  );
}
