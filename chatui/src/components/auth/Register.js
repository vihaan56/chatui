import './auth.css'
import React,{useState, useEffect} from 'react'
import axios from 'axios'
import { Navigate, useNavigate } from "react-router-dom";
const Register = () => {
  const host = "http://localhost:3002";

  const [name, setname] = useState("");
  const [surname, setsurname] = useState("");
  const [phone, setphone] = useState("");

  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [loading,setLoading]  = useState(false);
  const [error,seterror] = useState("");
  const [flag,setflag] = useState(false)


  useEffect(()=>{
    if (localStorage.getItem("authtoken") != null) {
      const authaxios = axios.create({
        baseURL: host,
        headers: {
          "auth-token": localStorage.getItem("authtoken"),
        },
      });
      const headers = {
        auth: localStorage.getItem("authtoken"),
      };
      authaxios
        .post(`${host}/api/v1/secure/checktoken`, {
          headers: headers,
        })
        .then((response) => {
          if (response.data.status === "success") {
            //  history.push("/")
            setflag(true);
          }
        })
        .catch((response) => {
          console.log(response);
        });
    }
  
  })
  if(flag){
    return <Navigate to="/displayuser"></Navigate>
  }


  const handlesubmit = async(e)=>{
    e.preventDefault();
    setLoading(true);
    
    var name = e.target[0].value;
    var surname = e.target[1].value;
    var phone = e.target[2].value;
    var username = e.target[3].value;
    var password = e.target[4].value;
    console.log(name,surname,phone,username,password);
  //  var username = e.target[0].value;
  //  var password = e.target[1].value; 
   if(name== null || name.length === 0 || phone== null || phone.length === 0 || surname== null || surname.length === 0 || username == null || username.length === 0 || password == null || password.length === 0){
         seterror("Register credentials required");
         setLoading(false);

         return;
   }
   const response = await fetch(`${host}/api/v1/secure/register`, {
     method: "POST", 
     origin: true, 
     headers: {
       "Content-Type": "application/json",
     },

     body: JSON.stringify({ name:name,surname:surname,phone:phone,username:username,password:password}),
   });

   const json = await response.json();
   setLoading(false);
   if(json.status === "success"){
     localStorage.setItem("authtoken", json.authtoken);
     localStorage.setItem("userid", json.userid);
   }
   else{
     setLoading(false);
     
     // e.target[1].value 
     seterror(json.message);
   }
   }

  return (
    <div className="main_div">
    <div className="form">
      <div className="form-signin">
        <form className="form-container" onSubmit={handlesubmit}>
          <div className="heading-container">
            <h1 className="h4 mb-3 fw-normal">Register</h1>
          </div>
         <div className="error">{error}</div>
          <div className="form-container">
            <div className="status"></div>
            <div className="form-floating my-2">
              <input
                type="text"
                className="form-control"
                name="name"
                id="name"
                placeholder="name"
                value={name}
                onChange={(e) => setname(e.target.value)}
              />
              <label htmlFor="floatingInput">Name</label>
            </div>
            <div className="form-floating my-2">
              <input
                type="text"
                className="form-control"
                name="surname"
                id="surname"
                placeholder="surname"
                value={surname}
                onChange={(e) => setsurname(e.target.value)}
              />
              <label htmlFor="floatingInput">surname</label>
            </div>

            <div className="form-floating my-2">
              <input
                type="text"
                className="form-control"
                name="phone"
                id="phone"
                placeholder="phone"
                value={phone}
                onChange={(e) => setphone(e.target.value)}
              />
              <label htmlFor="floatingInput">Phone Number</label>
            </div>
            
            <div className="form-floating my-2">
              <input
                type="text"
                className="form-control"
                name="username"
                id="username"
                placeholder="username"
                value={username}
                onChange={(e) => setusername(e.target.value)}
              />
              <label htmlFor="floatingInput">Username</label>
            </div>
            <div className="form-floating my-2">
              <input
                type="password"
                className="form-control"
                name="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>

            <button
              id="button"
              className="w-100 btn btn-lg btn-primary my-2"
              type="submit"
            >
              {loading?"Loading...":"Register"} 
            </button>
          </div>
        </form>

        <div className="login-footer">
          Already hava an account?
          <a
            className="login-link"
            href="/login"
            data-purpose="login-link-signup-popup"
          >
            Log in
          </a>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Register;
