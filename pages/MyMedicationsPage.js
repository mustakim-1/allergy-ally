import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAppContext, PillIcon, CreamIcon, Modal, PlusCircleIcon } from '../App';
import { MedicationType, generateId, ALL_DOSE_TIMES } from '../definitions';
const MedicationCard = ({ medication, onEdit, onDelete }) => {
    const getIcon = () => {
        switch (medication.type) {
            case MedicationType.TABLET:
            case MedicationType.CAPSULE:
            case MedicationType.LIQUID:
            case MedicationType.INHALER:
                return _jsx(PillIcon, { className: "text-primary w-8 h-8" });
            case MedicationType.CREAM:
            case MedicationType.OINTMENT:
                return _jsx(CreamIcon, { className: "text-primary w-8 h-8" });
            default:
                return _jsx(PillIcon, { className: "text-primary w-8 h-8" });
        }
    };
    return (_jsxs("div", { className: "bg-surface rounded-lg shadow p-5", children: [_jsxs("div", { className: "flex items-start space-x-4", children: [_jsx("div", { className: "flex-shrink-0 pt-1", children: getIcon() }), _jsxs("div", { className: "flex-grow", children: [_jsx("h3", { className: "text-xl font-semibold text-textPrimary", children: medication.name }), _jsxs("p", { className: "text-sm text-textSecondary", children: [medication.dosage, " - ", medication.type] }), _jsxs("p", { className: "mt-1 text-sm text-textSecondary", children: [_jsx("span", { className: "font-medium", children: "Purpose:" }), " ", medication.purpose || 'N/A'] }), !medication.isAsNeeded && medication.scheduleTimes.length > 0 && (_jsxs("p", { className: "mt-1 text-sm text-textSecondary", children: [_jsx("span", { className: "font-medium", children: "Scheduled:" }), " ", medication.scheduleTimes.join(', ')] })), medication.isAsNeeded && (_jsx("p", { className: "mt-1 text-sm text-textSecondary font-medium text-accent", children: "As Needed" })), medication.instructions && (_jsxs("p", { className: "mt-1 text-xs bg-slate-100 p-2 rounded text-slate-600", children: [_jsx("span", { className: "font-medium", children: "Instructions:" }), " ", medication.instructions] }))] })] }), _jsxs("div", { className: "mt-4 flex justify-end space-x-2", children: [_jsx("button", { onClick: () => onEdit(medication), className: "text-sm bg-slate-200 text-textPrimary py-1.5 px-3 rounded-md hover:bg-slate-300 transition", children: "Edit" }), _jsx("button", { onClick: () => {
                            if (window.confirm(`Are you sure you want to delete ${medication.name}? This action cannot be undone.`)) {
                                onDelete(medication.id);
                            }
                        }, className: "text-sm bg-red-500 text-white py-1.5 px-3 rounded-md hover:bg-red-600 transition", children: "Delete" })] })] }));
};
const MedicationForm = ({ isOpen, onClose, onSubmit, initialMedication }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState(MedicationType.TABLET);
    const [dosage, setDosage] = useState('');
    const [purpose, setPurpose] = useState('');
    const [scheduleTimes, setScheduleTimes] = useState([]);
    const [isAsNeeded, setIsAsNeeded] = useState(false);
    const [instructions, setInstructions] = useState('');
    useEffect(() => {
        if (initialMedication) {
            setName(initialMedication.name);
            setType(initialMedication.type);
            setDosage(initialMedication.dosage);
            setPurpose(initialMedication.purpose);
            setScheduleTimes(initialMedication.scheduleTimes || []);
            setIsAsNeeded(initialMedication.isAsNeeded);
            setInstructions(initialMedication.instructions);
        }
        else {
            // Reset form for new medication
            setName('');
            setType(MedicationType.TABLET);
            setDosage('');
            setPurpose('');
            setScheduleTimes([]);
            setIsAsNeeded(false);
            setInstructions('');
        }
    }, [initialMedication, isOpen]); // Rerun effect when isOpen changes to reset form
    const handleScheduleChange = (time) => {
        setScheduleTimes(prev => prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !dosage.trim()) {
            alert("Medication Name and Dosage are required.");
            return;
        }
        const medicationData = {
            id: (initialMedication === null || initialMedication === void 0 ? void 0 : initialMedication.id) || generateId(),
            name, type, dosage, purpose,
            scheduleTimes: isAsNeeded ? [] : scheduleTimes, // Clear schedule if "As Needed"
            isAsNeeded, instructions,
        };
        onSubmit(medicationData);
    };
    const medicationTypeOptions = Object.values(MedicationType);
    return (_jsx(Modal, { isOpen: isOpen, onClose: onClose, title: initialMedication ? 'Edit Medication' : 'Add New Medication', children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "medName", className: "block text-sm font-medium text-textSecondary mb-1", children: "Medication Name*" }), _jsx("input", { type: "text", id: "medName", value: name, onChange: e => setName(e.target.value), required: true, className: "w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "medType", className: "block text-sm font-medium text-textSecondary mb-1", children: "Type*" }), _jsx("select", { id: "medType", value: type, onChange: e => setType(e.target.value), className: "w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary", children: medicationTypeOptions.map((opt) => _jsx("option", { value: opt, children: opt }, opt)) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "medDosage", className: "block text-sm font-medium text-textSecondary mb-1", children: "Dosage*" }), _jsx("input", { type: "text", id: "medDosage", value: dosage, onChange: e => setDosage(e.target.value), required: true, placeholder: "e.g., 10mg or Thin Layer", className: "w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "medPurpose", className: "block text-sm font-medium text-textSecondary mb-1", children: "Purpose" }), _jsx("input", { type: "text", id: "medPurpose", value: purpose, onChange: e => setPurpose(e.target.value), placeholder: "e.g., For itching and hives", className: "w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-medium text-textSecondary", children: "Schedule Type" }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("input", { id: "scheduled", name: "scheduleType", type: "radio", checked: !isAsNeeded, onChange: () => setIsAsNeeded(false), className: "h-4 w-4 text-primary border-slate-300 focus:ring-primary" }), _jsx("label", { htmlFor: "scheduled", className: "ml-2 block text-sm text-textPrimary", children: "Scheduled" })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { id: "asNeeded", name: "scheduleType", type: "radio", checked: isAsNeeded, onChange: () => setIsAsNeeded(true), className: "h-4 w-4 text-primary border-slate-300 focus:ring-primary" }), _jsx("label", { htmlFor: "asNeeded", className: "ml-2 block text-sm text-textPrimary", children: "As Needed" })] })] })] }), !isAsNeeded && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-textSecondary mb-1", children: "Schedule Times" }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2", children: ALL_DOSE_TIMES.map(time => (_jsxs("div", { className: "flex items-center", children: [_jsx("input", { id: `time-${time}`, type: "checkbox", checked: scheduleTimes.includes(time), onChange: () => handleScheduleChange(time), className: "h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary" }), _jsx("label", { htmlFor: `time-${time}`, className: "ml-2 text-sm text-textPrimary", children: time })] }, time))) })] })), _jsxs("div", { children: [_jsx("label", { htmlFor: "medInstructions", className: "block text-sm font-medium text-textSecondary mb-1", children: "Special Instructions" }), _jsx("textarea", { id: "medInstructions", value: instructions, onChange: e => setInstructions(e.target.value), rows: 2, placeholder: "e.g., Take with food", className: "w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" })] }), _jsxs("div", { className: "flex justify-end space-x-3 pt-2", children: [_jsx("button", { type: "button", onClick: onClose, className: "py-2 px-4 border border-slate-300 rounded-md text-sm font-medium text-textSecondary hover:bg-slate-50", children: "Cancel" }), _jsxs("button", { type: "submit", className: "py-2 px-4 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark flex items-center space-x-2", children: [_jsx(PlusCircleIcon, { className: "w-5 h-5" }), _jsx("span", { children: initialMedication ? 'Save Changes' : 'Add Medication' })] })] })] }) }));
};
const MyMedicationsPage = () => {
    const { state, dispatch } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMedication, setEditingMedication] = useState(null);
    const handleAddMedication = () => {
        setEditingMedication(null);
        setIsModalOpen(true);
    };
    const handleEditMedication = (medication) => {
        setEditingMedication(medication);
        setIsModalOpen(true);
    };
    const handleDeleteMedication = (medicationId) => {
        dispatch({ type: 'DELETE_MEDICATION', payload: medicationId });
    };
    const handleSubmitMedication = (medication) => {
        if (editingMedication) {
            dispatch({ type: 'UPDATE_MEDICATION', payload: medication });
        }
        else {
            dispatch({ type: 'ADD_MEDICATION', payload: medication });
        }
        setIsModalOpen(false);
        setEditingMedication(null);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h1", { className: "text-3xl font-bold text-textPrimary", children: "My Medications" }), _jsxs("button", { onClick: handleAddMedication, className: "bg-primary text-white py-2 px-4 rounded-md shadow hover:bg-primary-dark transition duration-150 flex items-center space-x-2", children: [_jsx(PlusCircleIcon, { className: "w-5 h-5" }), _jsx("span", { children: "Add Medication" })] })] }), state.medications.length === 0 ? (_jsxs("div", { className: "text-center py-10 bg-surface rounded-lg shadow", children: [_jsx(PillIcon, { className: "mx-auto text-primary opacity-50 w-16 h-16 mb-4" }), _jsx("p", { className: "text-textSecondary text-lg", children: "Your digital medicine cabinet is empty." }), _jsx("p", { className: "text-textSecondary mb-6", children: "Click \"Add Medication\" to get started." })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: state.medications.map(med => (_jsx(MedicationCard, { medication: med, onEdit: handleEditMedication, onDelete: handleDeleteMedication }, med.id))) })), _jsx(MedicationForm, { isOpen: isModalOpen, onClose: () => { setIsModalOpen(false); setEditingMedication(null); }, onSubmit: handleSubmitMedication, initialMedication: editingMedication })] }));
};
export default MyMedicationsPage;
