import React, { createContext, useState } from "react";

// Translations for English and Urdu
const translations = {
  en: {
    title: "Ramadan Travel Assistant",
    currentLocation: "Current Location",
    destination: "Destination",
    iftarOffset: "Iftar Time Offset (minutes)",
    iftarOffsetHint: "Add an offset if Iftar time differs from Maghrib time.",
    checkJourney: "Check Journey",
    useCurrentLocation: "Use Current Location",
    iftarTime: "Iftar Time",
    travelDuration: "Travel Duration",
    recommendation: "Recommendation",
    safeToTravel: "✅ You can reach your destination before Iftar!",
    notSafeToTravel: "⚠️ You won't reach your destination before Iftar. Consider leaving earlier or breaking your fast on the way.",
    error: "An error occurred. Please try again.",
    placeNotFound: "Place not found",
    invalidCoordinates: "Invalid coordinates. Please check your inputs.",
    couldNotGeocode: "Could not geocode place",
    couldNotGetLocation: "Could not get current location",
    attribution: "Uses free services from:",
    aladhan: "Aladhan Prayer Times API",
    osrm: "OSRM Routing Engine",
    nominatim: "Nominatim Geocoding",
  },
  ur: {
    title: "رمضان ٹریول اسسٹنٹ",
    currentLocation: "موجودہ مقام",
    destination: "منزل",
    iftarOffset: "افطار کا وقت آفسیٹ (منٹ)",
    iftarOffsetHint: "اگر افطار کا وقت مغرب سے مختلف ہو تو آفسیٹ شامل کریں۔",
    checkJourney: "سفر چیک کریں",
    useCurrentLocation: "موجودہ مقام استعمال کریں",
    iftarTime: "افطار کا وقت",
    travelDuration: "سفر کی مدت",
    recommendation: "تجویز",
    safeToTravel: "✅ آپ اپنی منزل تک افطار سے پہلے پہنچ سکتے ہیں!",
    notSafeToTravel: "⚠️ آپ اپنی منزل تک افطار سے پہلے نہیں پہنچ پائیں گے۔ جلدی روانہ ہونے یا راستے میں افطار کرنے پر غور کریں۔",
    error: "ایک خرابی پیش آگئی۔ براہ کرم دوبارہ کوشش کریں۔",
    placeNotFound: "مقام نہیں ملا",
    invalidCoordinates: "غلط کوآرڈینیٹس۔ براہ کرم اپنے ان پٹ چیک کریں۔",
    couldNotGeocode: "مقام کو کوآرڈینیٹس میں تبدیل نہیں کیا جا سکا",
    couldNotGetLocation: "موجودہ مقام حاصل نہیں کیا جا سکا",
    attribution: "مندرجہ ذیل مفت خدمات استعمال کرتا ہے:",
    aladhan: "الاذان نماز کے اوقات API",
    osrm: "OSRM روٹنگ انجن",
    nominatim: "نومیناٹم جیوکوڈنگ",
  },
};

// Create a context for language
export const LanguageContext = createContext();

export const LanguageSwitcher = ({ children }) => {
  const [language, setLanguage] = useState("en"); // Default language is English

  // Toggle language between English and Urdu
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ur" : "en"));
  };

  // Get translations based on the current language
  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ t, language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};