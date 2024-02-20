import { PropsWithChildren, createContext, useEffect, useState } from "react";

type Format = "dynamic" | "clean";
type WindowStatus = "too small" | "ok";

type formatContext = {
  windowStatus: WindowStatus; // used to notify context consumer if window is wide enough to change preference
  format: Format; // final context value applied -- either auto depending on screen width or preferenceFormat
  preferenceFormat: Format; // set by user -- applies if screen width allows for it
  setPreferenceFormat: (format: Format) => void;
};

export const formatContext = createContext<formatContext>({
  windowStatus: "ok",
  format: "dynamic",
  preferenceFormat: "dynamic",
  setPreferenceFormat: () => {},
});

export default function FormatContextProvider({ children }: PropsWithChildren) {
  const [windowStatus, setWindowStatus] = useState<WindowStatus>("ok");
  const [format, setFormat] = useState<Format>("dynamic");
  const [preferenceFormat, setPreferenceFormat] = useState<Format>("dynamic");

  //check if a preferred format has been stored in sessionStorage
  useEffect(() => {
    const preferenceFormatString = sessionStorage.getItem("preferenceFormat");
    if (preferenceFormatString == null) return;
    if (
      preferenceFormatString === "dynamic" ||
      preferenceFormatString === "clean"
    ) {
      setPreferenceFormat(preferenceFormatString);
    }
  }, []);

  function formatBasedOnWindow() {
    if (window.innerWidth <= 1000) {
      setWindowStatus("too small");
      setFormat("clean"); // if window is too small, set format to clean no matter preferences
    } else {
      setWindowStatus("ok");
      setFormat(preferenceFormat); // if window is wide enough, set format to preferenceFormat
    }
  }

  useEffect(() => {
    formatBasedOnWindow(); // initial call when app mounts
    window.addEventListener("resize", formatBasedOnWindow); // additional calls whenever window resizes
    return () => window.removeEventListener("resize", formatBasedOnWindow); // clean up event listener
  }, []);

  useEffect(() => {
    formatBasedOnWindow(); // additional calls whenever preferenceFormat is updated
  }, [preferenceFormat]);

  return (
    <formatContext.Provider
      value={{
        windowStatus: windowStatus,
        format: format,
        preferenceFormat: preferenceFormat,
        setPreferenceFormat: (format: Format) => {
          setPreferenceFormat(format);
        },
      }}
    >
      {children}
    </formatContext.Provider>
  );
}
