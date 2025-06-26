
import React, { useState, useMemo } from 'react';
import { useAppContext, PillIcon, CreamIcon, Modal, PlusCircleIcon } from '../App';
import { ScheduledDoseItem, DoseTime, Medication, MedicationType, TakenDoseLog, generateId, getCurrentDateString, ALL_DOSE_TIMES } from '../definitions';
import { useNavigate } from 'react-router-dom';

// DoseItem Component (Internal to DashboardPage)
interface DoseItemProps {
  dose: ScheduledDoseItem;
  onToggleComplete: (doseId: string, completed: boolean) => void;
}

const DoseItem: React.FC<DoseItemProps> = ({ dose, onToggleComplete }) => {
  const { state } = useAppContext();
  const medication = state.medications.find(m => m.id === dose.medicationId);

  const getIcon = (type?: MedicationType) => {
    switch (type) {
      case MedicationType.TABLET:
      case MedicationType.CAPSULE:
      case MedicationType.LIQUID:
      case MedicationType.INHALER:
        return <PillIcon className="text-primary w-6 h-6" />;
      case MedicationType.CREAM:
      case MedicationType.OINTMENT:
        return <CreamIcon className="text-primary w-6 h-6" />;
      default:
        return <PillIcon className="text-primary w-6 h-6" />;
    }
  };

  return (
    <div className={`p-4 rounded-lg shadow flex items-center space-x-4 transition-all duration-300 ${dose.completed ? 'bg-green-50 opacity-70' : 'bg-surface'}`}>
      <div className="flex-shrink-0">{getIcon(medication?.type)}</div>
      <div className="flex-grow">
        <h3 className={`font-semibold text-textPrimary ${dose.completed ? 'line-through' : ''}`}>{dose.medicationName}</h3>
        <p className={`text-sm text-textSecondary ${dose.completed ? 'line-through' : ''}`}>{dose.dosage}</p>
        {medication?.instructions && <p className={`text-xs text-slate-500 mt-1 ${dose.completed ? 'line-through' : ''}`}>{medication.instructions}</p>}
      </div>
      <input
        type="checkbox"
        checked={dose.completed}
        onChange={(e) => onToggleComplete(dose.id, e.target.checked)}
        className="form-checkbox h-6 w-6 text-primary rounded border-slate-300 focus:ring-primary-dark"
        aria-label={`Mark ${dose.medicationName} as ${dose.completed ? 'incomplete' : 'complete'}`}
      />
    </div>
  );
};

