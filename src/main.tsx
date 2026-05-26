
  import { createRoot } from "react-dom/client";
  import { HashRouter } from "react-router-dom";
  import { IdeaProvider } from "./app/context/IdeaContext.tsx";
  import { ThemeProvider } from "./app/context/ThemeContext.tsx";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <HashRouter>
      <ThemeProvider>
        <IdeaProvider>
          <App />
        </IdeaProvider>
      </ThemeProvider>
    </HashRouter>
  );
  