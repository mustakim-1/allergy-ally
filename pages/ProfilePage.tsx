
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../App';
import { UserProfile } from '../definitions';

const ProfilePage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [profile, setProfile] = useState<UserProfile>(state.profile);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setProfile(state.profile);
  }, [state.profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // For checkboxes (like notification toggles)
    const inputValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setProfile(prev => ({ ...prev, [name]: inputValue }));
    setIsSaved(false); // Reset saved status on change
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_PROFILE', payload: profile });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000); // Hide message after 3 seconds
  };
  
  const InputField: React.FC<{label: string, name: keyof UserProfile, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, placeholder?: string}> = 
    ({label, name, value, onChange, type = "text", placeholder}) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-textSecondary mb-1">{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2.5 border border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-surface"
      />
    </div>
  );

  const ToggleSwitch: React.FC<{label: string, name: keyof UserProfile, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, description?: string}> = 
    ({label, name, checked, onChange, description}) => (
    <div className="flex items-start justify-between py-3">
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-textPrimary">{label}</label>
            {description && <p className="text-xs text-textSecondary">{description}</p>}
        </div>
        <div className="relative inline-flex items-center cursor-pointer">
            <input 
                type="checkbox" 
                id={name} 
                name={name} 
                checked={checked} 
                onChange={onChange} 
                className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-light rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
        </div>
    </div>
  );


  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-textPrimary">My Profile</h1>
      
      <form onSubmit={handleSubmit} className="bg-surface shadow-lg rounded-lg p-6 md:p-8 space-y-6">
        <h2 className="text-xl font-semibold text-textPrimary border-b border-slate-200 pb-3">Personal Information</h2>
        <InputField label="Your Name" name="userName" value={profile.userName} onChange={handleChange} placeholder="Enter your name" />

        <h2 className="text-xl font-semibold text-textPrimary border-b border-slate-200 pb-3 pt-4">Contact Information</h2>
        <InputField label="Doctor's Name" name="doctorName" value={profile.doctorName} onChange={handleChange} placeholder="Dr. Smith" />
        <InputField label="Doctor's Phone" name="doctorPhone" type="tel" value={profile.doctorPhone} onChange={handleChange} placeholder="e.g. (555) 123-4567" />
        <InputField label="Pharmacy Name" name="pharmacyName" value={profile.pharmacyName} onChange={handleChange} placeholder="Local Pharmacy" />
        <InputField label="Pharmacy Phone" name="pharmacyPhone" type="tel" value={profile.pharmacyPhone} onChange={handleChange} placeholder="e.g. (555) 987-6543" />

        <h2 className="text-xl font-semibold text-textPrimary border-b border-slate-200 pb-3 pt-4">Health Information</h2>
        <div>
          <label htmlFor="knownAllergies" className="block text-sm font-medium text-textSecondary mb-1">Known Drug Allergies</label>
          <textarea
            id="knownAllergies"
            name="knownAllergies"
            value={profile.knownAllergies}
            onChange={handleChange}
            rows={3}
            placeholder="List any drug allergies you have (e.g., Penicillin, Aspirin)"
            className="w-full p-2.5 border border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-surface"
          />
        </div>

        <h2 className="text-xl font-semibold text-textPrimary border-b border-slate-200 pb-3 pt-4">Notification Settings</h2>
        <div className="divide-y divide-slate-200">
            <ToggleSwitch 
                label="Enable Push Notifications" 
                name="enablePushNotifications" 
                checked={profile.enablePushNotifications} 
                onChange={handleChange}
                description="Get reminders on your device when it's time for medicine. (UI Only)" 
            />
            <ToggleSwitch 
                label="Email Reminders" 
                name="enableEmailReminders" 
                checked={profile.enableEmailReminders} 
                onChange={handleChange}
                description="Receive email alerts for your medication schedule. (UI Only)"
            />
        </div>
        
        <div className="pt-4 flex items-center space-x-4">
            <button
            type="submit"
            className="bg-primary text-white py-2.5 px-6 rounded-md shadow hover:bg-primary-dark transition duration-150 font-medium"
            >
            Save Profile
            </button>
            {isSaved && <p className="text-sm text-green-600 font-medium">Profile saved successfully!</p>}
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
