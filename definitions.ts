
export enum MedicationType {
  TABLET = 'Tablet',
  CAPSULE = 'Capsule',
  CREAM = 'Cream',
  OINTMENT = 'Ointment',
  LIQUID = 'Liquid',
  INHALER = 'Inhaler',
}

export enum DoseTime {
  MORNING = 'Morning',
  MIDDAY = 'Midday',
  EVENING = 'Evening',
  BEDTIME = 'Bedtime',
}

export const ALL_DOSE_TIMES: DoseTime[] = [
  DoseTime.MORNING,
  DoseTime.MIDDAY,
  DoseTime.EVENING,
  DoseTime.BEDTIME,
];

export interface Medication {
  id: string;
  name: string;
  type: MedicationType;
  dosage: string;
  purpose: string;
  scheduleTimes: DoseTime[];
  isAsNeeded: boolean;
  instructions: string;
}

export interface ScheduledDoseItem {
  id: string; // e.g., `${medication.id}-${doseTime}-${YYYY-MM-DD}`
  medicationId: string;
  medicationName: string;
  dosage: string;
  time: DoseTime;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export interface TakenDoseLog {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  timeTaken: string; // ISO string
  doseTimeScheduled?: DoseTime;
  isAsNeededLog: boolean;
}

export interface UserProfile {
  userName: string;
  doctorName: string;
  doctorPhone: string;
  pharmacyName: string;
  pharmacyPhone: string;
  knownAllergies: string;
  enablePushNotifications: boolean;
  enableEmailReminders: boolean;
}

export const LocalStorageKeys = {
  USER_PROFILE: 'allergyAllyUserProfile',
  MEDICATIONS: 'allergyAllyMedications',
  TAKEN_DOSE_LOGS: 'allergyAllyTakenDoseLogs',
  DAILY_SCHEDULED_DOSES: 'allergyAllyDailyScheduledDoses', // Stores { [date]: ScheduledDoseItem[] }
};

// ...existing code...
// REMOVE this line:
// export const generateId = (): string => self.crypto.randomUUID();

export const generateId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
};
// ...existing code...

export const getCurrentDateString = (): string => {
  const now = new Date();
  return now.toISOString().slice(0, 10); // YYYY-MM-DD
};