export var MedicationType;
(function (MedicationType) {
    MedicationType["TABLET"] = "Tablet";
    MedicationType["CAPSULE"] = "Capsule";
    MedicationType["CREAM"] = "Cream";
    MedicationType["OINTMENT"] = "Ointment";
    MedicationType["LIQUID"] = "Liquid";
    MedicationType["INHALER"] = "Inhaler";
})(MedicationType || (MedicationType = {}));
export var DoseTime;
(function (DoseTime) {
    DoseTime["MORNING"] = "Morning";
    DoseTime["MIDDAY"] = "Midday";
    DoseTime["EVENING"] = "Evening";
    DoseTime["BEDTIME"] = "Bedtime";
})(DoseTime || (DoseTime = {}));
export const ALL_DOSE_TIMES = [
    DoseTime.MORNING,
    DoseTime.MIDDAY,
    DoseTime.EVENING,
    DoseTime.BEDTIME,
];
export const LocalStorageKeys = {
    USER_PROFILE: 'allergyAllyUserProfile',
    MEDICATIONS: 'allergyAllyMedications',
    TAKEN_DOSE_LOGS: 'allergyAllyTakenDoseLogs',
    DAILY_SCHEDULED_DOSES: 'allergyAllyDailyScheduledDoses', // Stores { [date]: ScheduledDoseItem[] }
};
// ...existing code...
// REMOVE this line:
// export const generateId = (): string => self.crypto.randomUUID();
export const generateId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    // Fallback for environments without crypto.randomUUID
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
};
// ...existing code...
export const getCurrentDateString = () => {
    const now = new Date();
    return now.toISOString().slice(0, 10); // YYYY-MM-DD
};
