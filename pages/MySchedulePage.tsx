
import React from 'react';
import { useAppContext, PillIcon, CreamIcon } from '../App';
import { Medication, DoseTime, MedicationType } from '../definitions';

interface DailyScheduleItemProps {
  medication: Medication;
  time: DoseTime;
}

const DailyScheduleItem: React.FC<DailyScheduleItemProps> = ({ medication, time }) => {
  const getIcon = (type: MedicationType) => {
    switch (type) {
      case MedicationType.TABLET:
      case MedicationType.CAPSULE:
      case MedicationType.LIQUID:
      case MedicationType.INHALER:
        return <PillIcon className="text-primary w-5 h-5 mr-2" />;
      case MedicationType.CREAM:
      case MedicationType.OINTMENT:
        return <CreamIcon className="text-primary w-5 h-5 mr-2" />;
      default:
        return <PillIcon className="text-primary w-5 h-5 mr-2" />;
    }
  };

  return (
    <div className="flex items-center p-2 bg-slate-50 rounded">
      {getIcon(medication.type)}
      <div>
        <span className="font-medium text-textPrimary">{medication.name}</span>
        <span className="text-xs text-textSecondary ml-1">({medication.dosage})</span>
        <span className="text-xs text-primary ml-2 font-semibold">{time}</span>
      </div>
    </div>
  );
};

const MySchedulePage: React.FC = () => {
  const { state } = useAppContext();
  const { medications } = state;

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // For this simple weekly view, we assume all scheduled medications are for every day.
  // A more complex app might have day-specific schedules.
  const getScheduledDosesForDay = () => {
    const doses: Array<{ medication: Medication, time: DoseTime }> = [];
    medications.forEach(med => {
      if (!med.isAsNeeded) {
        med.scheduleTimes.forEach(time => {
          doses.push({ medication: med, time });
        });
      }
    });
    // Sort by standard dose times
    const timeOrder = { [DoseTime.MORNING]: 1, [DoseTime.MIDDAY]: 2, [DoseTime.EVENING]: 3, [DoseTime.BEDTIME]: 4 };
    return doses.sort((a,b) => timeOrder[a.time] - timeOrder[b.time]);
  };
  
  const dailyDoses = getScheduledDosesForDay();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-textPrimary">My Schedule</h1>
      <p className="text-textSecondary">Here's your weekly medication overview. This page is for viewing your general routine.</p>

      {medications.length === 0 || dailyDoses.length === 0 ? (
         <div className="text-center py-10 bg-surface rounded-lg shadow">
          <PillIcon className="mx-auto text-primary opacity-50 w-16 h-16 mb-4" />
          <p className="text-textSecondary text-lg">No medications scheduled yet.</p>
          <p className="text-textSecondary mb-6">Add medications and their schedules on the "My Medications" page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {daysOfWeek.map(day => (
            <div key={day} className="bg-surface rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold text-textPrimary border-b border-slate-200 pb-2 mb-3">{day}</h2>
                {dailyDoses.length > 0 ? (
                <div className="space-y-2">
                    {dailyDoses.map((doseItem, index) => (
                    <DailyScheduleItem key={`${doseItem.medication.id}-${doseItem.time}-${index}`} medication={doseItem.medication} time={doseItem.time} />
                    ))}
                </div>
                ) : (
                <p className="text-sm text-textSecondary">No scheduled medications for {day.toLowerCase()}.</p>
                )}
            </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default MySchedulePage;
