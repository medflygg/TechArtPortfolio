export type RainForestParams = {
  /** 0 = night, 0.25 = dawn, 0.5 = noon, 0.75 = dusk */
  timeOfDay: number;
  autoCycle: boolean;
  /** 0 = no clouds, 1 = default, 2 = heavy */
  cloudCover: number;
  fogAmount: number;
  wind: number;
  /** 0 = summer (green), 1 = autumn (orange / yellow / red) */
  season: number;
  vignette: number;
};

export const defaultRainForestParams: RainForestParams = {
  timeOfDay: 0.42,
  autoCycle: false,
  cloudCover: 1,
  fogAmount: 1,
  wind: 1,
  season: 0,
  vignette: 1,
};
