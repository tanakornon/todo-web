import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import { TodoPage } from "./pages/TodoPage";

function App() {
  return (
    <Provider store={store}>
      <TodoPage />
    </Provider>
  );
}

export default App;
