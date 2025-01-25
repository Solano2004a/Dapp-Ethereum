import { useState } from "react";
import { Loader, Welcome, Navbar, Transactions } from "./components";
import "./App.css";

const App = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
      </div>
    </div>
  );
};

export default App;
