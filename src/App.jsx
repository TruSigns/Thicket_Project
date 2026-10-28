import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Diary from "./pages/Diary";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

function WithFooter({ children }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route
          path="/"
          element={
            <WithFooter>
              <Home />
            </WithFooter>
          }
        />
        <Route
          path="/about"
          element={
            <WithFooter>
              <About />
            </WithFooter>
          }
        />
        <Route
          path="/projects"
          element={
            <WithFooter>
              <Projects />
            </WithFooter>
          }
        />
        <Route
          path="/diary"
          element={
            <WithFooter>
              <Diary />
            </WithFooter>
          }
        />
        <Route
          path="/contact"
          element={
            <WithFooter>
              <Contact />
            </WithFooter>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
