import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "./LogRegContainer.css";

function LogRegContainer({ setisLoggedIn }) {
  const [flip, setflip] = useState(false);
  return (
    <div className="log_reg_container">
      {flip ? (
        <Register flip={flip} setflip={setflip} />
      ) : (
        <Login flip={flip} setflip={setflip} setisLoggedIn={setisLoggedIn} />
      )}
    </div>
  );
}

export default LogRegContainer;
