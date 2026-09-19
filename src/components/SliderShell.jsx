import { useRef } from "react";

/* prev / next button soho slider wrapper — children ke (prevRef, nextRef) pathay */
export default function SliderShell({ children }) {
  const prev = useRef(null);
  const next = useRef(null);
  return (
    <div className="slider-shell">
      {children({ prev, next })}
      <button className="swiper-nav prev" ref={prev}><i className="bi bi-chevron-left"></i></button>
      <button className="swiper-nav next" ref={next}><i className="bi bi-chevron-right"></i></button>
    </div>
  );
}
