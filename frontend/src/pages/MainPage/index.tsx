import React from "react";
import Aside from "./components/Aside";
import Main from "./components/Main";
import Header from "./components/Main/Header/Header";
import styles from "./MainPage.module.scss";

const MainPage = () => {
  return (
    <div className={styles.root}>
      <div className={styles.main}>
        <Header folderPath="gsg" />
        <div className={styles.content}>
          <Aside />
          <Main />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
