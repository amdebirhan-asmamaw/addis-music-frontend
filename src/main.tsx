import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { router } from "./router";
import { store } from "./store";
import { AudioEngineProvider } from "./contexts/AudioEngineContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AudioEngineProvider>
        <RouterProvider router={router} />
      </AudioEngineProvider>
    </Provider>
  </StrictMode>,
);
