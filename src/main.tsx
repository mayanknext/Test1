import { createRoot } from "react-dom/client";
import "@fontsource-variable/mona-sans";
import "@fontsource-variable/hubot-sans";
import "@fontsource-variable/jetbrains-mono";
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root");
if (root) createRoot(root).render(<App />);
