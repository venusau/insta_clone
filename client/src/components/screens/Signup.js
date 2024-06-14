import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
// import M from 'materailize-css'

function Signup() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [profilePicUrl, setProfilePicUrl] = useState("")

  function changeEmail(e) {
    setEmail(e.target.value);
  }

  function changeName(e) {
    setName(e.target.value);
  }

  function changePassword(e) {
    setPassword(e.target.value);
  }
  function changeUsername(e) {
    setUsername(e.target.value);
  }
  const changeProfileImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      alert("Invalid file type");
      return;
    }

    // Validate file size (limit to 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File is too large");
      return;
    }

    setProfilePicUrl(file);
  };

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

    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        username,
        password,
        email,
        profilePicUrl
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          alert(data.message);
          navigate("/signin");
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
              type="text"
              placeholder="Name"
              value={name}
              onChange={changeName}
              required
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={changeUsername}
              required
            />
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
            <div className="file-field input-field">
              <div className="btn waves-effect waves-light #e91e63 pink">
                <span>Profile Image</span>
                <input type="file" onChange={changeProfileImage} />
              </div>
              <div className="file-path-wrapper">
                <input
                  className="file-path validate"
                  type="text"
                  style={{ color: "white" }}
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn waves-effect waves-light #e91e63 pink"
            >
              Signup
            </button>
          </form>
          <h5>
            <NavLink to="/signin">Already have an account?</NavLink>
          </h5>
        </div>
      </div>
    </>
  );
}

export default Signup;
