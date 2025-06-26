import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppContext, PillIcon, CreamIcon } from '../App';
import { DoseTime, MedicationType } from '../definitions';
const DailyScheduleItem = ({ medication, time }) => {
    const getIcon = (type) => {
        switch (type) {
            case MedicationType.TABLET:
            case MedicationType.CAPSULE:
            case MedicationType.LIQUID:
            case MedicationType.INHALER:
                return _jsx(PillIcon, { className: "text-primary w-5 h-5 mr-2" });
            case MedicationType.CREAM:
            case MedicationType.OINTMENT:
                return _jsx(CreamIcon, { className: "text-primary w-5 h-5 mr-2" });
            default:
                return _jsx(PillIcon, { className: "text-primary w-5 h-5 mr-2" });
        }
    };
    return (_jsxs("div", { className: "flex items-center p-2 bg-slate-50 rounded", children: [getIcon(medication.type), _jsxs("div", { children: [_jsx("span", { className: "font-medium text-textPrimary", children: medication.name }), _jsxs("span", { className: "text-xs text-textSecondary ml-1", children: ["(", medication.dosage, ")"] }), _jsx("span", { className: "text-xs text-primary ml-2 font-semibold", children: time })] })] }));
};
const MySchedulePage = () => {
    const { state } = useAppContext();
    const { medications } = state;
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    // For this simple weekly view, we assume all scheduled medications are for every day.
    // A more complex app might have day-specific schedules.
    const getScheduledDosesForDay = () => {
        const doses = [];
        medications.forEach(med => {
            if (!med.isAsNeeded) {
                med.scheduleTimes.forEach(time => {
                    doses.push({ medication: med, time });
                });
            }
        });
        // Sort by standard dose times
        const timeOrder = { [DoseTime.MORNING]: 1, [DoseTime.MIDDAY]: 2, [DoseTime.EVENING]: 3, [DoseTime.BEDTIME]: 4 };
        return doses.sort((a, b) => timeOrder[a.time] - timeOrder[b.time]);
    };
    const dailyDoses = getScheduledDosesForDay();
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-3xl font-bold text-textPrimary", children: "My Schedule" }), _jsx("p", { className: "text-textSecondary", children: "Here's your weekly medication overview. This page is for viewing your general routine." }), medications.length === 0 || dailyDoses.length === 0 ? (_jsxs("div", { className: "text-center py-10 bg-surface rounded-lg shadow", children: [_jsx(PillIcon, { className: "mx-auto text-primary opacity-50 w-16 h-16 mb-4" }), _jsx("p", { className: "text-textSecondary text-lg", children: "No medications scheduled yet." }), _jsx("p", { className: "text-textSecondary mb-6", children: "Add medications and their schedules on the \"My Medications\" page." })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: daysOfWeek.map(day => (_jsxs("div", { className: "bg-surface rounded-lg shadow p-4", children: [_jsx("h2", { className: "text-xl font-semibold text-textPrimary border-b border-slate-200 pb-2 mb-3", children: day }), dailyDoses.length > 0 ? (_jsx("div", { className: "space-y-2", children: dailyDoses.map((doseItem, index) => (_jsx(DailyScheduleItem, { medication: doseItem.medication, time: doseItem.time }, `${doseItem.medication.id}-${doseItem.time}-${index}`))) })) : (_jsxs("p", { className: "text-sm text-textSecondary", children: ["No scheduled medications for ", day.toLowerCase(), "."] }))] }, day))) }))] }));
};
export default MySchedulePage;
