import React from "react";
import { rootCertificates } from "tls";
import { useAppSelector } from "../../redux/hooks";
import Aside from "./components/Aside";
import Main from "./components/Main";
import Header from "./components/Main/Header/Header";
import ProgressModal from "./components/ProgressModal";
import styles from "./MainPage.module.scss";

const components = [
  "body",
  "components",
  "font",
  "main-shadow",
  "header",
  "border",
];

const MainPage = () => {
  const { theme, isProgressLoaderShown } = useAppSelector(
    (state) => state.userSlice
  );

  React.useEffect(() => {
    const root = document.querySelector(":root") as HTMLElement;
    if (!root) return;

    components.forEach((component) => {
      root.style.setProperty(
        `--${component}-default`,
        `var(--${component}-${theme})`
      );
    });
  }, [theme]);
  return (
    <div className={styles.root}>
      <div className={styles.main}>
        <Header />
        <div className={styles.content}>
          <Aside />
          <Main />
        </div>
        {isProgressLoaderShown === true ? <ProgressModal /> : <></>}
      </div>
    </div>
  );
};

export default MainPage;
