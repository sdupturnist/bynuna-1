'use client'

import { useState, useEffect } from "react";
import Button from "./Button";
import { getTranslation, siteName } from "../Utils/variables";
import { useLanguageContext } from "../Context/LanguageContext";
import { useParams, useRouter } from "next/navigation";


const ReadMore = ({ children, maxLength, btnpos, inMobile,  }) => {


  const router = useRouter();
  const params = useParams();  
  const locale = params.locale; 


    const { translation } = useLanguageContext();


  // Function to count words
  function countWords(paragraph) {
    const words = paragraph.trim().split(/\s+/);
    return words.length;
  }

  // Function to truncate the content based on the maxLength
  function truncateContent(content, maxLength) {
    const words = content.trim().split(/\s+/);
    if (words.length <= maxLength) return content; // No need to truncate
    return words.slice(0, maxLength).join(" ") + "..."; // Truncate and add ellipsis
  }

  const [isReadMore, setIsReadMore] = useState(false); // Initially show the truncated content
  const [isMobile, setIsMobile] = useState(false); // State to track mobile screen size

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore); // Toggle between full and truncated content
  };

  // Convert content into HTML, if it contains special characters like &nbsp;
  const convertToHtml = (content) => {
    const parts = content.split(/&nbsp;/).map((part) => {
      const trimmedPart = part.trim();
      if (/<(ul|ol)>/.test(part)) {
        return part.trim();
      }
      if (trimmedPart) {
        return `${trimmedPart}`;
      }
      return "";
    });
    return parts.join("");
  };

  const content =
    typeof children === "string" ? convertToHtml(children) : children;

  // Calculate word count
  const wordCount = countWords(content);

  // Truncate content if the word count exceeds maxLength
  const truncatedContent = truncateContent(content, maxLength);

  // Handle window resizing to detect mobile size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 575); // Check if the screen size is below 575px
    };

    handleResize(); // Initial check on mount
    window.addEventListener("resize", handleResize); // Add event listener to handle window resize

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup event listener on unmount
    };
  }, []);

  // If `inMobile` prop is true, apply Read More logic only below 575px
  if (inMobile && !isMobile) {
    return (
      <div
        className="overflow-hidden transition-all [&>*]:mb-[10px] duration-300"
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
    );
  }

  // If word count exceeds maxLength, show Read More button
  return wordCount > maxLength ? (
    <div className="mt-[10px] more-content grid gap-2 justify-start">
      <div
        className="readmore-content overflow-hidden transition-all [&>*]:mb-[10px] duration-300"
        dangerouslySetInnerHTML={{
          __html: isReadMore ? content : truncatedContent,
        }}
      />
      <button
        onClick={toggleReadMore}
        className={`${
          btnpos === "center" ? "mx-auto" : ""
        } text-primary text-left`}
      >
        {isReadMore ? getTranslation(translation[0]?.translations, "Show less", locale || 'en') :  getTranslation(translation[0]?.translations, "Read more", locale || 'en')}
      </button>
    </div>
  ) : (
    <div
      className="readmore-content overflow-hidden transition-all [&>*]:mb-[10px] duration-300"
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    />
  );
};

export default ReadMore;
