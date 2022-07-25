import React from "react";
import Aside from "./components/Aside";
import Main from "./components/Main";
import styles from "./MainPage.module.scss";

const MainPage = () => {
  return <div className={styles.root}>
    <div className={styles.main}>
      <Aside/>
      <Main/>
    </div>
  </div>;
};

export default MainPage;
