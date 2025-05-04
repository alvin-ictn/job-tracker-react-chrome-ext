import ReactDOM from "react-dom/client";
import App from "./App";
import MainLayout from "./layout";
import "./styles/style.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <MainLayout>
    <App />
  </MainLayout>
);
