import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./testimonial.css";

const testimonials = [
  {
    name: "Anjali",
    location: "From Salem",
    text: "I love how easy it is to order through Swiggy – hot and fresh every time!",
    image: "/images/woman1.jpg",
  },
  {
    name: "Rahul",
    location: "From Delhi",
    text: "Delicious momos and quick service. I’m hooked!",
    image: "/images/man1.jpg",
  },
  {
    name: "Priya",
    location: "From Mumbai",
    text: "Perfectly cooked and spicy just how I like it.",
    image: "/images/women2.jpg",
  },
  {
    name: "Karthik",
    location: "From Chennai",
    text: "Good variety and always delivered warm.",
    image: "/images/man2.jpg",
  },
  {
    name: "Sneha",
    location: "From Bengaluru",
    text: "I order every weekend. No complaints ever!",
    image: "/images/woman3.jpg",
  },
];

export default function Testimonial() {
  const [current, setCurrent] = useState(0);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="testimonial-section" id="testimonial">
      <h2 className="heading">Testimonial</h2>
      <p className="subheading">WHAT CUSTOMER SAY ABOUT US</p>
      <div className="decorative-line">〰〰</div>

      <p className="testimonial-text fade">{testimonials[current].text}</p>

      <div className="carousel">
        <button className="arrow-button" onClick={handlePrev}>
          <FaArrowLeft />
        </button>

        {testimonials.map((user, index) => (
          <img
            key={index}
            src={user.image}
            alt={user.name}
            className={`avatar ${index === current ? "active" : ""}`}
          />
        ))}

        <button className="arrow-button" onClick={handleNext}>
          <FaArrowRight />
        </button>
      </div>

      <div className="author">
        <span className="name">{testimonials[current].name}</span>
        <span className="location"> - {testimonials[current].location}</span>
      </div>
    </section>
  );
}
