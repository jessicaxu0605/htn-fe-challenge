import { useState, useEffect, useContext } from "react";
import { Parallax } from "react-scroll-parallax";
import { Font } from "./util/styleTypes.tsx";
import { TEvent } from "./util/eventTypes.tsx";
import { formatContext } from "./contexts/FormatContext.tsx";
import { authContext } from "./contexts/AuthContext.tsx";
import EventPreviewCard from "./components/EventPreviewCard.tsx";
import styles from "./EventsPage.module.css";
import { getAllEventsPreview } from "./util/dataFetchingFuncs.tsx";

//NOTE: this component uses the same stylesheet as EventsPage

type EventsPreviewProps = {
  setEventsCallback: (events: TEvent[]) => void;
  openFullCard: (id: number, font: Font, color: number) => void;
};

export default function EventsPreview({
  setEventsCallback,
  openFullCard,
}: EventsPreviewProps) {
  const authContext_local = useContext(authContext);

  const [eventsPreview, setEventsPreview] = useState<TEvent[]>([]);
  const [previewDataFetched, setPreviewDataFetched] = useState<boolean>(false);
  const formatContext_local = useContext(formatContext);

  useEffect(() => {
    if (authContext_local.data.loginState != "unknown") {
      getEventsPreview();
    }
    return () => {
      setPreviewDataFetched(false);
      setEventsPreview([]);
    };
  }, [authContext_local.data.loginState]);

  async function getEventsPreview() {
    try {
      const result = await getAllEventsPreview(authContext_local.data);
      setEventsPreview(result);
      setEventsCallback(result);
      setPreviewDataFetched(true);
    } catch (err) {
      setPreviewDataFetched(false);
    }
  }

  if (!previewDataFetched) {
    return <div>Loading...</div>;
  }

  const what = () => {
    console.log("yep");
    return true;
  };

  if (formatContext_local.format == "dynamic")
    return (
      <div className={styles.sides}>
        {what() && <></>}
        <Parallax translateY={[-50, 50]}>
          <div className={styles.background}></div>
        </Parallax>
        <div className={styles.left}>
          {eventsPreview.map((event, index) =>
            //divide cards between left side and right side
            index % 2 === 0 ? (
              <EventPreviewCard
                key={index}
                eventData={event}
                side="left"
                openFullCard={openFullCard}
              />
            ) : null
          )}
        </div>
        <div className={styles.right}>
          {eventsPreview.map((event, index) =>
            //divide cards between left side and right side
            index % 2 === 1 ? (
              <EventPreviewCard
                key={index}
                eventData={event}
                side="right"
                openFullCard={openFullCard}
              />
            ) : null
          )}
        </div>
      </div>
    );
  else if (formatContext_local.format == "clean")
    return (
      <div className={styles.previews}>
        {what() && <></>}
        {eventsPreview.map((event, index) => (
          <EventPreviewCard
            key={index}
            eventData={event}
            side="left"
            openFullCard={openFullCard}
          />
        ))}
      </div>
    );
}
