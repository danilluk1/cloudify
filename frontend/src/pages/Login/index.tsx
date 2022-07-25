import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../redux/hooks";
import { fetchLogin } from "../../redux/slice/userSlice";
import styles from "./Login.module.scss";
const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const { register, handleSubmit, setError } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (loginData: any) => {
    console.log(loginData);
    dispatch(fetchLogin(loginData));
  };

  return (
    <div className={styles.root}>
      <div className={styles.middleContainer}>
        <h2>Transparent Login Form</h2>
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
