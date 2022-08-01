import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { fetchLogin } from "../../redux/slice/userSlice";
import styles from "./Login.module.scss";
const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { register, handleSubmit, setError } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (loginData: any) => {
    dispatch(fetchLogin(loginData));
    navigate("/");
  };

  return (
    <div className={styles.root}>
      <div className={styles.middleContainer}>
        <h2>Cloudify Login</h2>
        <div className={styles.signup}>
          Doesn't have an account <Link to="/register">Sign up</Link>
        </div>
        <form onSubmit={handleSubmit((data: any) => onSubmit(data))}>
          <div>
            <h3>Email</h3>
            <input {...register("email", { required: true, maxLength: 50 })} />
            <h3>Password</h3>
            <input
              {...register("password", { required: true, minLength: 3 })}
            />
          </div>
          <button type="submit">Sign in</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
