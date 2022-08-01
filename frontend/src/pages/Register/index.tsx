import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { fetchRegister } from "../../redux/slice/userSlice";
import styles from "./Register.module.scss";
const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { register, handleSubmit, setError } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (loginData: any) => {
    console.log(loginData);
    dispatch(fetchRegister(loginData));
    navigate("/");
  };

  return (
    <div className={styles.root}>
      <div className={styles.middleContainer}>
        <h2>Cloudify Register</h2>
        <div className={styles.signin}>
          Already have an account, <Link to="/login">Sign in</Link>
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
          <button type="submit">Sign up</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
