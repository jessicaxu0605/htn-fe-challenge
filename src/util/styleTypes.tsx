export type TextDirection = "vertical" | "horizontal";
export type Font = "Exo" | "MontserratAlternates" | "Nunito" | "Space";

export type StyleState = {
  divWidth: number; // in em
  textDirection: TextDirection; // vertical or horizontal
  font: Font; //event heading font
  color: number; //colorMap index
  top: number; //css 'top' property in rem
  side: number; //css 'left' or 'right' in rem, depending on which side the card is placed
  gradientAngle: number; //tilt angle for backdrop gradient
};

export const colorMap = [
  {
    primary: "rgb(210, 40, 180)", //magenta
    secondary: "rgb(220, 120, 10)", //red-orange
    accent: "rgb(255, 255, 0)", //yellow
  },
  {
    primary: "rgb(10, 160, 180)", //cyan
    secondary: "rgb(120, 10, 140)", //purple
    accent: "rgb(230, 0, 160)", //pink
  },
  {
    primary: "rgb(10, 200, 200)", //aqua
    secondary: "rgb(255, 160, 0)", //yellow
    accent: "rgb(240, 50, 0)", // red-orange
  },
];
