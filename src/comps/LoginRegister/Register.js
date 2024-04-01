import React, { useState } from "react";
import "./LogRegContainer.css";
import { notify } from "../../functions/toast";

function Register({ flip, setflip }) {
  const [loading, setloading] = useState(false);

  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");

  const registerUser = () => {
    if (!username || !password || !first_name || !last_name) return;
    setloading(true);

    fetch(`${process.env.REACT_APP_BACK_END}/register-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // credentials: "include",
      body: JSON.stringify({
        username,
        password,
        first_name,
        last_name,
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
          setusername("");
          setpassword("");
          setfirst_name("");
          setlast_name("");
          notify({
            text: data.msg,
            success: true,
          });
          setloading(false);
        }
      });
  };

  return (
    <div className="form_card">
      <h1>Register</h1>
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
      <input
        type="text"
        placeholder="First Name"
        value={first_name}
        onChange={(e) => setfirst_name(e.target.value)}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={last_name}
        onChange={(e) => setlast_name(e.target.value)}
      />
      <div className="form_controls">
        <h3>
          Have an account?{" "}
          <span className="log_reg_span" onClick={() => setflip(!flip)}>
            Login
          </span>
        </h3>
        {loading ? (
          <button className="form_submit_button">Loading...</button>
        ) : (
          <button onClick={registerUser} className="form_submit_button">
            REGISTER
          </button>
        )}
      </div>
    </div>
  );
}

export default Register;
