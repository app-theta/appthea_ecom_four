import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useBusiness } from "../context/BusinessContext.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { home } from "../api/endpoints.js";
import { paginated, imageUrl } from "../utils/product.js";
import ProductCard from "../components/ProductCard.jsx";
import SectionHead from "../components/SectionHead.jsx";
import SliderShell from "../components/SliderShell.jsx";

export default function Home() {
  const { categories, sliders } = useBusiness();
  const summary = useAsync((signal) => home.summary({ per_page: 8 }, { signal }), []);
  const featuredRows = paginated(summary.data?.featured).rows;
  const latestRows = paginated(summary.data?.latest).rows;
  const topCategories = categories.filter((c) => !c.parent_id);

  return (
    <>
      {sliders.length > 0 && (
        <section className="hero">
          <div className="container-x">
            <SliderShell>
              {({ prev, next }) => (
                <Swiper
                  className="hero-slider"
                  modules={[Navigation, Pagination, Autoplay]}
                  loop={sliders.length > 1}
                  autoplay={{ delay: 4500, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  onBeforeInit={(s) => { s.params.navigation.prevEl = prev.current; s.params.navigation.nextEl = next.current; }}
                  navigation
                >
                  {sliders.map((s) => (
                    <SwiperSlide key={s.id}>
                      {s.url ? (
                        <a href={s.url}><img src={imageUrl(s.image)} alt={s.title || "banner"} /></a>
                      ) : (
                        <img src={imageUrl(s.image)} alt={s.title || "banner"} />
                      )}
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </SliderShell>
          </div>
        </section>
      )}

      {topCategories.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHead title="ক্যাটাগরি" sub="আপনার প্রয়োজনীয় পণ্য সহজে খুঁজে নিন" />
            <SliderShell>
              {({ prev, next }) => (
                <Swiper
                  modules={[Navigation]}
                  spaceBetween={14}
                  slidesPerView={2}
                  breakpoints={{ 576: { slidesPerView: 3 }, 768: { slidesPerView: 4 }, 992: { slidesPerView: 6 }, 1200: { slidesPerView: 8 } }}
                  onBeforeInit={(s) => { s.params.navigation.prevEl = prev.current; s.params.navigation.nextEl = next.current; }}
                  navigation
                >
                  {topCategories.map((c) => (
                    <SwiperSlide className="h-auto" key={c.slug}>
                      <Link className="cat-card" to={`/shop/${c.slug}`}>
                        <div className="thumb"><img src={imageUrl(c.image) || "/assets/img/ph-category.svg"} alt={c.name} /></div>
                        <h6>{c.name}</h6>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </SliderShell>
          </div>
        </section>
      )}

      {(summary.loading || featuredRows.length > 0) && (
        <section className="section pt-0">
          <div className="container-x">
            <SectionHead title="Hot Deal" sub="Limited-time picks and popular products" />
            <SliderShell>
              {({ prev, next }) => (
                <Swiper
                  modules={[Navigation]}
                  spaceBetween={14}
                  slidesPerView={2}
                  breakpoints={{ 768: { slidesPerView: 3 }, 992: { slidesPerView: 4 }, 1200: { slidesPerView: 6 } }}
                  onBeforeInit={(s) => { s.params.navigation.prevEl = prev.current; s.params.navigation.nextEl = next.current; }}
                  navigation
                >
                  {featuredRows.slice(0, 6).map((p) => (
                    <SwiperSlide className="h-auto" key={p.id}><ProductCard product={p} /></SwiperSlide>
                  ))}
                </Swiper>
              )}
            </SliderShell>
          </div>
        </section>
      )}

      <section className="section pt-0">
        <div className="container-x">
          <SectionHead title="সকল পন্য" sub="নতুন ও জনপ্রিয় পণ্য এক জায়গায়" />
          <div className="grid-products">
            {latestRows.slice(0, 15).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="text-center mt-4">
            <Link className="btn btn-ink btn-pill" to="/shop">সব পণ্য দেখুন</Link>
          </div>
        </div>
      </section>
    </>
  );
}
