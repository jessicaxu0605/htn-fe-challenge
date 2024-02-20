import { PropsWithChildren, createContext, useEffect, useState } from "react";

type userData = {
  email: string;
  firstName: string;
  lastName: string;
  role: "hacker" | "other"; //add other roles as needed, eg. admin roles
};

// when logged in, context stores user data
type LoggedInData = {
  loginState: "logged in";
  userData: userData;
};

// no user data is stored when logged out
type LoggedOutData = {
  loginState: "logged out";
};

type UnknownData = {
  loginState: "unknown";
};

// structure of data stored in authContext
export type AuthContextData = LoggedInData | LoggedOutData | UnknownData;

// represents authContext, including data and functions to modify data
type AuthContext = {
  data: AuthContextData;
  login: (user: userData) => void;
  logout: () => void;
};

export const authContext = createContext<AuthContext>({
  data: { loginState: "unknown" }, // logged out by default
  login: () => {}, //placeholder, see below for implementation
  logout: () => {}, //placeholder
});

//provides authentication context to entire application
export default function AuthContextProvider({ children }: PropsWithChildren) {
  // prettier-ignore
  const [authContextData, setAuthContextData] = useState<AuthContextData>({
    loginState: "unknown",
  });

  // on application mount, check if user credentials have been saved in sessionStorage; if so, login with stored credentials
  useEffect(() => {
    const userString = sessionStorage.getItem("hackathonGlobalUser");
    if (userString == null) {
      logout();
      return;
    }

    const userData = userString.split(", ");
    if (userData.length != 4) {
      logout();
      return;
    }

    let role: "hacker" | "other";
    if (userData[3] === "hacker" || userData[3] === "other") {
      role = userData[3];
    } else {
      logout();
      return;
    }
    const email = userData[0];
    const firstName = userData[1];
    const lastName = userData[2];
    const user: userData = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      role: role,
    };
    login(user);
  }, []);

  // function triggered from LoginPage if login is successful
  function login(user: userData) {
    const newAuthContextData: AuthContextData = {
      loginState: "logged in",
      userData: user,
    };
    sessionStorage.setItem(
      "hackathonGlobalUser",
      [user.email, user.firstName, user.lastName, user.role].join(", ")
    );
    setAuthContextData(newAuthContextData);
  }

  // function triggered from centerCard
  function logout() {
    setAuthContextData({ loginState: "logged out" });
  }

  return (
    <authContext.Provider
      value={{
        data: authContextData,
        login: login,
        logout: logout,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
