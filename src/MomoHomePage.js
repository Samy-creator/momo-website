import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Ensure axios is installed: npm install axios
import "./MomoHomePage.css"; // The main CSS for the homepage
import { FaUtensils } from "react-icons/fa";
import { MdDeliveryDining, MdPerson } from "react-icons/md";
import { BiFoodMenu } from "react-icons/bi";
import Footer from "./components/Footer"; // Ensure path is correct
import swiggyLogo from "./assets/swiggy.jpg"; // Ensure path is correct
import zomatoLogo from "./assets/zomato.png"; // Ensure path is correct
import Testimonial from "./components/testimonial"; // Ensure path is correct

export default function MomoHomePage({
  isLoggedIn,
  setIsLoggedIn,
  username,
  setUsername,
}) {
  // State to hold dynamic homepage content fetched from the backend
  const [homepageContent, setHomepageContent] = useState({
    hero: {
      title: "Hot fresh legendary Momos on wheels!",
      subtitle:
        "From our food truck to your doorstep served only via Swiggy & Zomato",
      imageUrl: "/images/Truck.jpg",
    }, // Default values
    about: {
      description:
        "Our passion is to bring you the most authentic and delicious momos. Made with fresh ingredients and traditional recipes, every bite is a journey to flavor paradise.",
    },
    products: [], // This will hold the dynamic menu items
  });
  const [loadingContent, setLoadingContent] = useState(true); // Loading state for API fetch
  const [contentError, setContentError] = useState(null); // Error state for API fetch

  // Local UI states
  const [category, setCategory] = useState("all"); // 'all', 'veg', 'nonveg' for menu filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false); // For order now modal
  const [dropdownOpen, setDropdownOpen] = useState(false); // For user dropdown
  const dropdownRef = useRef(null); // Ref for closing dropdown on outside click
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Determine if the logged-in user has admin privileges
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // Effect to close dropdown when clicking outside
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

  // Effect to fetch dynamic homepage content from the backend on component mount
  useEffect(() => {
    const fetchHomepageData = async () => {
      setLoadingContent(true); // Start loading
      setContentError(null); // Clear any previous errors
      try {
        // Make a GET request to the backend API for homepage content.
        // This endpoint is public, so no authentication token is sent here.
        const res = await axios.get("http://localhost:5000/api/homepage");

        const fetchedData = {};
        // Organize fetched data by sectionName for easy access
        res.data.forEach((section) => {
          fetchedData[section.sectionName] = section;
        });

        // Update homepageContent state with fetched data, merging with defaults
        setHomepageContent((prev) => ({
          ...prev,
          hero: { ...prev.hero, ...fetchedData.hero }, // Merge hero content, keeping default image if DB has none
          about: fetchedData.about || prev.about, // Use fetched about data or previous default
          products: fetchedData.products?.items || [], // Extract 'items' array for products, default to empty array
        }));
      } catch (err) {
        console.error("Error fetching public homepage data:", err);
        setContentError(
          "Failed to load homepage content. Please try again later."
        );
      } finally {
        setLoadingContent(false); // End loading
      }
    };
    fetchHomepageData();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Filter products based on selected category and search term
  const filteredProducts = homepageContent.products.filter((item) => {
    // Basic category filtering: you might want a 'type' field in your product schema for robust filtering
    const matchesCategory =
      category === "all" ||
      (category === "veg" &&
        item.name &&
        item.name.toLowerCase().includes("veg")) ||
      (category === "nonveg" &&
        item.name &&
        !item.name.toLowerCase().includes("veg"));

    // Filter by search term (case-insensitive)
    const matchesSearch =
      item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handles user logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin"); // Clear admin status on logout
    setIsLoggedIn(false);
    setUsername("");
    setDropdownOpen(false); // Close dropdown
    navigate("/"); // Redirect to home after logout
  };

  // Handles navigation to the admin page for admin users
  const navigateToAdminPage = () => {
    setDropdownOpen(false); // Close dropdown before navigating
    navigate("/adminpage"); // Navigate to the admin page route
  };

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
                    minWidth: "150px",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}>
                  {isAdmin && ( // Conditionally render Admin Panel link ONLY if user is admin
                    <button
                      onClick={navigateToAdminPage}
                      style={{
                        padding: "10px 16px",
                        width: "100%",
                        border: "none",
                        backgroundColor: "#5cb85c", // Green color for admin button
                        color: "white",
                        fontWeight: "bold",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#4cae4c")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#5cb85c")
                      }>
                      ⚙️ Admin Panel
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: "10px 16px",
                      width: "100%",
                      border: "none",
                      backgroundColor: "#e74c3c", // Red color for logout button
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
      {/* Conditional rendering based on loading and error states */}
      {loadingContent ? (
        <div
          style={{
            textAlign: "center",
            padding: "100px",
            fontSize: "1.5em",
            color: "#555",
          }}>
          Loading amazing momos...
        </div>
      ) : contentError ? (
        <div
          style={{
            textAlign: "center",
            padding: "100px",
            fontSize: "1.5em",
            color: "red",
          }}>
          {contentError}
        </div>
      ) : (
        <>
          {/* Hero Section: Background image set dynamically via inline style */}
          <section
            className="momo-hero"
            style={{
              backgroundImage: `url(${homepageContent.hero.imageUrl})`, // Use dynamic image URL
            }}>
            <div className="momo-hero-content">
              <h1>{homepageContent.hero.title}</h1>
              <p id="desc">{homepageContent.hero.subtitle}</p>
              <div className="momo-hero-buttons">
                <button
                  className="order-now-btn"
                  onClick={() => setModalVisible(true)}>
                  Order Now
                </button>
              </div>
            </div>
          </section>
          {/* Order Modal (unchanged from your original code) */}
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
          {/* Momo Menu Section */}
          <section className="momo-menu" id="menu">
            <div className="menu-header">
              <div className="menu-header-category">
                <span>Category</span>
                <div className="category-buttons-container">
                  <button
                    className={category === "nonveg" ? "active" : ""}
                    onClick={() => setCategory("nonveg")}>
                    Non veg
                  </button>
                  <button
                    className={category === "veg" ? "active" : ""}
                    onClick={() => setCategory("veg")}>
                    Veg
                  </button>
                  <button
                    className={category === "all" ? "active" : ""}
                    onClick={() => setCategory("all")}>
                    All
                  </button>
                </div>
              </div>

              <div className="search-and-cart-container">
                <span>🔍</span>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="cart-icon-wrapper">
                  🛍️
                  <span className="cart-item-count"></span>
                </div>
              </div>
            </div>
          </section>
          <section className="momo-gallery">
            <p className="product">Product</p>
            <h3>Menu</h3>
            <div className="menu-results">
              <div className="menu-shown">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((item) => (
                    <div className="menu-card" key={item.id || item.name}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="menu-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/300x200/cccccc/000000?text=No+Image";
                        }} // Placeholder on error
                      />
                      <div className="menu-info">
                        <h4 className="menu-name">{item.name}</h4>
                        <div className="menu-meta">
                          <span className="menu-rating">
                            ⭐ {item.rating || "N/A"}
                          </span>
                          <span className="menu-price">
                            Rs.{item.price ? item.price.toFixed(2) : "N/A"}
                          </span>
                        </div>
                        <button className="add-to-cart-btn">Add To Cart</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    🔍 No results found matching your criteria.
                  </div>
                )}
              </div>
            </div>
          </section>
          {/* Why Choose Us Section: First card's description is now dynamic */}
          <section className="why-choose-us" id="about">
            <div className="why-header">
              <p className="why-subtitle">Why choose us</p>
              <h2 className="why-title">Our Flavorful Promise</h2>
            </div>
            <div className="why-features">
              <div className="why-card highlighted">
                <FaUtensils className="why-icon" />
                <h3>Wide selection of restaurants</h3>
                <p>{homepageContent.about.description}</p>
              </div>
              <div className="why-card highlighted">
                <BiFoodMenu className="why-icon" />
                <h3>Easy ordering process</h3>
                <p>
                  Skip the hassle. Order your favorite momos in seconds via
                  Swiggy or Zomato.
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
          <Testimonial /> {/* Your existing Testimonial component */}
          {/* Newsletter Section (unchanged from your original code, static text) */}
          <section className="momo-newsletter" id="contact">
            <div className="newsletter-container">
              <div className="newsletter-image">
                <img src="./images/Japan momo.jpg" alt="Plate of momos" />
              </div>
              <div className="newsletter-content">
                <h2>Subscribe To Our Newsletter</h2>
                <p>
                  Be the first to know about new momos, special offers & where
                  we’re rolling next.
                </p>
                <form className="newsletter-form">
                  <input
                    type="email"
                    placeholder="Type your email….."
                    required
                  />
                  <button type="submit">SUBSCRIBE</button>
                </form>
              </div>
            </div>
          </section>
        </>
      )}
      <Footer /> {/* Your existing Footer component */}
    </div>
  );
}
