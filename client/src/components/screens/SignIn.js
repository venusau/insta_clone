import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../context"; // Ensure the context is correctly imported

function SignIn() {
  const { state, dispatch } = useContext(UserContext); // Destructure as an object
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  function changeEmail(e) {
    setEmail(e.target.value);
  }

  function changePassword(e) {
    setPassword(e.target.value);
  }

  const password_validate = (password) => {
    const re = {
      capital: /[A-Z]/,
      digit: /[0-9]/,
      full: /^[A-Za-z0-9@#]{8,14}$/,
    };
    return (
      re.capital.test(password) &&
      re.digit.test(password) &&
      re.full.test(password)
    );
  };

  const postData = (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!password_validate(password)) {
      return alert(
        "Password should be strong: at least one uppercase letter, one digit, and a length of 8-14 characters."
      );
    }

    fetch("/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          alert(data.error);
        } else {
          if (!data.token) {
            return alert("something went wrong");
          }
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          console.log(data.user)
          dispatch({ type: "USER", payload: data.user });
          alert("You're signed in");
          navigate("/");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("An error occurred while signing up");
      });
  };

  return (
    <div className="container" style={{ marginTop: "50px" }}>
      <div className="card auth-card black">
        <div className="card-content white-text">
          <span className="card-title">Sign In</span>
          <form onSubmit={postData}>
            <div className="input-field">
              <input
                type="email"
                id="email"
                value={email}
                onChange={changeEmail}
                required
                className="white-text"
                style={{ borderBottom: "1px solid white" }}
              />
              <label htmlFor="email" className="white-text">Email</label>
            </div>
            <div className="input-field">
              <input
                type="password"
                id="password"
                value={password}
                onChange={changePassword}
                required
                className="white-text"
                style={{ borderBottom: "1px solid white" }}
              />
              <label htmlFor="password" className="white-text">Password</label>
            </div>
            <button
              className="btn waves-effect waves-light"
              type="submit"
              style={{ backgroundColor: "#e91e63" }}
            >
              Sign In
            </button>
          </form>
          <h5>
            <NavLink to="/signup" className="white-text">Don't have an account?</NavLink>
            <br />
            <NavLink to="/forget-password" className="white-text">Forgot Password?</NavLink>
          </h5>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
