import { useContext, useEffect, useState } from "react";
import { EventName } from "../util/eventTypes";
import styles from "./BookmarksBar.module.css";
import buttonStyles from "../buttonStyles.module.css";
import { getAllEventsNamesFromId } from "../util/dataFetchingFuncs";
import { authContext } from "../contexts/AuthContext";

/* 
modal overlay that allows a logged in user to view their bookmarks
*/

type BookmarksBarProps = {
  setNewEvent: (id: number) => void; // callback function to open linked event when a bookmarked event is clicked
  closeBookmarksBar: () => void; // callback funtion to close this overlay
};

export default function BookmarksBar({
  setNewEvent,
  closeBookmarksBar,
}: BookmarksBarProps) {
  const [bookmarkedEvents, setBookmarkedEvents] = useState<EventName[]>([]);
  const authContext_local = useContext(authContext);

  // on mount, get bookmarks (if any) from session storage
  useEffect(() => {
    getBookmarks();
  }, []);

  async function getBookmarks() {
    //bookmarkedEvents is a comma separated list containing ids of bookemarked events
    const bookmarksString = sessionStorage.getItem("bookmarkedEvents");
    if (bookmarksString == null || bookmarksString === "") return; // if no bookmarks found, keep bookmarkedEvents as empty array
    const bookmarkIdStrings = bookmarksString.split(", ");
    const bookmarkIds = bookmarkIdStrings.map((idString) => parseInt(idString));

    //request names of events from server
    const bookmarks = await getAllEventsNamesFromId(
      bookmarkIds,
      authContext_local.data
    );
    setBookmarkedEvents(bookmarks);
  }

  return (
    <>
      {/* clicking background closes modal*/}
      <div onClick={closeBookmarksBar} className={styles.closeBackground}></div>
      <div className={styles.parent}>
        <div className={styles.closeButtonContainer}>
          <button
            tabIndex={1}
            onClick={closeBookmarksBar}
            className={styles.closeButton}
            aria-label="close bookmarks"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512">
              {/* <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--> */}
              <path
                fill="white"
                d="M242.7 256l100.1-100.1c12.3-12.3 12.3-32.2 0-44.5l-22.2-22.2c-12.3-12.3-32.2-12.3-44.5 0L176 189.3 75.9 89.2c-12.3-12.3-32.2-12.3-44.5 0L9.2 111.5c-12.3 12.3-12.3 32.2 0 44.5L109.3 256 9.2 356.1c-12.3 12.3-12.3 32.2 0 44.5l22.2 22.2c12.3 12.3 32.2 12.3 44.5 0L176 322.7l100.1 100.1c12.3 12.3 32.2 12.3 44.5 0l22.2-22.2c12.3-12.3 12.3-32.2 0-44.5L242.7 256z"
              />
            </svg>
          </button>
        </div>
        <div>
          <h2>Your Bookmarks</h2>
          <div className={styles.bookmarks}>
            {bookmarkedEvents.length === 0 ? (
              <p>You have no bookmarked events</p>
            ) : (
              bookmarkedEvents.map((event, index) => (
                <button
                  key={index}
                  className={buttonStyles.outlineButton}
                  onClick={() => {
                    setNewEvent(event.id);
                    closeBookmarksBar();
                  }}
                >
                  {event.name}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
