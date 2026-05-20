
  import { createRoot } from "react-dom/client";
  import { HashRouter } from "react-router-dom";
  import { IdeaProvider } from "./app/context/IdeaContext.tsx";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <HashRouter>
      <IdeaProvider>
        <App />
      </IdeaProvider>
    </HashRouter>
  );
  