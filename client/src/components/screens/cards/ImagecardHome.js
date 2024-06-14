import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ImagecardHome(props) {
  const {
    title,
    body,
    imageUrl,
    id,
    username,
    profilePicURL,
    likes,
    comments,
  } = props;
  
  const [likeColor, setLikeColor] = useState(
    likes.includes(JSON.parse(localStorage.getItem("user"))._id) ? "red" : "white"
  );
  const [likedBy, setLikedBy] = useState(likes.length);
  
  const navigate = useNavigate();

  const changeLikeColor = () => {
    const isLiked = likeColor === "red";
    const newColor = isLiked ? "white" : "red";
    const newLikedBy = isLiked ? likedBy - 1 : likedBy + 1;

    setLikeColor(newColor);
    setLikedBy(newLikedBy);

    fetch(isLiked ? "/unlike" : "/like", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`, // Assuming JWT token is stored in localStorage
      },
      body: JSON.stringify({ id }), // Send the post ID to the backend
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
          setLikeColor(isLiked ? "red" : "white");
          setLikedBy(isLiked ? likedBy + 1 : likedBy - 1);
        }
      })
      .catch((error) => {
        console.error("Error updating likes:", error);
        setLikeColor(isLiked ? "red" : "white");
        setLikedBy(isLiked ? likedBy + 1 : likedBy - 1);
      });
  };

  return (
    <>
      <div
        key={id}
        className="card home-card"
        style={{
          backgroundColor: "black",
          color: "white",
        }}
      >
        <div
          className=""
          style={{
            margin: "10px auto 10px 5px",
            display: "flex",
            justifyContent: "",
            gap: "10px",
          }}
        >
          <img
            src={
              profilePicURL
                ? profilePicURL
                : "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
            }
            alt=""
            style={{
              marginTop: "10px",
              height: "35px",
              width: "35px",
              borderRadius: "17.5px",
            }}
            className="circle responsive-img profile-pic"
            onClick={() => navigate("/profile")}
          />

          <h6 onClick={() => navigate("/profile")}>{username}</h6>
        </div>
        <div className="card-image">
          <img src={imageUrl} alt="" onDoubleClick={changeLikeColor} />
          <div className="card-content">
            <div style={{ display: "flex", gap: "5px" }}>
              <i
                className="material-icons"
                style={{ color: likeColor }}
                onClick={changeLikeColor}
              >
                favorite
              </i>
              <i>{likedBy} likes</i>
            </div>
            <h6>{title}</h6>
            <p>{body}</p>
            <input
              type="text"
              placeholder="add a comment"
              style={{ color: "white" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ImagecardHome;
