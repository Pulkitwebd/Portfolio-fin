import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./styles/font.css";
import "./styles/header.css";
import "./styles/footer.css";
import "./styles/theme.css";
import "./styles/index.css";
import "./styles/projects.css";
import "./styles/experience.css";
import "./styles/about.css";
import "./styles/certifications.css";
import "./styles/contact.css";
import "./styles/hero.css";
import "./styles/projects-page.css";
import "./styles/polish.css";
import "./styles/base.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
