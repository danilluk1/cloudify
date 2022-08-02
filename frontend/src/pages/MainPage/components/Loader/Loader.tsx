import React from "react";
import { Triangle } from "react-loader-spinner";
import styles from "./Loader.module.scss";

const Loader = () => {
  return (
    <Triangle
      height="500"
      width="500"
      color="lightskyblue"
      ariaLabel="triangle-loading"
      visible={true}
    />
  );
};

export default Loader;
