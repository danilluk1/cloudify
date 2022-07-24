import React from "react";
import saly from "../assets/Saly-13.png";
import rect from "../assets/Rectangle 1.png";
import "./login.css";

const Login: React.FC = () => {
  return (
    <div className="w-full h-screen flex bg-gradient-to-r from-amber-500 to-pink-300 items-center justify-center">
      <div className="w-4/5 h-2/3 bg-white rounded-50 p-3">
        <div className="bg-slate-300 rounded-50 w-full h-full flex relative flex-row">
          <div className="w-1/2 h-full">
            <img
              className="top-0 left-0 z-10 h-full absolute"
              src={saly}
              alt="img"
            />
            <img
              className="top-0 left-0 absolute h-full"
              src={rect}
              alt="img"
            />
          </div>
          <div className="w-1/2 h-full flex flex-col">
            <h1 className="text-2xl font-['Inter'] font-semibold text-left mt-7 mb-5">
              Welcome back to cloudify,
            </h1>
            <div className="w-1/2 box-sh">
              <input
                placeholder="Email"
                className="w-full bg-transparent mb-7 shadBox"
              />
              <input
                placeholder="Password"
                className="w-full bg-transparent mb-2 shadBox "
              />
            </div>
            <p className="text-xs">Don't have account sign up, here</p>
            <button className="shadBox">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
