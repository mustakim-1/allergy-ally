import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LocalStorageKeys, getCurrentDateString } from './definitions';
import DashboardPage from './pages/DashboardPage';
import MyMedicationsPage from './pages/MyMedicationsPage';
import MySchedulePage from './pages/MySchedulePage';
import GuidesPage from './pages/GuidesPage';
import ProfilePage from './pages/ProfilePage';
// --- UTILITY: useLocalStorage Hook ---
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        }
        catch (error) {
            console.error(error);
            return initialValue;
        }
    });
    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        catch (error) {
            console.error(error);
        }
    };
    return [storedValue, setValue];
}
const initialState = {
    profile: {
        userName: 'User',
        doctorName: '',
        doctorPhone: '',
        pharmacyName: '',
        pharmacyPhone: '',
        knownAllergies: '',
        enablePushNotifications: false,
        enableEmailReminders: false,
    },
    medications: [],
    todaysDoses: [],
    takenDoseLogs: [],
};
const AppContext = createContext(undefined);
const appReducer = (state, action) => {
    switch (action.type) {
        case 'LOAD_STATE':
            return action.payload;
        case 'SET_PROFILE':
            return Object.assign(Object.assign({}, state), { profile: action.payload });
        case 'ADD_MEDICATION':
            return Object.assign(Object.assign({}, state), { medications: [...state.medications, action.payload] });
        case 'UPDATE_MEDICATION':
            return Object.assign(Object.assign({}, state), { medications: state.medications.map(med => med.id === action.payload.id ? action.payload : med) });
        case 'DELETE_MEDICATION':
            return Object.assign(Object.assign({}, state), { medications: state.medications.filter(med => med.id !== action.payload) });
        case 'INITIALIZE_TODAYS_DOSES': {
            // Only update if the date matches to avoid overwriting if an old action comes through
            const currentDate = getCurrentDateString();
            if (action.payload.date === currentDate) {
                return Object.assign(Object.assign({}, state), { todaysDoses: action.payload.doses });
            }
            return state;
        }
        case 'TOGGLE_DOSE_COMPLETED': {
            const updatedDoses = state.todaysDoses.map(dose => dose.id === action.payload.doseId ? Object.assign(Object.assign({}, dose), { completed: action.payload.completed }) : dose);
            return Object.assign(Object.assign({}, state), { todaysDoses: updatedDoses });
        }
        case 'LOG_TAKEN_DOSE':
            return Object.assign(Object.assign({}, state), { takenDoseLogs: [...state.takenDoseLogs, action.payload] });
        default:
            return state;
    }
};
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context)
        throw new Error('useAppContext must be used within an AppProvider');
    return context;
};
// --- Icon Components ---
export const PillIcon = ({ className }) => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", className: `w-5 h-5 ${className}`, children: _jsx("path", { d: "M10.75 3.922l.504-.29M10.75 3.922l-.504-.29M10.75 3.922V2.75a.75.75 0 00-1.5 0v1.172l-.504.29a28.258 28.258 0 00-4.004 2.086 2.25 2.25 0 00-1.008 1.905v3.338c0 .39.102.768.286 1.096l3.444 5.165a.75.75 0 001.26-.84l-3.444-5.165a.75.75 0 01-.095-.366V7.913a.75.75 0 01.336-.635 26.763 26.763 0 014.004-2.086l.504-.29zm0 0l.504.29a26.763 26.763 0 014.004 2.086.75.75 0 01.336.635v3.338a.75.75 0 01-.095.366l-3.444 5.165a.75.75 0 101.26.84l3.444-5.165c.184-.328.286-.706.286-1.096V7.913a2.25 2.25 0 00-1.008-1.905 28.258 28.258 0 00-4.004-2.086l-.504.29z" }) }));
export const CreamIcon = ({ className }) => (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", className: `w-5 h-5 ${className}`, children: [_jsx("path", { d: "M10.5 3A2.5 2.5 0 008 5.5V6H6.5A2.5 2.5 0 004 8.5v2.75a.75.75 0 001.5 0V8.5A1 1 0 016.5 7.5H8V11a.75.75 0 001.5 0V7.5h1.5A1 1 0 0112 8.5v2.75a.75.75 0 001.5 0V8.5a2.5 2.5 0 00-2.5-2.5h-1.5V5.5A2.5 2.5 0 0010.5 3z" }), _jsx("path", { d: "M3.5 12A2.5 2.5 0 001 14.5V16a1 1 0 001 1h14a1 1 0 001-1v-1.5a2.5 2.5 0 00-2.5-2.5h-11z" })] }));
export const CalendarIcon = ({ className }) => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", className: `w-5 h-5 ${className}`, children: _jsx("path", { fillRule: "evenodd", d: "M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c0-.414.336-.75.75-.75h10.5a.75.75 0 010 1.5H5.5a.75.75 0 01-.75-.75z", clipRule: "evenodd" }) }));
export const UserIcon = ({ className }) => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", className: `w-5 h-5 ${className}`, children: _jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z", clipRule: "evenodd" }) }));
export const CogIcon = ({ className }) => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: `w-6 h-6 ${className}`, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m18 0h-1.5m-15 0H3m18 0h-1.5m-15 0H3m18 0h-1.5M12 4.5v1.5m0 15V18m0 0V4.5m0 15V18M7.732 6.023l1.061-1.061m9.196 9.196-1.06-1.06m-8.135 0-1.061 1.061m9.195-9.196 1.06 1.06M12 7.5a4.495 4.495 0 0 0-4.5 4.5 4.495 4.495 0 0 0 4.5 4.5 4.495 4.495 0 0 0 4.5-4.5 4.495 4.495 0 0 0-4.5-4.5Z" }) }));
export const PlusCircleIcon = ({ className }) => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: `w-6 h-6 ${className}`, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" }) }));
export const XMarkIcon = ({ className }) => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: `w-6 h-6 ${className}`, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18 18 6M6 6l12 12" }) }));
export const ChevronDownIcon = ({ className }) => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: `w-5 h-5 ${className}`, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m19.5 8.25-7.5 7.5-7.5-7.5" }) }));
export const ChevronUpIcon = ({ className }) => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: `w-5 h-5 ${className}`, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m4.5 15.75 7.5-7.5 7.5 7.5" }) }));
export const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4", children: _jsxs("div", { className: "bg-ui-surface rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-xl font-semibold text-content-primary", children: title }), _jsx("button", { onClick: onClose, className: "text-content-secondary hover:text-content-primary", children: _jsx(XMarkIcon, { className: "w-6 h-6" }) })] }), children] }) }));
};
export const AccordionItem = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (_jsxs("div", { className: "border-b border-ui-border", children: [_jsxs("button", { onClick: () => setIsOpen(!isOpen), className: "w-full flex justify-between items-center py-4 px-2 text-left text-content-primary hover:bg-slate-50 focus:outline-none focus-visible:ring focus-visible:ring-ui-ringFocus focus-visible:ring-opacity-75", children: [_jsx("span", { className: "font-medium", children: title }), isOpen ? _jsx(ChevronUpIcon, {}) : _jsx(ChevronDownIcon, {})] }), isOpen && _jsx("div", { className: "p-4 pt-0 text-content-secondary", children: children })] }));
};
// --- Navbar ---
const Navbar = () => {
    const { state } = useAppContext();
    const location = useLocation();
    const navItems = [
        { path: '/', label: 'Dashboard', icon: _jsx(PillIcon, {}) },
        { path: '/medications', label: 'My Medications', icon: _jsx(PlusCircleIcon, { className: "w-5 h-5" }) },
        { path: '/schedule', label: 'My Schedule', icon: _jsx(CalendarIcon, {}) },
        { path: '/guides', label: 'How-To Guides', icon: _jsx(CogIcon, { className: "w-5 h-5" }) },
        { path: '/profile', label: 'My Profile', icon: _jsx(UserIcon, {}) },
    ];
    return (_jsxs("nav", { className: "bg-brand shadow-md", children: [_jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "flex items-center justify-between h-16", children: [_jsx(Link, { to: "/", className: "text-content-onBrand text-xl font-bold flex items-center", children: "\uD83D\uDC8A Allergy Ally" }), _jsx("div", { className: "hidden md:flex items-center space-x-1", children: navItems.map(item => (_jsxs(Link, { to: item.path, className: `px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2
                  ${location.pathname === item.path ? 'bg-brand-dark text-content-onBrand' : 'text-brand-light hover:bg-brand-dark hover:text-content-onBrand'}`, children: [item.icon, _jsx("span", { children: item.label })] }, item.path))) }), _jsx("div", { className: "md:hidden", children: _jsxs("span", { className: "text-content-onBrand", children: ["Hi, ", state.profile.userName] }) })] }) }), _jsx("div", { className: "md:hidden fixed bottom-0 left-0 right-0 bg-brand shadow-t border-t border-brand-dark", children: _jsx("div", { className: "container mx-auto flex justify-around items-center h-16", children: navItems.map(item => (_jsxs(Link, { to: item.path, className: `flex flex-col items-center justify-center p-2 rounded-md text-xs
                ${location.pathname === item.path ? 'text-content-onBrand scale-110' : 'text-brand-light hover:text-content-onBrand'}`, children: [React.cloneElement(item.icon, { className: "w-6 h-6 mb-0.5" }), _jsx("span", { children: item.label })] }, item.path))) }) })] }));
};
// --- App Component ---
const App = () => {
    const [storedState, setStoredState] = useLocalStorage('allergyAllyAppState', null);
    const [state, dispatch] = useReducer(appReducer, storedState || initialState);
    // Load initial state from localStorage
    useEffect(() => {
        const loadedProfile = window.localStorage.getItem(LocalStorageKeys.USER_PROFILE);
        const loadedMedications = window.localStorage.getItem(LocalStorageKeys.MEDICATIONS);
        const loadedTakenDoseLogs = window.localStorage.getItem(LocalStorageKeys.TAKEN_DOSE_LOGS);
        const loadedDailyScheduledDoses = window.localStorage.getItem(LocalStorageKeys.DAILY_SCHEDULED_DOSES);
        const profile = loadedProfile ? JSON.parse(loadedProfile) : initialState.profile;
        const medications = loadedMedications ? JSON.parse(loadedMedications) : initialState.medications;
        const takenDoseLogs = loadedTakenDoseLogs ? JSON.parse(loadedTakenDoseLogs) : initialState.takenDoseLogs;
        let todaysDosesFromStorage = [];
        const currentDate = getCurrentDateString();
        if (loadedDailyScheduledDoses) {
            const dailySchedules = JSON.parse(loadedDailyScheduledDoses);
            if (dailySchedules[currentDate]) {
                todaysDosesFromStorage = dailySchedules[currentDate];
            }
        }
        // If no doses for today in storage, generate them
        if (todaysDosesFromStorage.length === 0 && medications.length > 0) {
            const generatedDoses = [];
            medications.forEach((med) => {
                if (!med.isAsNeeded) {
                    med.scheduleTimes.forEach(time => {
                        generatedDoses.push({
                            id: `${med.id}-${time}-${currentDate}`,
                            medicationId: med.id,
                            medicationName: med.name,
                            dosage: med.dosage,
                            time: time,
                            date: currentDate,
                            completed: false,
                        });
                    });
                }
            });
            todaysDosesFromStorage = generatedDoses;
        }
        dispatch({ type: 'LOAD_STATE', payload: {
                profile,
                medications,
                takenDoseLogs,
                todaysDoses: todaysDosesFromStorage
            } });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // Persist state to localStorage whenever it changes
    useEffect(() => {
        window.localStorage.setItem(LocalStorageKeys.USER_PROFILE, JSON.stringify(state.profile));
        window.localStorage.setItem(LocalStorageKeys.MEDICATIONS, JSON.stringify(state.medications));
        window.localStorage.setItem(LocalStorageKeys.TAKEN_DOSE_LOGS, JSON.stringify(state.takenDoseLogs));
        const currentDate = getCurrentDateString();
        const existingDailySchedulesRaw = window.localStorage.getItem(LocalStorageKeys.DAILY_SCHEDULED_DOSES);
        const existingDailySchedules = existingDailySchedulesRaw ? JSON.parse(existingDailySchedulesRaw) : {};
        existingDailySchedules[currentDate] = state.todaysDoses;
        window.localStorage.setItem(LocalStorageKeys.DAILY_SCHEDULED_DOSES, JSON.stringify(existingDailySchedules));
    }, [state]);
    // Daily dose regeneration/check logic
    useEffect(() => {
        const currentDate = getCurrentDateString();
        const areDosesForToday = state.todaysDoses.length > 0 && state.todaysDoses[0].date === currentDate;
        if (!areDosesForToday || state.medications.length > 0 && state.todaysDoses.length === 0) {
            // Regenerate if no doses for today OR if there are meds but no doses (e.g. app opened first time on a new day)
            const newDailyDoses = [];
            state.medications.forEach(med => {
                if (!med.isAsNeeded) {
                    med.scheduleTimes.forEach(time => {
                        newDailyDoses.push({
                            id: `${med.id}-${time}-${currentDate}`,
                            medicationId: med.id,
                            medicationName: med.name,
                            dosage: med.dosage,
                            time: time,
                            date: currentDate,
                            completed: false, // Reset completion for the new day
                        });
                    });
                }
            });
            dispatch({ type: 'INITIALIZE_TODAYS_DOSES', payload: { doses: newDailyDoses, date: currentDate } });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.medications, dispatch]); // Rerun if medications change
    return (_jsx(AppContext.Provider, { value: { state, dispatch }, children: _jsx(HashRouter, { children: _jsxs("div", { className: "min-h-screen bg-ui-background text-content-primary flex flex-col font-sans", children: [_jsx(Navbar, {}), _jsxs("main", { className: "flex-grow container mx-auto p-4 md:p-6 mb-16 md:mb-0", children: [" ", _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/medications", element: _jsx(MyMedicationsPage, {}) }), _jsx(Route, { path: "/schedule", element: _jsx(MySchedulePage, {}) }), _jsx(Route, { path: "/guides", element: _jsx(GuidesPage, {}) }), _jsx(Route, { path: "/profile", element: _jsx(ProfilePage, {}) })] })] })] }) }) }));
};
export default App;
