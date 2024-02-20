import { useState, useEffect, useContext } from "react";
import { authContext } from "../contexts/AuthContext";
import { EventName, TEvent } from "../util/eventTypes";
import { Font, colorMap } from "../util/styleTypes";
import styles from "./EventFullCard.module.css";
import buttonStyles from "../buttonStyles.module.css";
import {
  getAllEventsNamesFromId,
  getEventFullFromId,
} from "../util/dataFetchingFuncs";
import BookmarkButton from "./BookmarkButton";

/* 
renders a card in the center of the page that displays 
all data relating to an event and links to related events
*/

type EventFullCardProps = {
  // properties inherited from preview card
  id: number;
  font: Font;
  color: number;

  // callback to EventPage; changes the event displayed by the card when related events links are clicked
  setNewEvent: (id: number) => void;
  closeCard: () => void;
};

// prettier-ignore
export default function eventFullCard({id, font, color, setNewEvent, closeCard,}: EventFullCardProps) {
  const [eventData, setEventData] = useState<TEvent>();
  // prettier-ignore
  const [relatedEventsData, setRelatedEventsData] = useState<EventName[]>([]);
  const [relatedEventsFetched, setRelatedEventsFetched] =
    useState<boolean>(false);
  const authContext_local = useContext(authContext);

  useEffect(() => {
    getData();

    // precautionary cleaup to reset states involving data fetching
    return () => {
      setRelatedEventsFetched(false);
      setEventData(undefined);
      setRelatedEventsData([]);
    };
  }, [id]);

  // getEventData, then getRelatedEventData for all related events
  async function getData() {
    try {
      const event_data_full = await getEventFullFromId(
        id,
        authContext_local.data
      );
      setEventData(event_data_full);

      // fetches and returns a list of events with name properties (filtered for public only if logged out)
      const related_events = await getAllEventsNamesFromId(
        event_data_full.related_events,
        authContext_local.data
      );
      setRelatedEventsData(related_events);
      setRelatedEventsFetched(true);
    } catch {
      setRelatedEventsFetched(false);
      setEventData(undefined);
      setRelatedEventsData([]);
    }
  }

  function getReadableStartTime(unix_time: number) {
    const localeString_options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(unix_time).toLocaleString("en-US", localeString_options);
  }
  function getReadableEndTime(unix_time: number) {
    const localeString_options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    };
    return new Date(unix_time).toLocaleString("en-US", localeString_options);
  }

  // returns comma separated list of all speaker names
  function getReadableSpeakerNames() {
    if (!eventData) return;
    const speakerNamesArray = eventData.speakers.map((speaker) => speaker.name);
    return speakerNamesArray.join(", ");
  }

  // dynamic styles:
  const cardForegroundStyle = {
    background: `linear-gradient(160deg, ${colorMap[color].primary}, ${colorMap[color].secondary})`,
    boxShadow: `0 0 20px ${colorMap[color].primary}, inset 0 0 40px rgba(255, 255, 255, 0.5)`,
  };
  const accentStyle = {
    textShadow: `0 0 10px ${colorMap[color].accent} `,
    color: colorMap[color].accent,
    fontWeight: "600",
  };

  // placeholder while data is being fetched from server
  if (!eventData)
    return (
      <>
        <div onClick={closeCard} className={styles.closeBackground}></div>
        <div className={styles.loading}>
          <h2>Loading...</h2>
        </div>
      </>
    );

  const isLoggedIn: boolean = authContext_local.data.loginState === "logged in";
  return (
    <>
      <div onClick={closeCard} className={styles.closeBackground}></div>
      <div className={styles.parent}>
        <div className={styles.cardForeground} style={cardForegroundStyle}>
          <div className={styles.closeButtonContainer}>
            <button
              tabIndex={1}
              onClick={closeCard}
              className={styles.closeButton}
              aria-label="close event"
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
          <div className={styles.cardBody}>
            <div className={styles.cardBaseInfo}>
              <h1 className={font}>{eventData.name}</h1>
              <i style={accentStyle}>{eventData.event_type}</i>
              <h3>
                {getReadableStartTime(eventData.start_time) +
                  "–" +
                  getReadableEndTime(eventData.end_time)}
              </h3>
              {isLoggedIn ? (
                <BookmarkButton
                  parentId={id}
                  textColor={colorMap[color].primary}
                />
              ) : null}
            </div>
            <p>{eventData.description}</p>
            {
              //if event has speakers, render speakers
              eventData.speakers.length > 0 ? (
                <div className={styles.speakers}>
                  <span style={accentStyle} className={styles.speakersHeading}>
                    Speakers:{" "}
                  </span>
                  {getReadableSpeakerNames()}
                </div>
              ) : null
            }
            <p style={accentStyle} className={styles.url}>
              <span>Learn more at </span>
              {isLoggedIn ? (
                <a href={eventData.private_url}>{eventData.private_url}</a>
              ) : (
                <a href={eventData.public_url}>{eventData.public_url}</a>
              )}
            </p>
            {
              // if event has related events, render related events
              eventData.related_events.length > 0 ? (
                <div className={styles.relatedEvents}>
                  <p>You may also be interested in these related events:</p>
                  {
                    // wait for names of related events from API, then render
                    relatedEventsFetched ? (
                      relatedEventsData.map((event, index) => (
                        <button
                          key={index}
                          onClick={() => setNewEvent(event.id)}
                          className={buttonStyles.outlineButton}
                        >
                          {event.name}
                        </button>
                      ))
                    ) : (
                      <p>Loading...</p>
                    )
                  }
                </div>
              ) : null
            }
          </div>
        </div>
      </div>
    </>
  );
}
