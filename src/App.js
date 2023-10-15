import "./styles.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContext } from "./components/context";
import Start from "./components/Start";
import Question from "./components/Question";
import Auth from "./components/Auth";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function App() {
  const [user, setUser] = useState(null);
  const [pending, setPending] = useState(false);

  if (pending) {
    return (
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        userCon: user,
        setUserCon: (val) => setUser(val)
      }}
    >
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Auth />} />
            <Route path="/start/:userId" element={<Start />} />
            <Route path="/question/:testId/:testName" element={<Question />} />
            <Route path="*" element={<h1>404 page</h1>} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}
