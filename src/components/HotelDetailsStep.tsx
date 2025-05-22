import React, { useState } from 'react';

// Define props for this step, including a way to pass data up and navigation controls
interface HotelDetailsStepProps {
  initialData?: { // Optional initial data if we're coming back to this step
    hotelName: string;
    hotelSize: string;
    hotelLocation: string;
  };
  onNext: (data: { hotelName: string; hotelSize: string; hotelLocation: string }) => void;
  onBack: () => void;
}

const HotelDetailsStep: React.FC<HotelDetailsStepProps> = ({ initialData, onNext, onBack }) => {
  const [hotelName, setHotelName] = useState<string>(initialData?.hotelName || '');
  const [hotelSize, setHotelSize] = useState<string>(initialData?.hotelSize || '');
  const [hotelLocation, setHotelLocation] = useState<string>(initialData?.hotelLocation || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (hotelName.trim() === '' || hotelSize.trim() === '' || hotelLocation.trim() === '') {
      alert('Please fill in all hotel details.');
      return;
    }
    onNext({ hotelName, hotelSize, hotelLocation });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="hotelName" className="block text-gray-700 text-sm font-medium mb-2">
          Hotel Name
        </label>
        <input
          type="text"
          id="hotelName"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Enter hotel name"
          value={hotelName}
          onChange={(e) => setHotelName(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="hotelSize" className="block text-gray-700 text-sm font-medium mb-2">
          Hotel Size
        </label>
        {/* The image shows a dropdown-like arrow, so a select element is appropriate */}
        <select
          id="hotelSize"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white appearance-none pr-8" // Added appearance-none and pr-8 for custom arrow if needed
          value={hotelSize}
          onChange={(e) => setHotelSize(e.target.value)}
          required
        >
          <option value="" disabled>Select hotel size</option>
          <option value="small">Small (1-50 rooms)</option>
          <option value="medium">Medium (51-200 rooms)</option>
          <option value="large">Large (201+ rooms)</option>
        </select>
      </div>

      <div>
        <label htmlFor="hotelLocation" className="block text-gray-700 text-sm font-medium mb-2">
          Hotel Location
        </label>
        <input
          type="text"
          id="hotelLocation"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Enter hotel location"
          value={hotelLocation}
          onChange={(e) => setHotelLocation(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button" // Use type="button" to prevent form submission
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

export default HotelDetailsStep;