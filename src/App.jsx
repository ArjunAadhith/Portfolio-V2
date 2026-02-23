import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Skills from "./components/Skills.jsx";
import Projects from "./components/Projects.jsx";
import Mycreations from "./components/Mycreations.jsx";
import Multidisciplinary from "./components/Multidisciplinary.jsx";
import Illustrations from "./components/Illustrations.jsx";
import Education from "./components/Education.jsx";
import Footer from "./components/Footer.jsx";
import { useEffect } from "react";

export default function App() {
  // Card-close effect: shrink + round Hero as user scrolls into About
  useEffect(() => {
    const hero = document.getElementById("hero-section");

    const onScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, scrollY / vh));
      if (hero) {
        const scale = 1 - progress * 0.06;
        const radius = progress * 24;
        const translateY = -progress * 30;
        hero.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        hero.style.borderRadius = `${radius}px`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: "#E8E8E8" }}>
      <Navbar />

      <div
        id="home"
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: "100vh",
          zIndex: 1,
          transformOrigin: "top center",
          willChange: "transform, border-radius",
          overflow: "visible",
          boxShadow: "0 8px 60px rgba(0,0,0,0.15)",
        }}
      >
        <div id="hero-section" style={{ width: "100%", height: "100%" }}>
          <Hero />
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 2, marginTop: "0px" }}>
        <About />
        <Skills />

        {/* id="projects" — Navbar Projects icon scrolls here */}
        <div id="projects">
          <Projects />
          <Mycreations />
          <Multidisciplinary />
          <Illustrations />
        </div>

        <Education />

        {/* id="contact" — Navbar Contact icon scrolls here */}
        <div id="contact">
          <Footer />
        </div>
      </div>
    </div>
  );
}
