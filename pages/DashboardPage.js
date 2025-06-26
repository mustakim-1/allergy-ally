import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { useAppContext, PillIcon, CreamIcon, Modal, PlusCircleIcon } from '../App';
import { MedicationType, generateId, ALL_DOSE_TIMES } from '../definitions';
import { useNavigate } from 'react-router-dom';
const DoseItem = ({ dose, onToggleComplete }) => {
    const { state } = useAppContext();
    const medication = state.medications.find(m => m.id === dose.medicationId);
    const getIcon = (type) => {
        switch (type) {
            case MedicationType.TABLET:
            case MedicationType.CAPSULE:
            case MedicationType.LIQUID:
            case MedicationType.INHALER:
                return _jsx(PillIcon, { className: "text-primary w-6 h-6" });
            case MedicationType.CREAM:
            case MedicationType.OINTMENT:
                return _jsx(CreamIcon, { className: "text-primary w-6 h-6" });
            default:
                return _jsx(PillIcon, { className: "text-primary w-6 h-6" });
        }
    };
    return (_jsxs("div", { className: `p-4 rounded-lg shadow flex items-center space-x-4 transition-all duration-300 ${dose.completed ? 'bg-green-50 opacity-70' : 'bg-surface'}`, children: [_jsx("div", { className: "flex-shrink-0", children: getIcon(medication === null || medication === void 0 ? void 0 : medication.type) }), _jsxs("div", { className: "flex-grow", children: [_jsx("h3", { className: `font-semibold text-textPrimary ${dose.completed ? 'line-through' : ''}`, children: dose.medicationName }), _jsx("p", { className: `text-sm text-textSecondary ${dose.completed ? 'line-through' : ''}`, children: dose.dosage }), (medication === null || medication === void 0 ? void 0 : medication.instructions) && _jsx("p", { className: `text-xs text-slate-500 mt-1 ${dose.completed ? 'line-through' : ''}`, children: medication.instructions })] }), _jsx("input", { type: "checkbox", checked: dose.completed, onChange: (e) => onToggleComplete(dose.id, e.target.checked), className: "form-checkbox h-6 w-6 text-primary rounded border-slate-300 focus:ring-primary-dark", "aria-label": `Mark ${dose.medicationName} as ${dose.completed ? 'incomplete' : 'complete'}` })] }));
};
const LogAsNeededModal = ({ isOpen, onClose, onLog }) => {
    const { state } = useAppContext();
    const [selectedMedicationId, setSelectedMedicationId] = useState('');
    const [timeTaken, setTimeTaken] = useState(new Date().toLocaleTimeString('en-CA', { hour12: false, hour: '2-digit', minute: '2-digit' }));
    const asNeededMedications = state.medications.filter(med => med.isAsNeeded);
    const handleSubmit = () => {
        if (!selectedMedicationId) {
            alert("Please select a medication.");
            return;
        }
        const [hours, minutes] = timeTaken.split(':').map(Number);
        const dateToLog = new Date();
        dateToLog.setHours(hours, minutes, 0, 0);
        onLog(selectedMedicationId, dateToLog);
        onClose();
        setSelectedMedicationId(''); // Reset
    };
    if (asNeededMedications.length === 0) {
        return (_jsxs(Modal, { isOpen: isOpen, onClose: onClose, title: "Log 'As Needed' Medicine", children: [_jsx("p", { className: "text-textSecondary mb-4", children: "You don't have any medications marked as 'As Needed'." }), _jsx("p", { className: "text-textSecondary mb-4", children: "You can add one from the \"My Medications\" page." }), _jsx("button", { onClick: onClose, className: "w-full bg-slate-200 text-textPrimary py-2 px-4 rounded-md hover:bg-slate-300 transition duration-150", children: "Close" })] }));
    }
    return (_jsx(Modal, { isOpen: isOpen, onClose: onClose, title: "Log 'As Needed' Medicine", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "asNeededMedication", className: "block text-sm font-medium text-textSecondary mb-1", children: "Medication" }), _jsxs("select", { id: "asNeededMedication", value: selectedMedicationId, onChange: (e) => setSelectedMedicationId(e.target.value), className: "w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary", children: [_jsx("option", { value: "", disabled: true, children: "Select a medication" }), asNeededMedications.map(med => (_jsxs("option", { value: med.id, children: [med.name, " (", med.dosage, ")"] }, med.id)))] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "timeTaken", className: "block text-sm font-medium text-textSecondary mb-1", children: "Time Taken (approx.)" }), _jsx("input", { type: "time", id: "timeTaken", value: timeTaken, onChange: (e) => setTimeTaken(e.target.value), className: "w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" })] }), _jsxs("button", { onClick: handleSubmit, className: "w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition duration-150 flex items-center justify-center space-x-2", disabled: !selectedMedicationId, children: [_jsx(PlusCircleIcon, { className: "w-5 h-5" }), _jsx("span", { children: "Log Medicine" })] })] }) }));
};
const DashboardPage = () => {
    const { state, dispatch } = useAppContext();
    const navigate = useNavigate();
    const [isLogAsNeededModalOpen, setIsLogAsNeededModalOpen] = useState(false);
    const { profile, todaysDoses } = state;
    const handleToggleComplete = (doseId, completed) => {
        dispatch({ type: 'TOGGLE_DOSE_COMPLETED', payload: { doseId, completed } });
        // Log to TakenDoseLog
        const dose = todaysDoses.find(d => d.id === doseId);
        const medication = state.medications.find(m => m.id === (dose === null || dose === void 0 ? void 0 : dose.medicationId));
        if (dose && medication && completed) { // Only log when marked complete
            const logEntry = {
                id: generateId(),
                medicationId: medication.id,
                medicationName: medication.name,
                dosage: medication.dosage,
                timeTaken: new Date().toISOString(),
                doseTimeScheduled: dose.time,
                isAsNeededLog: false,
            };
            dispatch({ type: 'LOG_TAKEN_DOSE', payload: logEntry });
        }
    };
    const handleLogAsNeeded = (medicationId, timeTakenDate) => {
        const medication = state.medications.find(m => m.id === medicationId);
        if (medication) {
            const logEntry = {
                id: generateId(),
                medicationId: medication.id,
                medicationName: medication.name,
                dosage: medication.dosage,
                timeTaken: timeTakenDate.toISOString(),
                isAsNeededLog: true,
            };
            dispatch({ type: 'LOG_TAKEN_DOSE', payload: logEntry });
            // Potentially mark a scheduled dose as complete if this "as needed" coincides
            // For simplicity, this is not implemented here.
        }
    };
    const dosesByTime = useMemo(() => {
        const grouped = {};
        ALL_DOSE_TIMES.forEach(time => {
            const dosesForTime = todaysDoses.filter(d => d.time === time && !d.completed);
            if (dosesForTime.length > 0)
                grouped[time] = dosesForTime;
        });
        return grouped;
    }, [todaysDoses]);
    const completedDoses = useMemo(() => todaysDoses.filter(d => d.completed), [todaysDoses]);
    const totalScheduledDoses = todaysDoses.length;
    const completedScheduledDosesCount = completedDoses.length;
    const progressPercent = totalScheduledDoses > 0 ? (completedScheduledDosesCount / totalScheduledDoses) * 100 : 0;
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12)
            return "Good Morning";
        if (hour < 18)
            return "Good Afternoon";
        return "Good Evening";
    };
    if (state.medications.length === 0 && todaysDoses.length === 0) {
        return (_jsxs("div", { className: "text-center py-10", children: [_jsx(PillIcon, { className: "mx-auto text-primary opacity-50 w-16 h-16 mb-4" }), _jsx("h2", { className: "text-2xl font-semibold text-textPrimary mb-2", children: "Welcome to Allergy Ally!" }), _jsx("p", { className: "text-textSecondary mb-6", children: "It looks like you haven't added any medications yet." }), _jsx("button", { onClick: () => navigate('/medications'), className: "bg-primary text-white py-3 px-6 rounded-lg shadow hover:bg-primary-dark transition duration-150 text-lg font-medium", children: "+ Add Your First Medication" })] }));
    }
    return (_jsxs("div", { className: "space-y-6 pb-16", children: [" ", _jsxs("header", { className: "mb-6", children: [_jsxs("h1", { className: "text-3xl font-bold text-textPrimary", children: [getGreeting(), ", ", profile.userName, "."] }), _jsx("p", { className: "text-textSecondary", children: "Here's your medication plan for today." })] }), totalScheduledDoses > 0 && (_jsxs("div", { className: "bg-surface p-4 rounded-lg shadow", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("h2", { className: "text-lg font-semibold text-textPrimary", children: "Today's Progress" }), _jsxs("span", { className: "text-sm font-medium text-primary", children: [completedScheduledDosesCount, " of ", totalScheduledDoses, " doses completed"] })] }), _jsx("div", { className: "w-full bg-slate-200 rounded-full h-4", children: _jsx("div", { className: "bg-secondary h-4 rounded-full transition-all duration-500 ease-out", style: { width: `${progressPercent}%` } }) })] })), totalScheduledDoses === 0 && state.medications.some(m => m.isAsNeeded) && (_jsx("div", { className: "bg-surface p-4 rounded-lg shadow text-center", children: _jsx("p", { className: "text-textSecondary", children: "No scheduled doses for today. You can log any 'As Needed' medications below." }) })), totalScheduledDoses > 0 && Object.keys(dosesByTime).length === 0 && completedScheduledDosesCount === totalScheduledDoses && (_jsxs("div", { className: "bg-green-100 p-6 rounded-lg shadow text-center border border-green-300", children: [_jsx(PillIcon, { className: "mx-auto text-green-500 w-12 h-12 mb-3" }), _jsx("h2", { className: "text-2xl font-semibold text-green-700", children: "All doses completed for today!" }), _jsx("p", { className: "text-green-600", children: "Great job staying on track!" })] })), ALL_DOSE_TIMES.map(timeSlot => (dosesByTime[timeSlot] && dosesByTime[timeSlot].length > 0) ? (_jsxs("section", { children: [_jsx("h2", { className: "text-xl font-semibold text-textPrimary mb-3", children: timeSlot }), _jsx("div", { className: "space-y-3", children: dosesByTime[timeSlot].map(dose => (_jsx(DoseItem, { dose: dose, onToggleComplete: handleToggleComplete }, dose.id))) })] }, timeSlot)) : null), completedDoses.length > 0 && (_jsxs("section", { children: [_jsx("h2", { className: "text-xl font-semibold text-textPrimary mb-3", children: "Completed Today" }), _jsx("div", { className: "space-y-3", children: completedDoses.map(dose => (_jsx(DoseItem, { dose: dose, onToggleComplete: handleToggleComplete }, dose.id))) })] })), _jsxs("div", { className: "bg-surface p-4 rounded-lg shadow space-y-3 sm:space-y-0 sm:flex sm:space-x-3", children: [_jsxs("button", { onClick: () => setIsLogAsNeededModalOpen(true), className: "w-full sm:w-auto flex-1 bg-secondary text-white py-3 px-4 rounded-md hover:bg-secondary-dark transition duration-150 font-medium flex items-center justify-center space-x-2", children: [_jsx(PlusCircleIcon, { className: "w-5 h-5" }), _jsx("span", { children: "Log 'As Needed' Medicine" })] }), _jsx("button", { onClick: () => navigate('/schedule'), className: "w-full sm:w-auto flex-1 bg-slate-200 text-textPrimary py-3 px-4 rounded-md hover:bg-slate-300 transition duration-150 font-medium", children: "View Full Schedule" }), _jsx("button", { onClick: () => navigate('/medications'), className: "w-full sm:w-auto flex-1 bg-slate-200 text-textPrimary py-3 px-4 rounded-md hover:bg-slate-300 transition duration-150 font-medium", children: "+ Add New Medication" })] }), _jsx(LogAsNeededModal, { isOpen: isLogAsNeededModalOpen, onClose: () => setIsLogAsNeededModalOpen(false), onLog: handleLogAsNeeded })] }));
};
export default DashboardPage;
