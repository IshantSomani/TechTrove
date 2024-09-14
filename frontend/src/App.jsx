import React from "react";
import { RouterProvider } from "react-router-dom";
import Routes from "./routes/Routes";
import { ThemeProvider } from "./context/ThemeContext";
import { Provider } from "react-redux";
import store from "./redux/store/store";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={Routes} />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
