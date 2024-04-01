import React, { useEffect, useState } from "react";
import "./App.css";
import Dashboard from "./comps/Dashboard";
import LogRegContainer from "./comps/LoginRegister/LogRegContainer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [loading, setloading] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(false);

  useEffect(() => {
    setloading(true);
    fetch(`${process.env.REACT_APP_BACK_END}/authorize-user-to-proceed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        token: sessionStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          setisLoggedIn(false);
          setloading(false);
          console.log(data.msg);
        } else {
          setisLoggedIn(true);
          setloading(false);
          console.log(data.msg);
        }
      });
  }, []);

  return (
    <div className="App">
      <ToastContainer />
      {loading ? (
        <div>LOADING...</div>
      ) : (
        <>
          {isLoggedIn ? (
            <Dashboard setisLoggedIn={setisLoggedIn} />
          ) : (
            <LogRegContainer setisLoggedIn={setisLoggedIn} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
