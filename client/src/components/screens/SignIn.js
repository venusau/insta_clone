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
    <>
      <div className="mycard">
        <div className="card auth-card input-field">
          <h2 className="instagram" style={{ color: "black" }}>
            Instagram
          </h2>
          <form onSubmit={postData}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={changeEmail}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={changePassword}
              required
            />
            <button
              className="btn waves-effect waves-light #e91e63 pink"
              type="submit"
            >
              SignIn
            </button>
          </form>
          <h5>
            <NavLink to="/signup">Don't have an account?</NavLink>
          </h5>
        </div>
      </div>
    </>
  );
}

export default SignIn;
