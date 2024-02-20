import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../contexts/AuthContext";
import { formatContext } from "../contexts/FormatContext";
import styles from "./CenterCard.module.css";
import buttonStyles from "../buttonStyles.module.css";

/* 
renders a card in the center of the page that 
1. serves as an intro to the page
2. displays button to login/logout
*/

type CenterCardProps = {
  openSearchBar: () => void;
  openBookmarksBar: () => void;
};
export default function CenterCard({
  openSearchBar,
  openBookmarksBar,
}: CenterCardProps) {
  const authContext_local = useContext(authContext);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>();
  const formatContext_local = useContext(formatContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(authContext_local.data.loginState);
    setIsLoggedIn(authContext_local.data.loginState === "logged in");
  }, [authContext_local.data.loginState]);

  function togglePreferenceFormat() {
    if (formatContext_local.format === "dynamic") {
      formatContext_local.setPreferenceFormat("clean");
      sessionStorage.setItem("preferenceFormat", "clean"); // save preference for duration of user session
    } else {
      formatContext_local.setPreferenceFormat("dynamic");
      sessionStorage.setItem("preferenceFormat", "dynamic"); // save preference for duration of user session
    }
  }

  function logout() {
    authContext_local.logout();
    sessionStorage.clear(); // clear stored user credentials and bookmarks
  }

  // redirect to login page
  function openLogin() {
    sessionStorage.clear(); // precautionary clear for residual data from previous sessions
    navigate("/login");
  }

  const formatButton = (
    <button
      tabIndex={4}
      className={`${buttonStyles.outlineButton}`}
      onClick={togglePreferenceFormat}
    >
      {formatContext_local.format === "dynamic"
        ? "Use Clean Format"
        : "Use Dynamic Format"}
    </button>
  );

  const loginButton = (
    <button
      tabIndex={1}
      className={`${buttonStyles.solidButton}`}
      onClick={openLogin}
    >
      Log In for More Events
    </button>
  );

  const logoutButton = (
    <button
      tabIndex={1}
      className={`${styles.login} ${buttonStyles.solidButton}`}
      onClick={logout}
    >
      Log Out
    </button>
  );

  const searchButton = (
    <button
      tabIndex={2}
      className={`${buttonStyles.solidButton}`}
      onClick={openSearchBar}
    >
      Search for Events
    </button>
  );

  const bookmarksButton = (
    <button
      tabIndex={3}
      className={`${buttonStyles.solidButton}`}
      onClick={openBookmarksBar}
    >
      Bookmarks
    </button>
  );
  return (
    <div
      className={`${styles.parent} ${
        formatContext_local.format === "dynamic" ? styles.dynamic : styles.clean
      }`}
    >
      {authContext_local.data.loginState === "logged in" ? ( // have to use long form instead of isLoggedIn to get Typescript to comply
        <>
          <h2>
            Hi{" "}
            <span className={styles.glow}>
              {authContext_local.data.userData.firstName}!
            </span>
          </h2>
          <h2>Welcome back to </h2>
          <h1 className={styles.glow}>Hackathon Global!</h1>
        </>
      ) : (
        <>
          <h2>Welcome to </h2>
          <h1 className={styles.glow}>Hackathon Global!</h1>
        </>
      )}

      <div className={styles.buttonContainer}>
        {isLoggedIn ? logoutButton : loginButton}
        {searchButton}
        {isLoggedIn ? bookmarksButton : null}
        {formatContext_local.windowStatus === "ok" && formatButton}
      </div>

      {formatContext_local.format === "dynamic" && (
        <h2 className={styles.scrollIndicator}>Scroll</h2>
      )}
    </div>
  );
}
