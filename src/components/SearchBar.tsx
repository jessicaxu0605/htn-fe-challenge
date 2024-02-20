import { useState } from "react";
import { TEvent } from "../util/eventTypes";
import styles from "./SearchBar.module.css";
import buttonStyles from "../buttonStyles.module.css";

/* 
modal overlay that allows user to search for event based on event_name
*/

type SearchBarProps = {
  events: TEvent[];
  setNewEvent: (id: number) => void;
  closeSearchBar: () => void;
};

export default function SearchBar({
  events,
  setNewEvent,
  closeSearchBar,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchComplete, setSearchComplete] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<TEvent[]>([]);

  function handleSearch(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    //first search for exact matches
    const exactMatches = events.filter(
      (event) => event.name.toLowerCase() === searchTerm.toLowerCase() // make everything lowercase to avoid case conflicts
    );

    //then search word by word
    const keywords: string[] = searchTerm.split(" ");
    const notExactMatches = events.filter(
      (event) => event.name.toLowerCase() != searchTerm.toLowerCase() // make everything lowercase to avoid case conflicts
    );
    const closeMatches = notExactMatches.filter((event) =>
      event.name
        .toLowerCase()
        .split(" ")
        .some((word) => keywords.includes(word.toLowerCase()))
    );

    //finally search for substrings
    const notCloseMatches = notExactMatches.filter(
      (event) =>
        !event.name
          .toLowerCase()
          .split(" ")
          .some((word) => keywords.includes(word.toLowerCase()))
    );
    const partialMatches = notCloseMatches.filter((event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const results = [...exactMatches, ...closeMatches, ...partialMatches];
    setSearchResults(results);
    setSearchComplete(true);
  }

  return (
    <>
      {/* clicking background closes modal*/}
      <div
        onClick={closeSearchBar}
        className={styles.closeBackground}
      ></div>{" "}
      <div className={styles.parent}>
        <div className={styles.closeButtonContainer}>
          <button
            tabIndex={1}
            onClick={closeSearchBar}
            className={styles.closeButton}
            aria-label="close search bar"
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
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <h2>Find an Event</h2>
            <input
              type="text"
              placeholder="Search for an event"
              aria-label="search bar input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchBar}
            />
            <input
              className={`${styles.submitSearch} ${buttonStyles.outlineButton}`}
              type="submit"
              value="Search"
              aria-label="search button"
            />
          </form>
          <div className={styles.searchResults} aria-label="search results">
            {searchResults.length == 0 ? (
              searchComplete ? (
                <p>Your search did not match any events</p>
              ) : null
            ) : (
              searchResults.map((event, index) => (
                <button
                  key={index}
                  className={buttonStyles.outlineButton}
                  onClick={() => {
                    setNewEvent(event.id);
                    closeSearchBar();
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
