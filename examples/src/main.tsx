import ReactDOM from "react-dom/client";
import App from "./App";
import { HashRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <HashRouter>
    <App />
  </HashRouter>
);
