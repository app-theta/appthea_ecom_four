"use client";

/* This template's own pieces that the shared reels page (views/Reels.jsx) plugs into -
   the reels page itself is the same file in every storefront template. */
import { reels as reelsApi } from "../../api/endpoints.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useBusiness } from "../../context/BusinessContext.jsx";
import { headlinePrice } from "../../utils/product.js";
import { money } from "../../utils/format.js";

export { reelsApi };

// this template's shop texts are Bangla
const TEXT = {
  title: "রিলস",
  count: (n) => `${n}টি ভিডিও`,
  like: "লাইক",
  details: "বিস্তারিত দেখুন",
  views: "বার দেখা হয়েছে",
  close: "বন্ধ করুন",
  mute: "শব্দ বন্ধ",
  unmute: "শব্দ চালু",
  prev: "আগের রিল",
  next: "পরের রিল",
  empty: "এখনও কোনো রিল নেই।",
  retry: "আবার চেষ্টা করুন",
};

export function useReelsEnv() {
  const { isAuthed } = useAuth();
  const { features, currencySymbol } = useBusiness();
  return {
    isAuthed,
    enabled: Boolean(features.product_reels),
    text: TEXT,
    price: (product) => money(headlinePrice(product).now, currencySymbol),
  };
}
