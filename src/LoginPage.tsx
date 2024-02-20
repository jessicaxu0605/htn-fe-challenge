import { useContext, useState } from "react";
import { authContext } from "./contexts/AuthContext";
import styles from "./LoginPage.module.css";
import buttonStyles from "./buttonStyles.module.css";
import { useNavigate } from "react-router-dom";

type LoginFormInputs = {
  email: string;
  password: string;
};

type LoginError = "no user found" | "password incorrect" | "none"; //add more errors as needed

export default function LoginPage() {
  const authContext_local = useContext(authContext);
  const [formInputs, setFormInputs] = useState<LoginFormInputs>({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState<LoginError>("none");
  const navigate = useNavigate();

  function handleLogin(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    // in a working application, fetch user data, password validation should take place in backend
    // for now, search hardcoded credentials, password validation implemented in function getUser
    const user = getUser(formInputs);
    if (user === "no user found") setLoginError("no user found");
    else if (user === "password incorrect") setLoginError("password incorrect");
    else {
      authContext_local.login(user);
      navigate("/");
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    setFormInputs((values) => ({ ...values, [name]: value }));
  }

  return (
    <div className={styles.parent}>
      <form onSubmit={handleLogin}>
        <h2 className="Space">Log in to view exclusive events!</h2>
        <input
          required
          type="text"
          name="email"
          placeholder="email"
          aria-label="email address"
          value={formInputs.email}
          onChange={handleInputChange}
          className={styles.textFields}
        />
        <input
          required
          type="password"
          name="password"
          placeholder="password"
          aria-label="password"
          value={formInputs.password}
          onChange={handleInputChange}
          className={styles.textFields}
        />
        <input
          type="submit"
          value="Log In"
          aria-label="log in button"
          className={`${styles.loginButton} ${buttonStyles.solidButton}`}
        />
        {loginError != "none" ? (
          <p className={styles.loginError}>{loginError}</p>
        ) : null}
      </form>
    </div>
  );
}

// FEATURES BELOW ONLY FOR THIS IMPLEMENATION WHERE USERS ARE HARD CODED ----------------------------

// hardcoded credentials:
// presumeably, user detail will be stored in a backend database, passwords would NOT be exposed, etc.
type userStoredData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: "hacker" | "other";
};

const users: userStoredData[] = [
  {
    email: "cracked.hacker@gmail.com",
    firstName: "cracked",
    lastName: "hacker",
    password: "not-a-good-password",
    role: "hacker",
  },
  {
    email: "notahacker@gmail.com",
    firstName: "nerd",
    lastName: "get better",
    password: "cat",
    role: "other",
  },
];

function getUser(formInputs: LoginFormInputs) {
  const user = users.find((user) => user.email === formInputs.email);
  console.log(user);
  if (!user) return "no user found";
  if (user.password != formInputs.password) {
    return "password incorrect";
  } else
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
}
