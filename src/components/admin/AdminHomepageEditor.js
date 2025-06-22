import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminHomepageEditor = () => {
  const navigate = useNavigate();

  const [heroContent, setHeroContent] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
  });
  const [aboutContent, setAboutContent] = useState({ description: "" });
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchHomepageContent = async () => {
      setLoading(true);
      setMessage("");
      try {
        const token = localStorage.getItem("token");
        // Console log for debugging
        console.log(
          "AdminPage Fetch: Token from localStorage:",
          token ? "Present" : "Missing"
        );

        if (!token) {
          setMessage("Please log in to access the admin panel.");
          navigate("/login");
          return;
        }

        const config = {
          headers: {
            "x-auth-token": token,
          },
        };

        const res = await axios.get(
          "http://localhost:5000/api/homepage",
          config
        );

        res.data.forEach((section) => {
          if (section.sectionName === "hero") {
            setHeroContent({
              title: section.title,
              subtitle: section.subtitle,
              imageUrl: section.imageUrl,
            });
          } else if (section.sectionName === "about") {
            setAboutContent({ description: section.description });
          } else if (section.sectionName === "products") {
            setProducts(section.items || []);
          }
        });
      } catch (err) {
        console.error("Error fetching homepage content:", err);
        if (err.response) {
          if (err.response.status === 403) {
            setMessage(
              "Access Denied: You do not have administrator privileges."
            );
            navigate("/login");
          } else if (err.response.status === 401) {
            setMessage(
              "Your session has expired or is invalid. Please log in again."
            );
            navigate("/login");
          } else {
            setMessage(
              `Error: ${err.response.data.msg || "Failed to load content."}`
            );
          }
        } else {
          setMessage("Network Error: Could not connect to the server.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchHomepageContent();
  }, [navigate]);

  const handleHeroChange = (e) => {
    setHeroContent({ ...heroContent, [e.target.name]: e.target.value });
  };

  const handleAboutChange = (e) => {
    setAboutContent({ ...aboutContent, [e.target.name]: e.target.value });
  };

  const handleProductChange = (index, e) => {
    const newProducts = [...products];
    newProducts[index] = {
      ...newProducts[index],
      [e.target.name]: e.target.value,
    };
    setProducts(newProducts);
  };

  const addProduct = () => {
    setMessage("");
    setProducts([
      ...products,
      {
        id: Date.now().toString(),
        name: "",
        price: 0,
        description: "",
        image: "",
      },
    ]);
  };

  const removeProduct = (idToRemove) => {
    setMessage("");
    setProducts(products.filter((product) => product.id !== idToRemove));
  };

  const saveContent = async (sectionName, data) => {
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      // Console log for debugging
      console.log(
        "AdminPage Save: Token from localStorage:",
        token ? "Present" : "Missing"
      );
      // If token is present, show a snippet of it (first 10 chars)
      if (token) {
        console.log(
          "AdminPage Save: Token starts with:",
          token.substring(0, 10) + "..."
        );
      }

      if (!token) {
        setMessage("Please log in to save changes.");
        navigate("/login");
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };

      await axios.put(
        `http://localhost:5000/api/homepage/${sectionName}`,
        data,
        config
      );
      setMessage(`${sectionName} section updated successfully!`);
    } catch (err) {
      console.error(`Error updating ${sectionName} section:`, err);
      if (err.response) {
        if (err.response.status === 403) {
          setMessage(
            "Access Denied: You are not authorized to perform this action."
          );
          navigate("/login");
        } else if (err.response.status === 401) {
          setMessage(
            "Your session has expired or is invalid. Please log in again."
          );
          navigate("/login");
        } else {
          setMessage(
            `Error saving ${sectionName}: ${
              err.response.data.msg || "Failed to save content."
            }`
          );
        }
      } else {
        setMessage("Network Error: Could not connect to the server.");
      }
    }
  };

  const styles = {
    container: {
      padding: "30px",
      maxWidth: "900px",
      margin: "40px auto",
      border: "1px solid #e0e0e0",
      borderRadius: "12px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
      fontFamily: '"Inter", sans-serif',
      backgroundColor: "#fefefe",
      color: "#333",
    },
    loadingMessage: {
      textAlign: "center",
      padding: "50px",
      fontSize: "1.4em",
      color: "#555",
    },
    errorMessage: {
      textAlign: "center",
      padding: "12px",
      color: "#dc3545",
      backgroundColor: "#f8d7da",
      border: "1px solid #f5c6cb",
      borderRadius: "8px",
      marginBottom: "25px",
      fontWeight: "600",
    },
    successMessage: {
      textAlign: "center",
      padding: "12px",
      color: "#28a745",
      backgroundColor: "#d4edda",
      border: "1px solid #c3e6cb",
      borderRadius: "8px",
      marginBottom: "25px",
      fontWeight: "600",
    },
    title: {
      textAlign: "center",
      marginBottom: "40px",
      color: "#333",
      fontSize: "2.5em",
      fontWeight: "700",
    },
    sectionEditor: {
      marginBottom: "50px",
      padding: "30px",
      border: "1px solid #e9ecef",
      borderRadius: "10px",
      backgroundColor: "#ffffff",
      boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    },
    sectionHeading: {
      borderBottom: "1px solid #f0f0f0",
      paddingBottom: "18px",
      marginBottom: "30px",
      color: "#444",
      fontSize: "2em",
      fontWeight: "600",
    },
    formGroup: {
      marginBottom: "22px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "bold",
      color: "#555",
      fontSize: "0.95em",
    },
    input: {
      width: "100%",
      padding: "12px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      fontSize: "1em",
      transition: "border-color 0.3s, box-shadow 0.3s",
      boxSizing: "border-box", // Include padding in width
    },
    textarea: {
      width: "100%",
      padding: "12px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      fontSize: "1em",
      resize: "vertical",
      minHeight: "100px",
      transition: "border-color 0.3s, box-shadow 0.3s",
      boxSizing: "border-box", // Include padding in width
    },
    focusedInput: {
      // For focus effect on inputs/textareas
      borderColor: "#007bff",
      boxShadow: "0 0 0 3px rgba(0, 123, 255, 0.25)",
      outline: "none",
    },
    imagePreview: {
      maxWidth: "150px",
      height: "auto",
      marginTop: "15px",
      border: "1px solid #eee",
      borderRadius: "8px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    },
    button: {
      padding: "12px 25px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "1.1em",
      fontWeight: "600",
      transition:
        "background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease",
      marginRight: "15px",
      marginTop: "15px",
      boxShadow: "0 4px 10px rgba(0, 123, 255, 0.2)",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 15px rgba(0, 123, 255, 0.3)",
    },
    addButton: {
      backgroundColor: "#28a745",
    },
    addButtonHover: {
      backgroundColor: "#218838",
    },
    removeButton: {
      backgroundColor: "#dc3545",
    },
    removeButtonHover: {
      backgroundColor: "#c82333",
    },
    productCard: {
      border: "1px solid #e9ecef",
      padding: "20px",
      marginBottom: "25px",
      borderRadius: "10px",
      backgroundColor: "#fdfdfd",
      boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
    },
    productCardTitle: {
      marginTop: "0",
      marginBottom: "15px",
      color: "#666",
      fontSize: "1.3em",
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingMessage}>Loading content editor...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Edit Homepage Content</h1>

      {message && (
        <div
          style={
            message.includes("successfully")
              ? styles.successMessage
              : styles.errorMessage
          }>
          {message}
        </div>
      )}

      {/* Hero Section Editor */}
      <div style={styles.sectionEditor}>
        <h3 style={styles.sectionHeading}>Hero Section</h3>
        <div style={styles.formGroup}>
          <label style={styles.label}>Title:</label>
          <input
            type="text"
            name="title"
            value={heroContent.title}
            onChange={handleHeroChange}
            style={styles.input}
            onFocus={(e) =>
              (e.target.style.borderColor = styles.focusedInput.borderColor)
            }
            onBlur={(e) =>
              (e.target.style.borderColor = styles.input.borderColor)
            }
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Subtitle:</label>
          <input
            type="text"
            name="subtitle"
            value={heroContent.subtitle}
            onChange={handleHeroChange}
            style={styles.input}
            onFocus={(e) =>
              (e.target.style.borderColor = styles.focusedInput.borderColor)
            }
            onBlur={(e) =>
              (e.target.style.borderColor = styles.input.borderColor)
            }
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Image URL:</label>
          <input
            type="text"
            name="imageUrl"
            value={heroContent.imageUrl}
            onChange={handleHeroChange}
            style={styles.input}
            onFocus={(e) =>
              (e.target.style.borderColor = styles.focusedInput.borderColor)
            }
            onBlur={(e) =>
              (e.target.style.borderColor = styles.input.borderColor)
            }
          />
          {heroContent.imageUrl && (
            <img
              src={heroContent.imageUrl}
              alt="Hero Preview"
              style={styles.imagePreview}
            />
          )}
        </div>
        <button
          onClick={() => saveContent("hero", heroContent)}
          style={styles.button}
          onMouseEnter={(e) =>
            Object.assign(e.currentTarget.style, styles.buttonHover)
          }
          onMouseLeave={(e) =>
            Object.assign(e.currentTarget.style, styles.button)
          }>
          Save Hero Section
        </button>
      </div>

      {/* About Section Editor */}
      <div style={styles.sectionEditor}>
        <h3 style={styles.sectionHeading}>About Section</h3>
        <div style={styles.formGroup}>
          <label style={styles.label}>Description:</label>
          <textarea
            name="description"
            value={aboutContent.description}
            onChange={handleAboutChange}
            rows="5"
            style={styles.textarea}
            onFocus={(e) =>
              (e.target.style.borderColor = styles.focusedInput.borderColor)
            }
            onBlur={(e) =>
              (e.target.style.borderColor = styles.input.borderColor)
            }></textarea>
        </div>
        <button
          onClick={() => saveContent("about", aboutContent)}
          style={styles.button}
          onMouseEnter={(e) =>
            Object.assign(e.currentTarget.style, styles.buttonHover)
          }
          onMouseLeave={(e) =>
            Object.assign(e.currentTarget.style, styles.button)
          }>
          Save About Section
        </button>
      </div>

      {/* Products/Menu Section Editor */}
      <div style={styles.sectionEditor}>
        <h3 style={styles.sectionHeading}>Momo Menu / Products</h3>
        {products.length === 0 && (
          <p
            style={{
              textAlign: "center",
              color: "#777",
              marginBottom: "30px",
              fontSize: "1.1em",
            }}>
            No menu items added yet. Click "Add New Item" to start!
          </p>
        )}
        {products.map((product, index) => (
          <div key={product.id || index} style={styles.productCard}>
            <h4 style={styles.productCardTitle}>Item #{index + 1}</h4>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name:</label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={(e) => handleProductChange(index, e)}
                style={styles.input}
                onFocus={(e) =>
                  (e.target.style.borderColor = styles.focusedInput.borderColor)
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = styles.input.borderColor)
                }
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Price:</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={(e) => handleProductChange(index, e)}
                style={styles.input}
                onFocus={(e) =>
                  (e.target.style.borderColor = styles.focusedInput.borderColor)
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = styles.input.borderColor)
                }
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Description:</label>
              <textarea
                name="description"
                value={product.description}
                onChange={(e) => handleProductChange(index, e)}
                rows="3"
                style={styles.textarea}
                onFocus={(e) =>
                  (e.target.style.borderColor = styles.focusedInput.borderColor)
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = styles.input.borderColor)
                }></textarea>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Image URL:</label>
              <input
                type="text"
                name="image"
                value={product.image}
                onChange={(e) => handleProductChange(index, e)}
                style={styles.input}
                onFocus={(e) =>
                  (e.target.style.borderColor = styles.focusedInput.borderColor)
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = styles.input.borderColor)
                }
              />
              {product.image && (
                <img
                  src={product.image}
                  alt="Product Preview"
                  style={styles.imagePreview}
                />
              )}
            </div>
            <button
              onClick={() => removeProduct(product.id)}
              style={{ ...styles.button, ...styles.removeButton }}
              onMouseEnter={(e) =>
                Object.assign(
                  e.currentTarget.style,
                  styles.buttonHover,
                  styles.removeButtonHover
                )
              }
              onMouseLeave={(e) =>
                Object.assign(e.currentTarget.style, styles.removeButton)
              }>
              Remove Item
            </button>
          </div>
        ))}
        <button
          onClick={addProduct}
          style={{ ...styles.button, ...styles.addButton }}
          onMouseEnter={(e) =>
            Object.assign(
              e.currentTarget.style,
              styles.buttonHover,
              styles.addButtonHover
            )
          }
          onMouseLeave={(e) =>
            Object.assign(e.currentTarget.style, styles.addButton)
          }>
          Add New Item
        </button>
        <button
          onClick={() => saveContent("products", { items: products })}
          style={styles.button}
          onMouseEnter={(e) =>
            Object.assign(e.currentTarget.style, styles.buttonHover)
          }
          onMouseLeave={(e) =>
            Object.assign(e.currentTarget.style, styles.button)
          }>
          Save Menu Items
        </button>
      </div>
    </div>
  );
};

export default AdminHomepageEditor;
