export interface Activity {
  id: number;
  name: string;
  distance: number;
  pace: string;
  duration: string;
  elevation_gain: number;
  type: string;
  date: string;
  calories?: number;
}

export interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  total_elevation_gain: number;
  type: string;
  start_date: string;
  calories?: number;
}
