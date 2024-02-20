import { useState, useContext } from "react";
import { formatContext } from "./contexts/FormatContext";
import styles from "./EventsPage.module.css";
//types
import { Font } from "./util/styleTypes";
import { TEvent } from "./util/eventTypes";
// components
import EventFullCard from "./components/EventFullCard.tsx";
import CenterCard from "./components/CenterCard.tsx";
import SearchBar from "./components/SearchBar.tsx";
import EventPreview from "./EventPreview.tsx";
import BookmarksBar from "./components/BookmarksBar.tsx";

type FullCardStyles = {
  font: Font;
  color: number; //index in colorMap palette array
};

export default function EventsPage() {
  const [eventsPreview, setEventsPreview] = useState<TEvent[]>([]);
  const [fullCardId, setFullCardId] = useState<number | null>(null); //if null, fullCard will not be rendered

  const [fullCardStyles, setFullCardStyles] = useState<FullCardStyles>({
    font: "Exo",
    color: 1,
  }); //arbitrary default values for font and color

  const [searchBarOpen, setSearchBarOpen] = useState<boolean>(false);
  const [bookmarksBarOpen, setBookmarksBarOpen] = useState<boolean>(false);
  const formatContext_local = useContext(formatContext);

  function openFullCard(id: number, font: Font, color: number) {
    setFullCardId(id);
    setFullCardStyles({ font: font, color: color });
  }

  function setNewFullCard(id: number) {
    setFullCardId(id);
  }

  const fullCard =
    fullCardId != null ? (
      <div aria-modal="true" className={styles.fullCardContainer}>
        <EventFullCard
          id={fullCardId}
          font={fullCardStyles.font}
          color={fullCardStyles.color}
          setNewEvent={setNewFullCard}
          closeCard={() => setFullCardId(null)}
        />
      </div>
    ) : null;

  const searchBar = searchBarOpen ? (
    <div aria-modal="true" className={styles.searchBarContainer}>
      <SearchBar
        events={eventsPreview}
        setNewEvent={setNewFullCard}
        closeSearchBar={() => {
          setSearchBarOpen(false);
        }}
      />
    </div>
  ) : null;

  const bookmarksBar = bookmarksBarOpen ? (
    <div aria-modal="true" className={styles.searchBarContainer}>
      <BookmarksBar
        setNewEvent={setNewFullCard}
        closeBookmarksBar={() => {
          setBookmarksBarOpen(false);
        }}
      />
    </div>
  ) : null;

  const eventPreview = (
    // if an overlay modal is open, set rest of page to aria-hidden
    <div
      aria-hidden={
        searchBarOpen || bookmarksBarOpen || fullCardId != null
          ? "true"
          : "false"
      }
    >
      <EventPreview
        setEventsCallback={(events: TEvent[]) => {
          setEventsPreview(events);
        }}
        openFullCard={openFullCard}
      />
    </div>
  );

  const center = (
    <div
      // if an overlay modal is open, set rest of page to aria-hidden
      aria-hidden={
        searchBarOpen || bookmarksBarOpen || fullCardId != null
          ? "true"
          : "false"
      }
      className={styles.center}
    >
      <CenterCard
        openSearchBar={() => {
          setSearchBarOpen(true);
        }}
        openBookmarksBar={() => {
          setBookmarksBarOpen(true);
        }}
      />
    </div>
  );

  if (formatContext_local.format === "dynamic")
    //order event preview before center (order of DOM matters for styling and interactions)
    return (
      <div className={`${styles.parent} ${styles.dynamic}`}>
        {fullCard}
        {searchBar}
        {bookmarksBar}
        {eventPreview}
        {center}
      </div>
    );
  else if (formatContext_local.format === "clean")
    //order center before event preview
    return (
      <div className={`${styles.parent} ${styles.clean}`}>
        {fullCard}
        {searchBar}
        {bookmarksBar}
        {center}
        {eventPreview}
      </div>
    );
}
