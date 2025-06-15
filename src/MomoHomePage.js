import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MomoHomePage.css";
import "./components/Hero.css";
import { FaUtensils } from "react-icons/fa";
import { MdDeliveryDining, MdPerson } from "react-icons/md";
import { BiFoodMenu } from "react-icons/bi";
import Footer from "./components/Footer";
import swiggyLogo from "./assets/swiggy.jpg";
import zomatoLogo from "./assets/zomato.png";
import Testimonial from "./components/testimonial";

export default function MomoHomePage({
  isLoggedIn,
  setIsLoggedIn,
  username,
  setUsername,
}) {
  const [category, setCategory] = useState("nonveg");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const vegGallery = [
    {
      name: "Fried momo",
      image: "./images/Fried momo.jpg",
      price: 120,
      rating: 4.8,
    },
    {
      name: "Thanduri malai",
      image: "./images/Thandhoori malai.jpg",
      price: 140,
      rating: 4.9,
    },
    {
      name: "Schezwan momo",
      image: "./images/schezwan momo.jpg",
      price: 130,
      rating: 5.0,
    },
    {
      name: "Zinger momo",
      image: "./images/Zinger momo.png",
      price: 135,
      rating: 4.7,
    },
  ];

  const nonVegGallery = [
    {
      name: "Lava momo",
      image: "./images/Lava momo.jpg",
      price: 150,
      rating: 4.6,
    },
    {
      name: "Japan momo",
      image: "./images/Japan momo.jpg",
      price: 145,
      rating: 4.5,
    },
    {
      name: "Streamed momo",
      image: "./images/Streamed momo.jpg",
      price: 150,
      rating: 4.9,
    },
    {
      name: "Fried momo",
      image: "./images/Fried momo.jpg",
      price: 120,
      rating: 4.8,
    },
    {
      name: "Schezwan momo",
      image: "./images/schezwan momo.jpg",
      price: 130,
      rating: 5.0,
    },
    {
      name: "Zinger momo",
      image: "./images/Zinger momo.png",
      price: 135,
      rating: 4.7,
    },
    {
      name: "Thanduri malai",
      image: "./images/Thandhoori malai.jpg",
      price: 140,
      rating: 4.9,
    },
  ];

  const gallery = category === "veg" ? vegGallery : nonVegGallery;
  const filteredGallery = gallery.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("hasWelcomed");
    setIsLoggedIn(false);
    setUsername("");
    navigate("/");
  };

  useEffect(() => {
    if (isLoggedIn && !localStorage.getItem("hasWelcomed")) {
      alert(`Welcome, ${username}!`);
      localStorage.setItem("hasWelcomed", "true");
    }
  }, [isLoggedIn, username]);

  return (
    <div className="momo-main">
      <header className="momo-header">
        <div className="logo">
          <a href="#">
            <img
              src="./images/Icon.jpg"
              alt="Momo Logo"
              className="logo-icon"
            />
          </a>
        </div>
        <nav className="momo-nav">
          <a href="#">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact us</a>
          {isLoggedIn ? (
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <span
                onClick={() => setDropdownOpen((prev) => !prev)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  border: "1px solid black",
                  borderRadius: "20px",
                  padding: "6px 12px",
                  fontWeight: "600",
                  color: "white",
                  backgroundColor: "brown",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#8B4513")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "brown")
                }>
                <MdPerson style={{ color: "white", fontSize: "20px" }} />
                {username}
              </span>
              {dropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: "0px",
                    zIndex: 1000,
                    marginTop: "8px",
                    minWidth: "100px",
                    backgroundColor: "#fff",
                    borderRadius: "40px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                  }}>
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: "10px 16px",
                      width: "100%",
                      border: "none",
                      backgroundColor: "#e74c3c",
                      color: "white",
                      fontWeight: "bold",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#c0392b")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#e74c3c")
                    }>
                    🔓 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button id="login">Login</button>
            </Link>
          )}
        </nav>
      </header>

      <section className="momo-hero">
        <div className="momo-hero-content">
          <h1>
            Hot fresh legendary
            <br />
            Momos on wheels!
          </h1>
          <p id="desc">
            From our food truck to your doorstep served only via Swiggy & Zomato
          </p>
          <div className="momo-hero-buttons">
            <button
              className="order-now-btn"
              onClick={() => setModalVisible(true)}>
              Order Now
            </button>
          </div>
        </div>
      </section>

      {modalVisible && (
        <div className="order-modal-overlay">
          <div className="order-modal">
            <span
              className="close-modal"
              onClick={() => setModalVisible(false)}>
              ×
            </span>
            <h2>Choose Delivery Partner</h2>
            <div className="modal-buttons">
              <a
                href="https://www.swiggy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="order-btn">
                <img src={swiggyLogo} alt="Swiggy" className="order-logo" />
                Swiggy
              </a>
              <a
                href="https://www.zomato.com"
                target="_blank"
                rel="noopener noreferrer"
                className="order-btn">
                <img src={zomatoLogo} alt="Zomato" className="order-logo" />
                Zomato
              </a>
            </div>
          </div>
        </div>
      )}

      <section className="momo-menu" id="menu">
        <div
          className="menu-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            marginTop: "70px",
          }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginLeft: "10%",
            }}>
            <span style={{ fontSize: "23px", fontWeight: "600" }}>
              Category
            </span>
            <div
              style={{
                backgroundColor: "#eee",
                borderRadius: "999px",
                display: "flex",
                overflow: "hidden",
              }}>
              <button
                style={{
                  padding: "12px 50px",
                  border: "none",
                  backgroundColor:
                    category === "nonveg" ? "#db4c4c" : "transparent",
                  color: category === "nonveg" ? "white" : "#333",
                  borderRadius: "999px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => setCategory("nonveg")}>
                Non veg
              </button>
              <button
                style={{
                  padding: "12px 50px",
                  border: "none",
                  backgroundColor:
                    category === "veg" ? "#db4c4c" : "transparent",
                  color: category === "veg" ? "white" : "#333",
                  borderRadius: "999px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => setCategory("veg")}>
                Veg
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "white",
              padding: "0.5rem 1rem",
              borderRadius: "999px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              gap: "0.5rem",
              flexGrow: 1,
              maxWidth: "400px",
              marginTop: "-3px",
              marginRight: "100px",
            }}>
            <span style={{ fontSize: "1.2rem" }}>🔍</span>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                flex: 1,
                fontSize: "1rem",
                background: "transparent",
                padding: "10px",
              }}
            />
            <div
              style={{
                position: "relative",
                fontSize: "1.3rem",
                cursor: "pointer",
              }}>
              🛍️
              <span
                style={{
                  position: "absolute",
                  top: "-0.4rem",
                  right: "-0.4rem",
                  backgroundColor: "#ff6a00",
                  color: "white",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  borderRadius: "50%",
                  padding: "0.1rem 0.4rem",
                }}>
                2
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="momo-gallery">
        <p className="product">Product</p>
        <h3>Menu</h3>
        <div className="menu-results">
          <div className="menu-shown">
            {filteredGallery.length > 0 ? (
              filteredGallery.map((item, idx) => (
                <div className="menu-card" key={idx}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="menu-image"
                  />
                  <div className="menu-info">
                    <h4 className="menu-name">{item.name}</h4>
                    <div className="menu-meta">
                      <span className="menu-rating">⭐ {item.rating}</span>
                      <span className="menu-price">Rs.{item.price}</span>
                    </div>
                    <button className="add-to-cart-btn">Add To Cart</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">🔍 No results found.</div>
            )}
          </div>
        </div>
      </section>

      <section className="why-choose-us" id="about">
        <div className="why-header">
          <p className="why-subtitle">Why choose us</p>
          <h2 className="why-title">Our Flavorful Promise</h2>
        </div>
        <div className="why-features">
          <div className="why-card highlighted">
            <FaUtensils className="why-icon" />
            <h3>Wide selection of restaurants</h3>
            <p>
              Craving variety? Discover diverse flavors from every corner of
              your city.
            </p>
          </div>
          <div className="why-card highlighted">
            <BiFoodMenu className="why-icon" />
            <h3>Easy ordering process</h3>
            <p>
              Skip the hassle. Order your favorite momos in seconds via Swiggy
              or Zomato.
            </p>
          </div>
          <div className="why-card highlighted">
            <MdDeliveryDining className="why-icon" />
            <h3>Fast delivery within 20 min</h3>
            <p>
              Hot momos at your doorstep in just 20 minutes—no waiting, just
              eating!
            </p>
          </div>
        </div>
      </section>

      <Testimonial />

      <section className="momo-newsletter" id="contact">
        <div className="newsletter-container">
          <div className="newsletter-image">
            <img src="./images/Japan momo.jpg" alt="Plate of momos" />
          </div>
          <div className="newsletter-content">
            <h2>Subscribe To Our Newsletter</h2>
            <p>
              Be the first to know about new momos, special offers & where we’re
              rolling next.
            </p>
            <form className="newsletter-form">
              <input type="email" placeholder="Type your email….." required />
              <button type="submit">SUBSCRIBE</button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
