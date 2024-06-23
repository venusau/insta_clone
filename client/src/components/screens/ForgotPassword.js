import { useState } from "react";

function ForgotPassword() {
    const [email, setEmail] = useState("");

    function handleSubmitForget(e) {
        e.preventDefault();
        fetch("/forget-password", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ email }) 
        })
        .then(response => response.json())
        .then(data => {
            if(data.message){
                alert(data.message);
                console.log(data.link);
            } else {
                alert(data.error);
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    return (
        <div className="container" style={{ marginTop: "50px" }}>
            <div className="card auth-card black input-field">
                <div className="card-content white-text">
                    <span className="card-title">Forgot Password</span>
                    <form className="col s12" onSubmit={handleSubmitForget}>
                        <div className="row">
                            <div className="input-field col s12">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="validate white-text"
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ borderBottom: "1px solid white" }}
                                />
                                <label htmlFor="email" className="white-text">Email</label>
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            className="btn pink"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
