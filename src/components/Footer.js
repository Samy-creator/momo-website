import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="footer-container">
        <div className="footer-about">
          <h2 className="footer-logo">Momo’s</h2>
          <p>
            We’re a street style momo food truck serving bold flavors on the go.
            From steamed to tandoori, lava to Schezwan, we’ve got momos for
            every craving. Order now on{" "}
            <a
              href="https://www.swiggy.com"
              target="_blank"
              rel="noopener noreferrer">
              Swiggy
            </a>{" "}
            or{" "}
            <a
              href="https://www.zomato.com"
              target="_blank"
              rel="noopener noreferrer">
              Zomato
            </a>{" "}
            — hot, fresh, and delivered fast!
          </p>
        </div>

        <div className="footer-links">
          <div>
            <h3>Quick links</h3>
            <ul>
              <li>
                <a href="#menu">Menu</a>
              </li>
              <li>
                <a href="#about">Why choose us</a>
              </li>
              <li>
                <a href="#testimonial">Reviews</a>
              </li>
            </ul>
          </div>
          <div>
            <h3>Links</h3>
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#about">About us</a>
              </li>
              <li>
                <a href="#contact">Contact us</a>
              </li>
            </ul>
          </div>
          <div>
            <h3>Social</h3>
            <ul>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer">
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer">
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
