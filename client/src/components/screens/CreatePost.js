import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate(); // Using useNavigate hook
  const [post, setPost] = useState({ title, body, imageUrl });

  useEffect(() => {
    if (imageUrl) {
      fetch("/createpost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify(post),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            console.log(data);
            navigate("/"); // Navigate to home
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [imageUrl, post, navigate]);

  const changeImage = (e) => {
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

    setImage(file);
  };

  const handleSubmit = async () => {
    if (!title || !body || !image) {
      alert("Please fill in all fields and upload an image");
      return;
    }

    // Create FormData and append the image file
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "insta-clone"); // Use the preset name

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dgrze5guo/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setImageUrl(data.secure_url);
      const postdata = {
        title,
        body,
        imageUrl: data.secure_url,
      };

      setPost(postdata);

      // Save the `post` object to MongoDB using your preferred method, e.g., via an API call
      console.log("Post data:", post);
      alert("Post submitted successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred during file upload");
    }
  };

  // Configure Cloudinary instance
  const cld = new Cloudinary({
    cloud: {
      cloudName: "dgrze5guo",
    },
  });

  // Configure the image transformation
  const img = imageUrl
    ? cld
        .image(imageUrl)
        .format("auto")
        .quality("auto")
        .resize(auto().gravity(autoGravity()).width(500).height(500))
    : null;

  return (
    <div
      className="card input-field"
      style={{
        margin: "10px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
        borderRadius: "10px",
        boxShadow:
          "0 4px 8px 0 rgba(255, 255, 255, 0.2), 0 6px 20px 0 rgba(255, 255, 255, 0.19)",
          backgroundColor:"#262626",
          color:"white"
      }}
    >
      <h2 className="instagram" style={{ color: "#e50056" }}>
        Post it !
      </h2>
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{color:"white"}}
      />
      <input
        type="text"
        placeholder="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        style={{color:"white"}}
      />
      <div className="file-field input-field">
        <div className="btn waves-effect waves-light #e91e63 pink">
          <span>Upload Image</span>
          <input type="file" onChange={changeImage} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" style={{color:"white"}} />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light #e91e63 pink"
        onClick={handleSubmit}
      >
        Submit Post
      </button>
      {imageUrl && img && (
        <div style={{ marginTop: "20px" }}>
          <AdvancedImage cldImg={img} />
        </div>
      )}
    </div>
  );
};

export default CreatePost;
