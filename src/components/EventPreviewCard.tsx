import { useContext, useEffect, useState } from "react";
import { TEvent } from "../util/eventTypes";
import { Font, StyleState, TextDirection, colorMap } from "../util/styleTypes";
import { formatContext } from "../contexts/FormatContext";
import styles from "./EventPreviewCard.module.css";

/* 
renders a card to either the left or right of the page that 
displays an overview of the event: name, event_type, start_time
*/

type EventPreviewCardProps = {
  eventData: TEvent;
  side: "left" | "right"; // indicates whether card is on the right or left side of screen
  openFullCard: (id: number, font: Font, color: number) => void; // callback function to open this event in full
};

// prettier-ignore
export default function eventPreviewCard({eventData, side, openFullCard,}: EventPreviewCardProps) {
  const [styleState, setStyleState] = useState<StyleState>();
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const formatContext_local = useContext(formatContext);
  // generate style of component on mount
  useEffect(() => {
    
    setStyleState(generateStyle());
  }, []);

  // generates style state based on random factors
  // returns the generated style state
  function generateStyle(): StyleState {
    const numFonts = 4;
    const numColors = colorMap.length;

    // styles for background gradient randomized for both clean and dynamic formats
    const colorRandomizer = Math.random();
    const gradientAngleRandomizer = Math.random();
    let color = Math.floor(colorRandomizer * numColors);
    let gradientAngle = gradientAngleRandomizer * 60 + 150; //angle between 150 and 210

    // default values apply for clean format, randomized for dynamic format
    let textDirection: TextDirection = "horizontal";
    let divWidth = 60;
    let font: Font = "Exo";
    let top = 0;
    let side = 0;

    if (formatContext_local.format === "dynamic") {
      const topRandomizer = Math.random();
      const sideRandomizer = Math.random();
      const textDirectionRandomizer = Math.random();
      const fontRandomizer = Math.random();
      
      top = Math.floor(topRandomizer * 10) - 3;
      side = Math.floor(sideRandomizer * 10);

      //if name is short, randomly set text direction
      const wordsInName: string[] = eventData.name.split(" ");
      if (wordsInName.length <= 3 && textDirectionRandomizer > 0.5) {
        textDirection = "vertical";
        divWidth = wordsInName.length * 5.8; //set div width based on number of words in event name
      } else {
        //randomly set div width
        const longestWordLength = getLongestWordLength(wordsInName);
        const min_width = longestWordLength * 2.5; // set min_width such that no word gets split
        const max_width = min_width + 10;
        
        //if words are really long, minimize width
        if (longestWordLength > 10) {
          divWidth=(min_width);
          side = 0;
        } else {
          divWidth =
            Math.floor(Math.random() * (max_width - min_width + 1)) + min_width; // random number between min_width and max_width;
        }
      }
      if (fontRandomizer < 1 / numFonts) {
        font = "Exo";
      } else if (fontRandomizer < 2 / numFonts) {
        font = "MontserratAlternates";
      } else if (fontRandomizer < 3 / numFonts) {
        font = "Nunito";
      } else {
        font = "Space";
      }
    }

    return {
      divWidth: divWidth,
      textDirection: textDirection,
      font: font,
      color: color,
      top: top,
      side: side,
      gradientAngle: gradientAngle,
    };
  }

  function getLongestWordLength(words: string[]) {
    return Math.max(...words.map((word) => word.length));
  }

  // convert unix epoch time to readable time in local time-zone
  // eg. Monday January 1, 2024, 12:00 PM
  const readable_start_time = new Date(eventData.start_time).toLocaleString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    }
  );
  
  if (!styleState) return;

  const dynamicParentStyle = {
    width: `${styleState.divWidth}em`,
    marginTop: `${styleState.top}vh`,
    left: `${side === "left" ? `${styleState.side}vw` : ""}`,
    right: `${side === "right" ? `${styleState.side}vw` : ""}`,
  };

  const cardForegroundStyle = {
    boxShadow: `0 0 20px ${
      colorMap[styleState.color].primary
    }, inset 0 0 40px rgba(255, 255, 255, 0.5)`,
    background: `linear-gradient(${styleState.gradientAngle}deg, ${
      colorMap[styleState.color].primary
    }, ${colorMap[styleState.color].secondary})`,
  };

  const accentStyle = {
    textShadow: `0 0 10px ${colorMap[styleState.color].accent} `,
    color: colorMap[styleState.color].accent,
  };

  return (
    <button
      onMouseEnter={() => setIsFlashing(true)}
      onMouseLeave={() => setIsFlashing(false)}
      onClick={() =>
        openFullCard(eventData.id, styleState.font, styleState.color)
      }
      className={`
        ${styles.parent} 
        ${formatContext_local.format === "dynamic" ? styles.dynamic : styles.clean} 
        ${isFlashing ? styles.flash : ""}
      `}
      style={formatContext_local.format === "dynamic" ? dynamicParentStyle : {}}
    >
      <div
        className={styles.cardForeground}
        style={cardForegroundStyle}
      >
        <div
          className={`
          ${styleState.textDirection === "vertical" ? styles.verticalText : ""} 
          ${styleState.font}
        `}>
          <h1>
            {styleState.textDirection === "vertical"
              ? eventData.name
                  .split(" ")
                  .map((word, index) => <span key={index}>{word}</span>)
              : eventData.name}
          </h1>
        </div>
        <i
          style={accentStyle}
          className="eventType"
        >
          {eventData.event_type}
        </i>
        <p className="startTime">{readable_start_time}</p>
      </div>
    </button>
  );
}
