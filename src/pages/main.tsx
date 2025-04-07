import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface TypingTextProps {
  text: string;
}

const TypingText = ({ text }: TypingTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let charIndex = 0;

    const typingEffect = () => {
      if (charIndex < text.length - 1) {
        setDisplayedText((prev) => prev + text[charIndex]);
        charIndex++;
        setTimeout(typingEffect, 65); // Delay per character (adjust as needed)
      } else {
        setIsTypingComplete(true); // Typing complete
      }
    };

    typingEffect(); // Start typing effect

    return () => {
      charIndex = text.length; // Cleanup if unmounted
    };
  }, [text]);

  return (
    <p>
      {displayedText}
      {!isTypingComplete && <span className="typing-indicator">...</span>}{" "}
      {/* Typing indicator */}
    </p>
  );
};

export const Main = () => {
  const navigateMain = useNavigate();
  const location = useLocation();

  const handlenavigateMain = (path: string) => {
    navigateMain(path);
  };

  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace("#", "");
      if (sectionId === "home") {
        window.scrollTo({
          top: 0
        })
      }
      else {
        const section = document.getElementById(sectionId);
        const offset = 130;

        if (section) {
          const elementPosition = section.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: "smooth",
          });
        }
      }
      
    }
  }, [location]);

  return (
    <div className="content">
      <main>
        <div className="main-div">
          <div id="home" className="header">
            <h1 className="main-heading">Greetings!</h1>
            <h2 className="main-subHeading">Step into my world</h2>
            {/* Start both sentences at the same time */}
            <div className="typing-text">
              <TypingText text="Within these pages, I offer you glimpses of my thoughts, reflections, and moments." />
            </div>
            <div className="typing-text">
              <TypingText text="You are warmly invited to embark on this journey with me, and explore the stories." />
            </div>
          </div>
          <div className="backgroundImg">
            <img src="/images/76289.jpg" className="bg_img" alt="Background" />
          </div>

          <div className="section-content">
            <div className="fiction">
              <div className="image-container"
                   onClick={() => handlenavigateMain("/sections/fiction")}  
              >
                <img
                  src="/images/fiction.jpg"
                  alt="Fiction"
                  className="sectionimg fictionimg"
                />
              </div>
              <p>Fiction</p>
            </div>
            <div className="academic">
              <div className="image-container"
                   onClick={() => handlenavigateMain("/sections/academic")}
              >
                <img
                  src="/images/academic.jpg"
                  alt="Academic"
                  className="sectionimg fictionimg"
                />
              </div>
              <p>Academic</p>
            </div>
            <div className="reviews">
              <div className="image-container"
                   onClick={() => handlenavigateMain("/sections/reviews")}
              >
                <img
                  src="/images/review.jpg"
                  alt="Review"
                  className="sectionimg fictionimg"
                />
              </div>
              <p>Reviews</p>
            </div>
          </div>
        </div>

        <h2 id="about" className="about-title">About Me</h2>
        <div className="about-me">
          <div className="about-imgContainer">
            <img src="/images/rubaiya.jpg" className="rubaiyaImg" />
          </div>
          <p className="about-description">
            I completed my BA in English literature from Bracu University and
            currently doing my MBA there. I'm also involved in writing content
            for Academic Prose Solutions.
          </p>
        </div>

        <h2 id="contact" className="contact-title">Contact Me</h2>
        <div className="contact-container">
         <a href="mailto:rubaiyazishan97@gmail.com" className="contact-link">
            <img src="/images/email.png" className="email-icon"/>
            <p className="contact-info">rubaiyazishan97@gmail.com</p>
         </a>
        </div>
      </main>
    </div>
  );
};