// LogAsNeededModal Component (Internal to DashboardPage)
interface LogAsNeededModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLog: (medicationId: string, timeTaken: Date) => void;
}
const LogAsNeededModal: React.FC<LogAsNeededModalProps> = ({ isOpen, onClose, onLog }) => {
    const { state } = useAppContext();
    const [selectedMedicationId, setSelectedMedicationId] = useState<string>('');
    const [timeTaken, setTimeTaken] = useState<string>(new Date().toLocaleTimeString('en-CA', { hour12: false, hour: '2-digit', minute: '2-digit' }));


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
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Log 'As Needed' Medicine">
                <p className="text-textSecondary mb-4">You don't have any medications marked as 'As Needed'.</p>
                <p className="text-textSecondary mb-4">You can add one from the "My Medications" page.</p>
                <button
                    onClick={onClose}
                    className="w-full bg-slate-200 text-textPrimary py-2 px-4 rounded-md hover:bg-slate-300 transition duration-150"
                >
                    Close
                </button>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Log 'As Needed' Medicine">
            <div className="space-y-4">
                <div>
                    <label htmlFor="asNeededMedication" className="block text-sm font-medium text-textSecondary mb-1">Medication</label>
                    <select
                        id="asNeededMedication"
                        value={selectedMedicationId}
                        onChange={(e) => setSelectedMedicationId(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    >
                        <option value="" disabled>Select a medication</option>
                        {asNeededMedications.map(med => (
                            <option key={med.id} value={med.id}>{med.name} ({med.dosage})</option>
                        ))}
                    </select>
                </div>
                 <div>
                    <label htmlFor="timeTaken" className="block text-sm font-medium text-textSecondary mb-1">Time Taken (approx.)</label>
                    <input 
                        type="time" 
                        id="timeTaken"
                        value={timeTaken}
                        onChange={(e) => setTimeTaken(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    />
                </div>
                <button
                    onClick={handleSubmit}
                    className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition duration-150 flex items-center justify-center space-x-2"
                    disabled={!selectedMedicationId}
                >
                    <PlusCircleIcon className="w-5 h-5"/>
                    <span>Log Medicine</span>
                </button>
            </div>
        </Modal>
    );
};


const DashboardPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [isLogAsNeededModalOpen, setIsLogAsNeededModalOpen] = useState(false);

  const { profile, todaysDoses } = state;

  const handleToggleComplete = (doseId: string, completed: boolean) => {
    dispatch({ type: 'TOGGLE_DOSE_COMPLETED', payload: { doseId, completed } });
    
    // Log to TakenDoseLog
    const dose = todaysDoses.find(d => d.id === doseId);
    const medication = state.medications.find(m => m.id === dose?.medicationId);
    if (dose && medication && completed) { // Only log when marked complete
        const logEntry: TakenDoseLog = {
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

  const handleLogAsNeeded = (medicationId: string, timeTakenDate: Date) => {
    const medication = state.medications.find(m => m.id === medicationId);
    if (medication) {
      const logEntry: TakenDoseLog = {
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
    const grouped: { [key in DoseTime]?: ScheduledDoseItem[] } = {};
    ALL_DOSE_TIMES.forEach(time => {
        const dosesForTime = todaysDoses.filter(d => d.time === time && !d.completed);
        if(dosesForTime.length > 0) grouped[time] = dosesForTime;
    });
    return grouped;
  }, [todaysDoses]);

  const completedDoses = useMemo(() => todaysDoses.filter(d => d.completed), [todaysDoses]);
  const totalScheduledDoses = todaysDoses.length;
  const completedScheduledDosesCount = completedDoses.length;
  const progressPercent = totalScheduledDoses > 0 ? (completedScheduledDosesCount / totalScheduledDoses) * 100 : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  
  if (state.medications.length === 0 && todaysDoses.length === 0) {
    return (
        <div className="text-center py-10">
            <PillIcon className="mx-auto text-primary opacity-50 w-16 h-16 mb-4" />
            <h2 className="text-2xl font-semibold text-textPrimary mb-2">Welcome to Allergy Ally!</h2>
            <p className="text-textSecondary mb-6">It looks like you haven't added any medications yet.</p>
            <button
                onClick={() => navigate('/medications')}
                className="bg-primary text-white py-3 px-6 rounded-lg shadow hover:bg-primary-dark transition duration-150 text-lg font-medium"
            >
                + Add Your First Medication
            </button>
        </div>
    );
  }


  return (
    <div className="space-y-6 pb-16"> {/* Padding bottom for mobile nav overlap */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-textPrimary">{getGreeting()}, {profile.userName}.</h1>
        <p className="text-textSecondary">Here's your medication plan for today.</p>
      </header>

      {/* Progress Tracker */}
      {totalScheduledDoses > 0 && (
        <div className="bg-surface p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-textPrimary">Today's Progress</h2>
            <span className="text-sm font-medium text-primary">{completedScheduledDosesCount} of {totalScheduledDoses} doses completed</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-4">
            <div
              className="bg-secondary h-4 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Today's Doses Checklist */}
      {totalScheduledDoses === 0 && state.medications.some(m => m.isAsNeeded) && (
         <div className="bg-surface p-4 rounded-lg shadow text-center">
            <p className="text-textSecondary">No scheduled doses for today. You can log any 'As Needed' medications below.</p>
        </div>
      )}

      {totalScheduledDoses > 0 && Object.keys(dosesByTime).length === 0 && completedScheduledDosesCount === totalScheduledDoses && (
         <div className="bg-green-100 p-6 rounded-lg shadow text-center border border-green-300">
            <PillIcon className="mx-auto text-green-500 w-12 h-12 mb-3" />
            <h2 className="text-2xl font-semibold text-green-700">All doses completed for today!</h2>
            <p className="text-green-600">Great job staying on track!</p>
        </div>
      )}

      {ALL_DOSE_TIMES.map(timeSlot =>
        (dosesByTime[timeSlot] && dosesByTime[timeSlot]!.length > 0) ? (
          <section key={timeSlot}>
            <h2 className="text-xl font-semibold text-textPrimary mb-3">{timeSlot}</h2>
            <div className="space-y-3">
              {dosesByTime[timeSlot]!.map(dose => (
                <DoseItem key={dose.id} dose={dose} onToggleComplete={handleToggleComplete} />
              ))}
            </div>
          </section>
        ) : null
      )}

      {/* Completed Doses */}
      {completedDoses.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-textPrimary mb-3">Completed Today</h2>
          <div className="space-y-3">
            {completedDoses.map(dose => (
              <DoseItem key={dose.id} dose={dose} onToggleComplete={handleToggleComplete} />
            ))}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <div className="bg-surface p-4 rounded-lg shadow space-y-3 sm:space-y-0 sm:flex sm:space-x-3">
        <button
          onClick={() => setIsLogAsNeededModalOpen(true)}
          className="w-full sm:w-auto flex-1 bg-secondary text-white py-3 px-4 rounded-md hover:bg-secondary-dark transition duration-150 font-medium flex items-center justify-center space-x-2"
        >
          <PlusCircleIcon className="w-5 h-5"/>
          <span>Log 'As Needed' Medicine</span>
        </button>
        <button
          onClick={() => navigate('/schedule')}
          className="w-full sm:w-auto flex-1 bg-slate-200 text-textPrimary py-3 px-4 rounded-md hover:bg-slate-300 transition duration-150 font-medium"
        >
          View Full Schedule
        </button>
        <button
          onClick={() => navigate('/medications')}
          className="w-full sm:w-auto flex-1 bg-slate-200 text-textPrimary py-3 px-4 rounded-md hover:bg-slate-300 transition duration-150 font-medium"
        >
          + Add New Medication
        </button>
      </div>

      <LogAsNeededModal
        isOpen={isLogAsNeededModalOpen}
        onClose={() => setIsLogAsNeededModalOpen(false)}
        onLog={handleLogAsNeeded}
      />
    </div>
  );
};

export default DashboardPage;
