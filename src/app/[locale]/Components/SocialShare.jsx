"use client";

import {
  EmailShareButton,
  FacebookShareButton,
  GabShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WorkplaceShareButton,
} from "react-share";

import {
  EmailIcon,
  FacebookIcon,
  FacebookMessengerIcon,
  GabIcon,
  HatenaIcon,
  InstapaperIcon,
  LineIcon,
  LinkedinIcon,
  LivejournalIcon,
  MailruIcon,
  OKIcon,
  PinterestIcon,
  PocketIcon,
  RedditIcon,
  TelegramIcon,
  TumblrIcon,
  TwitterIcon,
  ViberIcon,
  VKIcon,
  WeiboIcon,
  WhatsappIcon,
  WorkplaceIcon,
  XIcon,
} from "react-share";


import { useLanguageContext } from "../Context/LanguageContext";
import { getTranslation, siteName } from "../Utils/variables";
import { useParams, useRouter } from "next/navigation";

export default function SocialShare({ url, title,  }) {

    const router = useRouter();
    const params = useParams();  
    const locale = params.locale; 

  const { translation } = useLanguageContext();

  return (
    <>
      <small className="opacity-50 mb-3 block">
        {getTranslation(translation[0]?.translations, "Share with", locale || 'en')}
      </small>
      <div className="flex gap-2">
        <FacebookShareButton url={url} quote={title}>
          <i className="bi bi-facebook share-icon"></i>
        </FacebookShareButton>
        <TwitterShareButton url={url} quote={title}>
          <i className="bi bi-twitter share-icon"></i>
        </TwitterShareButton>
        <WhatsappShareButton url={url} quote={title}>
          <i className="bi bi-whatsapp share-icon"></i>
        </WhatsappShareButton>
      </div>
    </>
  );
}
