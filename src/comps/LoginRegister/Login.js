import React, { useState } from "react";
import "./LogRegContainer.css";
import { notify } from "../../functions/toast";

function Login({ flip, setflip, setisLoggedIn }) {
  const [loading, setloading] = useState(false);
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");

  const userLogin = () => {
    if (!username || !password) return;
    setloading(true);

    fetch(`${process.env.REACT_APP_BACK_END}/user-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          notify({
            text: data.msg,
            error: true,
          });
          setloading(false);
        } else {
          sessionStorage.setItem("token", data.token);
          setusername("");
          setpassword("");
          setisLoggedIn(true);
          setloading(false);
        }
      });
  };

  const testLogin = () => {
    setloading(true);
    fetch(`${process.env.REACT_APP_BACK_END}/user-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        username: "test",
        password: "test",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          notify({
            text: data.msg,
            error: true,
          });
          setloading(false);
        } else {
          sessionStorage.setItem("token", data.token);
          setusername("");
          setpassword("");
          setisLoggedIn(true);
          setloading(false);
        }
      });
  };

  return (
    <div className="form_card">
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setusername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setpassword(e.target.value)}
      />
      <div className="form_controls">
        <div>
          <h3>
            Don't have an account?{" "}
            <span className="log_reg_span" onClick={() => setflip(!flip)}>
              Register instead
            </span>
          </h3>
          <h3>
            Came here to test?{" "}
            <span className="log_reg_span" onClick={testLogin}>
              Test Login
            </span>
          </h3>
        </div>
        {loading ? (
          <button className="form_submit_button">Loading...</button>
        ) : (
          <button onClick={userLogin} className="form_submit_button">
            LOGIN
          </button>
        )}
      </div>
    </div>
  );
}

export default Login;
