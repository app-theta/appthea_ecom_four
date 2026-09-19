import { Link } from "react-router-dom";
import { SITE } from "../data/site.js";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-x">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <Link className="brand" to="/">{SITE.name}</Link>
            <h6>About Us</h6>
            <p style={{ maxWidth: 320 }}>
              Your trusted online shopping platform for quality products, secure ordering and fast delivery across Bangladesh.
            </p>
          </div>
          <div className="col-lg-2 col-md-6">
            <h6>Customer Service</h6>
            <ul>
              <li><Link to="/shop">Privace policy</Link></li>
              <li><Link to="/track-order">Track Order</Link></li>
              <li><Link to="/account">My Account</Link></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <h6>Social Media</h6>
            <div className="social-row">
              <a href="#"><span className="ico"><i className="bi bi-facebook"></i></span> Facebook</a>
              <a href="#"><span className="ico"><i className="bi bi-instagram"></i></span> Instagram</a>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <h6>Contact Info</h6>
            <ul>
              <li><span className="contact-row"><i className="bi bi-telephone"></i> {SITE.phone}</span></li>
              <li><span className="contact-row"><i className="bi bi-envelope"></i> {SITE.email}</span></li>
              <li><span className="contact-row"><i className="bi bi-geo-alt"></i> {SITE.address}</span></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Copyright © 2026 {SITE.name}. All rights reserved.</span>
          <span>A product of <b>AppTheta</b></span>
        </div>
      </div>
    </footer>
  );
}
