import "./App.css";
import AuthContextProvider from "./contexts/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventsPage from "./EventsPage";
import LoginPage from "./LoginPage";
import { ParallaxProvider } from "react-scroll-parallax";
import FormatContextProvider from "./contexts/FormatContext";

function App() {
  return (
    <ParallaxProvider>
      <FormatContextProvider>
        <AuthContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<EventsPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </BrowserRouter>
        </AuthContextProvider>
      </FormatContextProvider>
    </ParallaxProvider>
  );
}

export default App;
