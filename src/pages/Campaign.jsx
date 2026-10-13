import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import CampaignHero from "../components/CampaignHero.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { deals } from "../api/endpoints.js";
import { paginated } from "../utils/product.js";

/** /campaign/:slug - one running campaign and all its products at the campaign price. */
export default function Campaign() {
  const { slug } = useParams();
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [slug]);

  const { data, loading, error, reload } = useAsync(
    (signal) => deals.campaign(slug, { page, per_page: 24 }, { signal }),
    [slug, page],
  );
  const campaign = data?.campaign;
  const { rows, lastPage } = paginated(data?.products);

  useEffect(() => {
    if (campaign?.title) document.title = campaign.title;
  }, [campaign?.title]);

  const goPage = (n) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 404 = not running any more (ended, not started yet, or taken down)
  const ended = error?.status === 404;

  return (
    <section className="section campaign-page">
      <div className="container-x">
        <nav className="breadcrumb-x"><Link to="/">Home</Link> <span>/</span> <Link to="/shop">Shop</Link> <span>/</span> <span>{campaign?.title || "Campaign"}</span></nav>

        {loading && !data ? (
          <div className="text-center text-mute py-5">Loading…</div>
        ) : ended ? (
          <div className="empty-state">
            <div className="ico"><i className="bi bi-hourglass-bottom"></i></div>
            <h5>এই ক্যাম্পেইন শেষ হয়ে গেছে</h5>
            <p>এর বিশেষ দাম আর পাওয়া যাবে না, তবে শপে আরও অনেক পণ্য আছে।</p>
            <Link className="btn btn-accent btn-pill" to="/shop">কেনাকাটা চালিয়ে যান</Link>
          </div>
        ) : error ? (
          <div className="empty-note">
            {error.message} <button type="button" className="btn btn-soft ms-2" onClick={reload}>Retry</button>
          </div>
        ) : campaign && (
          <>
            <CampaignHero campaign={campaign} linked={false} as="h1" onEnd={reload} />

            {rows.length ? (
              <div className="grid-products mt-4">
                {rows.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="empty-note mt-4">এই ক্যাম্পেইনে এখন কোনো পণ্য নেই।</div>
            )}

            {lastPage > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <div className="pagination-x">
                  <a className="pg" href="#" aria-label="Previous page" onClick={(e) => { e.preventDefault(); if (page > 1) goPage(page - 1); }}>
                    <i className="bi bi-chevron-left"></i>
                  </a>
                  {Array.from({ length: lastPage }, (_, i) => (
                    <a key={i} className={"pg" + (page === i + 1 ? " active" : "")} href="#" onClick={(e) => { e.preventDefault(); goPage(i + 1); }}>
                      {i + 1}
                    </a>
                  ))}
                  <a className="pg" href="#" aria-label="Next page" onClick={(e) => { e.preventDefault(); if (page < lastPage) goPage(page + 1); }}>
                    <i className="bi bi-chevron-right"></i>
                  </a>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
