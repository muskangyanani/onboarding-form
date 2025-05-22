import React, { useState, useRef } from 'react';
import type { ChangeEvent as ReactChangeEvent } from 'react'; // Renamed to avoid conflict if ChangeEvent is used elsewhere

// Define the structure for operating hours
interface OperatingHours {
  allDays: boolean;
  weekdays: boolean;
  weekend: boolean;
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
  sun: boolean;
  from: string;
  to: string;
}

// Define props for this step
interface ReceptionHoursStepProps {
  initialData?: {
    totalRooms: number;
    receptionOperatingHours: OperatingHours;
    description: string;
  };
  onNext: (data: { totalRooms: number; receptionOperatingHours: OperatingHours; description: string; }) => void;
  onBack: () => void;
}

const initialOperatingHours: OperatingHours = {
  allDays: false,
  weekdays: false,
  weekend: false,
  mon: false,
  tue: false,
  wed: false,
  thu: false,
  fri: false,
  sat: false,
  sun: false,
  from: '09:00', // Use 24-hour format for internal logic, convert for display if needed
  to: '21:00', // 21:00 is 9:00 PM
};

const ReceptionHoursStep: React.FC<ReceptionHoursStepProps> = ({ initialData, onNext, onBack }) => {
  const [totalRooms, setTotalRooms] = useState<number>(initialData?.totalRooms || 0);
  const [operatingHours, setOperatingHours] = useState<OperatingHours>(
    initialData?.receptionOperatingHours || initialOperatingHours
  );
  const [barMenuFiles, setBarMenuFiles] = useState<File[]>([]);
  const [description, setDescription] = useState<string>(initialData?.description || ''); // Initialize with initialData

  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input click

  const handleTotalRoomsChange = (e: ReactChangeEvent<HTMLInputElement>) => {
    // Ensure input is a number and non-negative
    const value = parseInt(e.target.value, 10);
    setTotalRooms(isNaN(value) || value < 0 ? 0 : value);
  };

  const handleDayToggle = (day: keyof OperatingHours) => {
    setOperatingHours(prev => {
      const newState = { ...prev };

      // Logic for toggling day groups and individual days
      if (day === 'allDays') {
        newState.allDays = !prev.allDays;
        if (newState.allDays) {
          newState.weekdays = false;
          newState.weekend = false;
          newState.mon = newState.tue = newState.wed = newState.thu = newState.fri = newState.sat = newState.sun = true;
        } else {
          // If "All Days" is untoggled, clear all individual days
          newState.mon = newState.tue = newState.wed = newState.thu = newState.fri = newState.sat = newState.sun = false;
        }
      } else if (day === 'weekdays') {
        newState.weekdays = !prev.weekdays;
        if (newState.weekdays) {
          newState.allDays = false;
          newState.weekend = false;
          newState.mon = newState.tue = newState.wed = newState.thu = newState.fri = true;
          newState.sat = newState.sun = false;
        } else {
            // If "Weekdays" is untoggled, clear weekday individual days
            newState.mon = newState.tue = newState.wed = newState.thu = newState.fri = false;
        }
      } else if (day === 'weekend') {
        newState.weekend = !prev.weekend;
        if (newState.weekend) {
          newState.allDays = false;
          newState.weekdays = false;
          newState.sat = newState.sun = true;
          newState.mon = newState.tue = newState.wed = newState.thu = newState.fri = false;
        } else {
            // If "Weekend" is untoggled, clear weekend individual days
            newState.sat = newState.sun = false;
        }
      } else { // Individual day toggled
        // Only toggle if day is an individual day key
        const individualDays: Array<keyof Pick<OperatingHours, 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'>> = [
          'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'
        ];
        if (individualDays.includes(day as any)) {
          const d = day as 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
          newState[d] = !prev[d];

          // If an individual day is toggled, deselect 'allDays', 'weekdays', 'weekend'
          newState.allDays = false;
          newState.weekdays = false;
          newState.weekend = false;

          // Optional: If all individual days become true, re-select "All Days"
          const allIndividualDaysSelected = individualDays.every(dKey => newState[dKey]);
          if (allIndividualDaysSelected) {
              newState.allDays = true;
          }
        }
      }
      return newState;
    });
  };


  const handleTimeChange = (type: 'from' | 'to', e: ReactChangeEvent<HTMLInputElement>) => {
    setOperatingHours(prev => ({ ...prev, [type]: e.target.value }));
  };

  const handleFileChange = (e: ReactChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      // Optional: Add file size/type validation here
      const validFiles = filesArray.filter(file => {
        const fileType = file.type;
        const fileSize = file.size; // in bytes
        const maxSize = 10 * 1024 * 1024; // 10 MB

        if (!['application/pdf', 'image/jpeg', 'image/png'].includes(fileType)) {
          alert(`File ${file.name} is not a PDF, JPG, or PNG.`);
          return false;
        }
        if (fileSize > maxSize) {
          alert(`File ${file.name} exceeds 10MB limit.`);
          return false;
        }
        return true;
      });

      setBarMenuFiles(prev => [...prev, ...validFiles]);
      e.target.value = ''; // Clear the input so same file can be selected again
    }
  };

  const handleRemoveFile = (index: number) => {
    setBarMenuFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Essential to allow dropping
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      // Directly use the file handling logic
      const validFiles = filesArray.filter(file => {
        const fileType = file.type;
        const fileSize = file.size; // in bytes
        const maxSize = 10 * 1024 * 1024; // 10 MB

        if (!['application/pdf', 'image/jpeg', 'image/png'].includes(fileType)) {
          alert(`File ${file.name} is not a PDF, JPG, or PNG.`);
          return false;
        }
        if (fileSize > maxSize) {
          alert(`File ${file.name} exceeds 10MB limit.`);
          return false;
        }
        return true;
      });

      setBarMenuFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation for rooms and operating hours
    if (totalRooms <= 0) {
      alert('Please enter a valid number of rooms.');
      return;
    }
    const anyDaySelected = operatingHours.mon || operatingHours.tue || operatingHours.wed ||
                           operatingHours.thu || operatingHours.fri || operatingHours.sat ||
                           operatingHours.sun || operatingHours.allDays || operatingHours.weekdays || operatingHours.weekend;
    if (!anyDaySelected) {
        alert('Please select at least one operating day.');
        return;
    }
    if (!operatingHours.from || !operatingHours.to) {
        alert('Please select operating hours.');
        return;
    }

    onNext({ totalRooms, receptionOperatingHours: operatingHours, description: description /*, menuFiles: barMenuFiles */ });
  };

  // Corrected formatTimeForDisplay to return a direct string, not JSX elements
  const formatTimeForDisplay = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Total Number of Rooms */}
      <div>
        <label htmlFor="totalRooms" className="block text-gray-700 text-sm font-medium mb-2">
          Total Number of Rooms
        </label>
        <input
          type="number"
          id="totalRooms"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={totalRooms}
          onChange={handleTotalRoomsChange}
          min="0"
          required
        />
      </div>

      {/* Reception Operating Hours */}
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Reception Operating Hours
        </label>
        <div className="flex flex-wrap gap-2 mb-4">
          {['All Days', 'Weekdays', 'Weekend'].map((dayGroup) => {
            const key = dayGroup.replace(' ', '').toLowerCase() as 'allDays' | 'weekdays' | 'weekend';
            return (
              <button
                key={key}
                type="button"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  operatingHours[key]
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => handleDayToggle(key)}
              >
                {dayGroup}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => {
            const key = day.toLowerCase() as 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
            return (
              <button
                key={key}
                type="button"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  operatingHours[key]
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => handleDayToggle(key)}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Time Pickers - CORRECTED SECTION */}
        <div className="flex items-start gap-4"> {/* Changed to items-start for label alignment */}
          <div className="flex flex-col">
            <label htmlFor="fromTime" className="block text-gray-700 text-sm font-medium mb-1">From</label> {/* Label above input */}
            <input
              type="time"
              id="fromTime"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm w-36"
              value={operatingHours.from}
              onChange={(e) => handleTimeChange('from', e)}
              required
            />
            {/* Display AM/PM below the input, using the corrected formatTimeForDisplay */}
            <span className="text-xs text-gray-500 mt-1 self-center">
              {formatTimeForDisplay(operatingHours.from)}
            </span>
          </div>

          <span className="text-gray-700 mt-8">To</span> {/* Adjusted margin-top for better alignment with inputs */}

          <div className="flex flex-col">
            <label htmlFor="toTime" className="block text-gray-700 text-sm font-medium mb-1">To</label> {/* Label above input */}
            <input
              type="time"
              id="toTime"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm w-36"
              value={operatingHours.to}
              onChange={(e) => handleTimeChange('to', e)}
              required
            />
            {/* Display AM/PM below the input */}
            <span className="text-xs text-gray-500 mt-1 self-center">
              {formatTimeForDisplay(operatingHours.to)}
            </span>
          </div>
        </div>
      </div>

      {/* Upload Menus Section */}
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Upload Menus (for food ordering or inquiries)
        </label>
        <div className="space-y-4">
          {/* Bar Menu */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Bar Menu</p>
            <div
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 transition-colors duration-200"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4m20-4h4m-4 0h4m-4 0h4m-4 0h4m-4 0h4m-4 0h4m-4 0h4m-4 0h4m-4 0h4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-semibold">Upload a file</span> or drag and drop
              </p>
              <p className="mt-1 text-xs text-gray-500">PDF, PNG, JPG, JPEG (MAX. 10MB)</p>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                multiple // Allow multiple file selection
                className="sr-only" // Visually hide the input
                onChange={handleFileChange}
                ref={fileInputRef}
                accept=".pdf, image/png, image/jpeg, image/jpg" // Specify accepted file types
              />
            </div>
            {barMenuFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
                {barMenuFiles.map((file, index) => (
                  <div key={file.name + index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <span className="text-sm text-gray-800 truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="ml-4 text-red-600 hover:text-red-800 text-xs font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description / All the L */}
      <div>
        <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-y"
          placeholder="All the L"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Continue
        </button>
      </div>
    </form>
  );
};

export default ReceptionHoursStep;