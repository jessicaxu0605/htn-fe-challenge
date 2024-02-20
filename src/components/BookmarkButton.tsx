import { useEffect, useState } from "react";
import buttonStyles from "../buttonStyles.module.css";

/* 
button rendered from an EventFullCard if user is logged in
- checks if parent event has been bookmarked
- provides functions to bookmark and unbookmark parent event
*/

type BookmarkButtonProps = {
  parentId: number;
  textColor: string;
};

export default function BookmarkButton({
  parentId,
  textColor,
}: BookmarkButtonProps) {
  const [parentIsBookmarked, setParentIsBookmarked] = useState<boolean>(false);

  useEffect(() => {
    setParentIsBookmarked(checkIfBookmarked()); //set initial value for isBookmarked state
  }, []);

  // returns bookmarks list if it contains current event, otherwise returns null
  function checkIfBookmarked() {
    const bookmarksString = sessionStorage.getItem("bookmarkedEvents");
    if (bookmarksString == null) return false;

    const bookmarks = bookmarksString.split(", ");
    if (bookmarks.includes(parentId.toString())) return true;
    return false;
  }

  function addBookmark() {
    //bookmarkedEvents is a comma separated list containing ids of bookemarked events
    const bookmarksString = sessionStorage.getItem("bookmarkedEvents");
    if (bookmarksString == null || bookmarksString === "") {
      sessionStorage.setItem("bookmarkedEvents", parentId.toString());
    } else {
      sessionStorage.setItem(
        "bookmarkedEvents",
        bookmarksString + ", " + parentId.toString()
      );
    }
    setParentIsBookmarked(true);
  }

  function removeBookmark() {
    if (!checkIfBookmarked) return;

    const bookmarksString = sessionStorage.getItem("bookmarkedEvents");
    if (bookmarksString == null || bookmarksString === "") return;

    const bookmarks = bookmarksString.split(", ");
    const newBookmarks = bookmarks.filter(
      (event_id) => event_id != parentId.toString()
    ); //remove the id of the current event

    sessionStorage.setItem("bookmarkedEvents", newBookmarks.join(", "));
    setParentIsBookmarked(false);
  }

  return (
    <button
      onClick={parentIsBookmarked ? removeBookmark : addBookmark}
      style={{ color: textColor }}
      className={buttonStyles.solidButton}
    >
      {parentIsBookmarked ? "Remove from Bookmarks" : "Bookmark Event"}
    </button>
  );
}
