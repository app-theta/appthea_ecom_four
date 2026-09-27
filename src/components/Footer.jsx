import { Link } from "react-router-dom";
import { useState } from "react";
import { useBusiness } from "../context/BusinessContext.jsx";
import { useSubscribe } from "../hooks/useSubscribe.js";

export default function Footer() {
  const { info, features } = useBusiness();
  const [email, setEmail] = useState("");
  const newsletter = useSubscribe();
  const name = info?.name || "AppTheta Ecom";
  const address = [info?.address, info?.area, info?.city].filter(Boolean).join(", ");

  const socials = [
    info?.facebook_link && { label: "Facebook", href: info.facebook_link, icon: "bi-facebook" },
    info?.instagram_link && { label: "Instagram", href: info.instagram_link, icon: "bi-instagram" },
    info?.youtube_link && { label: "YouTube", href: info.youtube_link, icon: "bi-youtube" },
    info?.linkedin_link && { label: "LinkedIn", href: info.linkedin_link, icon: "bi-linkedin" },
    info?.x_link && { label: "X", href: info.x_link, icon: "bi-twitter-x" },
  ].filter(Boolean);

  return (
    <footer className="site-footer">
      <div className="container-x">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <Link className="brand" to="/">{name}</Link>
            <h6>About Us</h6>
            <p style={{ maxWidth: 320 }}>
              Your trusted online shopping platform for quality products, secure ordering and fast delivery across Bangladesh.
            </p>
            {features.is_subscribe_newsletter && (
              newsletter.done ? (
                <p className="mb-0">Thanks for subscribing!</p>
              ) : (
                <form className="d-flex gap-2 footer-subscribe" style={{ maxWidth: 360 }} onSubmit={(e) => { e.preventDefault(); newsletter.subscribe(email); }}>
                  <input type="email" className="form-control" placeholder="Your email for news &amp; offers" aria-label="Email address" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  <button type="submit" className="btn btn-accent" disabled={newsletter.busy}>Subscribe</button>
                </form>
              )
            )}
            {newsletter.error && <p className="mb-0 mt-1" style={{ fontSize: "var(--fs-xs)" }}>{newsletter.error}</p>}
          </div>
          <div className="col-lg-2 col-md-6">
            <h6>Customer Service</h6>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms &amp; Conditions</Link></li>
              <li><Link to="/shipping-policy">Shipping Policy</Link></li>
              <li><Link to="/refund-policy">Refund Policy</Link></li>
              <li><Link to="/return-policy">Return Policy</Link></li>
              <li><Link to="/track-order">Track Order</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/account">My Account</Link></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <h6>Social Media</h6>
            {socials.length ? (
              <div className="social-row">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                    <span className="ico"><i className={"bi " + s.icon}></i></span> {s.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
          <div className="col-lg-3 col-md-6">
            <h6>Contact Info</h6>
            <ul>
              {info?.phone && <li><span className="contact-row"><i className="bi bi-telephone"></i> <a href={`tel:${info.phone}`}>{info.phone}</a></span></li>}
              {info?.email && <li><span className="contact-row"><i className="bi bi-envelope"></i> <a href={`mailto:${info.email}`}>{info.email}</a></span></li>}
              {address && <li><span className="contact-row"><i className="bi bi-geo-alt"></i> {address}</span></li>}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Copyright © {new Date().getFullYear()} {name}. All rights reserved.</span>
          <span>A product of <b>AppTheta</b></span>
        </div>
      </div>
    </footer>
  );
}
