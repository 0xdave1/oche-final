export type FieldMeasurement = {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday";
  time: string;
  ir: number;
  iy: number;
  ib: number;
  in: number;
};

export type ConnectedLoad = {
  category: string;
  quantity: number;
  avgRatingW: number;
  totalW: number;
  notes: string;
};

export type HighLoadSpace = {
  name: string;
  totalW: number;
  feeder: string;
};

export const fieldMeasurements: FieldMeasurement[] = [
  { day: "Monday", time: "08:00 AM", ir: 7.2, iy: 9.7, ib: 2.0, in: 6.4 },
  { day: "Monday", time: "09:00 AM", ir: 7.7, iy: 14.8, ib: 2.2, in: 9.2 },
  { day: "Monday", time: "10:00 AM", ir: 24.2, iy: 41.5, ib: 27.3, in: 12.8 },
  { day: "Monday", time: "11:00 AM", ir: 30.7, iy: 43.5, ib: 34.8, in: 14.3 },
  { day: "Monday", time: "12:00 PM", ir: 28.5, iy: 32.5, ib: 34.5, in: 12.5 },
  { day: "Monday", time: "01:00 PM", ir: 24.6, iy: 60.8, ib: 36.8, in: 32.6 },
  { day: "Tuesday", time: "09:00 AM", ir: 12.3, iy: 11.6, ib: 8.9, in: 7.2 },
  { day: "Tuesday", time: "10:00 AM", ir: 21.4, iy: 42.7, ib: 28.4, in: 12.5 },
  { day: "Tuesday", time: "11:00 AM", ir: 18.2, iy: 36.0, ib: 37.0, in: 20.9 },
  { day: "Tuesday", time: "12:00 PM", ir: 21.4, iy: 54.3, ib: 30.5, in: 25.8 },
  { day: "Tuesday", time: "01:00 PM", ir: 17.8, iy: 40.2, ib: 44.8, in: 28.5 },
  { day: "Tuesday", time: "02:00 PM", ir: 17.6, iy: 39.3, ib: 43.6, in: 16.5 },
  { day: "Wednesday", time: "08:00 AM", ir: 10.2, iy: 2.8, ib: 2.5, in: 7.8 },
  { day: "Wednesday", time: "09:00 AM", ir: 10.5, iy: 7.9, ib: 3.1, in: 7.2 },
  { day: "Wednesday", time: "10:00 AM", ir: 6.7, iy: 34.3, ib: 15.6, in: 20.5 },
  { day: "Wednesday", time: "11:00 AM", ir: 30.3, iy: 40.4, ib: 24.6, in: 11.6 },
  { day: "Wednesday", time: "12:00 PM", ir: 30.1, iy: 29.4, ib: 21.4, in: 10.5 },
  { day: "Wednesday", time: "01:00 PM", ir: 29.7, iy: 29.8, ib: 23.8, in: 8.2 },
  { day: "Wednesday", time: "02:00 PM", ir: 30.3, iy: 30.2, ib: 30.1, in: 7.6 },
  { day: "Thursday", time: "11:00 AM", ir: 20.9, iy: 31.7, ib: 18.7, in: 12.3 },
  { day: "Thursday", time: "12:00 PM", ir: 32.5, iy: 50.6, ib: 28.2, in: 18.7 },
  { day: "Thursday", time: "01:00 PM", ir: 26.4, iy: 45.2, ib: 24.3, in: 16.6 },
];

export const connectedLoads: ConnectedLoad[] = [
  { category: "Air-conditioners", quantity: 42, avgRatingW: 1825, totalW: 76656, notes: "Mostly measured" },
  { category: "Printers", quantity: 19, avgRatingW: 300, totalW: 5700, notes: "Typical nameplate" },
  { category: "Lighting (Bulbs)", quantity: 342, avgRatingW: 14, totalW: 4774, notes: "Mostly measured" },
  { category: "Water Dispensers", quantity: 9, avgRatingW: 500, totalW: 4500, notes: "Typical nameplate" },
  { category: "Computers (CPT)", quantity: 18, avgRatingW: 200, totalW: 3600, notes: "Typical nameplate" },
  { category: "Ceiling Fans", quantity: 51, avgRatingW: 65, totalW: 3315, notes: "Mostly measured" },
  { category: "Refrigerators", quantity: 8, avgRatingW: 150, totalW: 1200, notes: "Typical nameplate" },
  { category: "Projectors", quantity: 3, avgRatingW: 250, totalW: 750, notes: "Typical nameplate" },
  { category: "Televisions", quantity: 6, avgRatingW: 100, totalW: 600, notes: "Typical nameplate" },
];

export const highLoadSpaces: HighLoadSpace[] = [
  { name: "Board Room, SICT", totalW: 7619, feeder: "GK_SICT_7" },
  { name: "Dean of SICT / Toilet", totalW: 4811, feeder: "GK_SICT_7" },
  { name: "Board Room, Computer Eng.", totalW: 4374, feeder: "GK_SICT_6" },
  { name: "Admin Office", totalW: 3221, feeder: "GK_SICT_4" },
  { name: "HOD / Toilet, Telecoms", totalW: 3185, feeder: "GK_SICT_6" },
  { name: "Exam Office, Telecom", totalW: 2943, feeder: "GK_SICT_6" },
  { name: "HOD Software Science / Toilet", totalW: 2855, feeder: "GK_SICT_3" },
  { name: "HOD Office, MCE", totalW: 2816, feeder: "GK_SICT_5" },
  { name: "HOD Data Science / Toilet", totalW: 2755, feeder: "GK_SICT_4" },
  { name: "Secretary Office, SICT", totalW: 2645, feeder: "GK_SICT_7" },
];

export const projectMeta = {
  title: "Electrical Load Analysis of Solar Photovoltaic System Suitability: A Case Study of SICT Building, FUT Minna",
  candidate: "Oche Raphael Idoko (Matric No: 2021/1/83232EL)",
  department: "Materials and Metallurgical Engineering, Federal University of Technology, Minna, Niger State",
  supervisor: "Prof. Alkali Babawuya",
};
