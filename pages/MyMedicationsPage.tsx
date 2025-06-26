
import React, { useState, useEffect } from 'react';
import { useAppContext, PillIcon, CreamIcon, Modal, PlusCircleIcon, XMarkIcon } from '../App';
import { Medication, MedicationType, DoseTime, generateId, ALL_DOSE_TIMES } from '../definitions';

// MedicationCard Component (Internal to MyMedicationsPage)
interface MedicationCardProps {
  medication: Medication;
  onEdit: (medication: Medication) => void;
  onDelete: (medicationId: string) => void;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ medication, onEdit, onDelete }) => {
  const getIcon = () => {
    switch (medication.type) {
      case MedicationType.TABLET:
      case MedicationType.CAPSULE:
      case MedicationType.LIQUID:
      case MedicationType.INHALER:
        return <PillIcon className="text-primary w-8 h-8" />;
      case MedicationType.CREAM:
      case MedicationType.OINTMENT:
        return <CreamIcon className="text-primary w-8 h-8" />;
      default:
        return <PillIcon className="text-primary w-8 h-8" />;
    }
  };

  return (
    <div className="bg-surface rounded-lg shadow p-5">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 pt-1">{getIcon()}</div>
        <div className="flex-grow">
          <h3 className="text-xl font-semibold text-textPrimary">{medication.name}</h3>
          <p className="text-sm text-textSecondary">{medication.dosage} - {medication.type}</p>
          <p className="mt-1 text-sm text-textSecondary"><span className="font-medium">Purpose:</span> {medication.purpose || 'N/A'}</p>
          
          {!medication.isAsNeeded && medication.scheduleTimes.length > 0 && (
            <p className="mt-1 text-sm text-textSecondary">
              <span className="font-medium">Scheduled:</span> {medication.scheduleTimes.join(', ')}
            </p>
          )}
          {medication.isAsNeeded && (
            <p className="mt-1 text-sm text-textSecondary font-medium text-accent">As Needed</p>
          )}
          {medication.instructions && (
            <p className="mt-1 text-xs bg-slate-100 p-2 rounded text-slate-600">
              <span className="font-medium">Instructions:</span> {medication.instructions}
            </p>
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={() => onEdit(medication)}
          className="text-sm bg-slate-200 text-textPrimary py-1.5 px-3 rounded-md hover:bg-slate-300 transition"
        >
          Edit
        </button>
        <button
          onClick={() => {
            if (window.confirm(`Are you sure you want to delete ${medication.name}? This action cannot be undone.`)) {
              onDelete(medication.id);
            }
          }}
          className="text-sm bg-red-500 text-white py-1.5 px-3 rounded-md hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

// MedicationForm Component (Internal to MyMedicationsPage)
interface MedicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (medication: Medication) => void;
  initialMedication?: Medication | null;
}

const MedicationForm: React.FC<MedicationFormProps> = ({ isOpen, onClose, onSubmit, initialMedication }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<MedicationType>(MedicationType.TABLET);
  const [dosage, setDosage] = useState('');
  const [purpose, setPurpose] = useState('');
  const [scheduleTimes, setScheduleTimes] = useState<DoseTime[]>([]);
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
    } else {
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

  const handleScheduleChange = (time: DoseTime) => {
    setScheduleTimes(prev =>
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) {
        alert("Medication Name and Dosage are required.");
        return;
    }
    const medicationData: Medication = {
      id: initialMedication?.id || generateId(),
      name, type, dosage, purpose,
      scheduleTimes: isAsNeeded ? [] : scheduleTimes, // Clear schedule if "As Needed"
      isAsNeeded, instructions,
    };
    onSubmit(medicationData);
  };
  
  const medicationTypeOptions = Object.values(MedicationType);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialMedication ? 'Edit Medication' : 'Add New Medication'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="medName" className="block text-sm font-medium text-textSecondary mb-1">Medication Name*</label>
          <input type="text" id="medName" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="medType" className="block text-sm font-medium text-textSecondary mb-1">Type*</label>
                <select id="medType" value={type} onChange={e => setType(e.target.value as MedicationType)} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
                    {medicationTypeOptions.map((opt: MedicationType) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="medDosage" className="block text-sm font-medium text-textSecondary mb-1">Dosage*</label>
                <input type="text" id="medDosage" value={dosage} onChange={e => setDosage(e.target.value)} required placeholder="e.g., 10mg or Thin Layer" className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
            </div>
        </div>

        <div>
          <label htmlFor="medPurpose" className="block text-sm font-medium text-textSecondary mb-1">Purpose</label>
          <input type="text" id="medPurpose" value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="e.g., For itching and hives" className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
        </div>

        <div className="space-y-2">
            <label className="block text-sm font-medium text-textSecondary">Schedule Type</label>
            <div className="flex items-center space-x-4">
                <div className="flex items-center">
                    <input
                        id="scheduled"
                        name="scheduleType"
                        type="radio"
                        checked={!isAsNeeded}
                        onChange={() => setIsAsNeeded(false)}
                        className="h-4 w-4 text-primary border-slate-300 focus:ring-primary"
                    />
                    <label htmlFor="scheduled" className="ml-2 block text-sm text-textPrimary">
                        Scheduled
                    </label>
                </div>
                <div className="flex items-center">
                    <input
                        id="asNeeded"
                        name="scheduleType"
                        type="radio"
                        checked={isAsNeeded}
                        onChange={() => setIsAsNeeded(true)}
                        className="h-4 w-4 text-primary border-slate-300 focus:ring-primary"
                    />
                    <label htmlFor="asNeeded" className="ml-2 block text-sm text-textPrimary">
                        As Needed
                    </label>
                </div>
            </div>
        </div>

        {!isAsNeeded && (
            <div>
            <label className="block text-sm font-medium text-textSecondary mb-1">Schedule Times</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ALL_DOSE_TIMES.map(time => (
                <div key={time} className="flex items-center">
                    <input
                    id={`time-${time}`}
                    type="checkbox"
                    checked={scheduleTimes.includes(time)}
                    onChange={() => handleScheduleChange(time)}
                    className="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary"
                    />
                    <label htmlFor={`time-${time}`} className="ml-2 text-sm text-textPrimary">{time}</label>
                </div>
                ))}
            </div>
            </div>
        )}
        
        <div>
          <label htmlFor="medInstructions" className="block text-sm font-medium text-textSecondary mb-1">Special Instructions</label>
          <textarea id="medInstructions" value={instructions} onChange={e => setInstructions(e.target.value)} rows={2} placeholder="e.g., Take with food" className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"></textarea>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button type="button" onClick={onClose} className="py-2 px-4 border border-slate-300 rounded-md text-sm font-medium text-textSecondary hover:bg-slate-50">Cancel</button>
          <button type="submit" className="py-2 px-4 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark flex items-center space-x-2">
            <PlusCircleIcon className="w-5 h-5"/>
            <span>{initialMedication ? 'Save Changes' : 'Add Medication'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};


const MyMedicationsPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);

  const handleAddMedication = () => {
    setEditingMedication(null);
    setIsModalOpen(true);
  };

  const handleEditMedication = (medication: Medication) => {
    setEditingMedication(medication);
    setIsModalOpen(true);
  };

  const handleDeleteMedication = (medicationId: string) => {
    dispatch({ type: 'DELETE_MEDICATION', payload: medicationId });
  };

  const handleSubmitMedication = (medication: Medication) => {
    if (editingMedication) {
      dispatch({ type: 'UPDATE_MEDICATION', payload: medication });
    } else {
      dispatch({ type: 'ADD_MEDICATION', payload: medication });
    }
    setIsModalOpen(false);
    setEditingMedication(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-textPrimary">My Medications</h1>
        <button
          onClick={handleAddMedication}
          className="bg-primary text-white py-2 px-4 rounded-md shadow hover:bg-primary-dark transition duration-150 flex items-center space-x-2"
        >
          <PlusCircleIcon className="w-5 h-5"/>
          <span>Add Medication</span>
        </button>
      </div>

      {state.medications.length === 0 ? (
        <div className="text-center py-10 bg-surface rounded-lg shadow">
          <PillIcon className="mx-auto text-primary opacity-50 w-16 h-16 mb-4" />
          <p className="text-textSecondary text-lg">Your digital medicine cabinet is empty.</p>
          <p className="text-textSecondary mb-6">Click "Add Medication" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.medications.map(med => (
            <MedicationCard
              key={med.id}
              medication={med}
              onEdit={handleEditMedication}
              onDelete={handleDeleteMedication}
            />
          ))}
        </div>
      )}

      <MedicationForm
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingMedication(null); }}
        onSubmit={handleSubmitMedication}
        initialMedication={editingMedication}
      />
    </div>
  );
};

export default MyMedicationsPage;
