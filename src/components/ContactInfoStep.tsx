import React, { useState } from 'react';

// Define props for this step, including a way to pass data up and trigger next step
interface ContactInfoStepProps {
  initialData?: { 
    name: string; 
    phoneNumber: string; 
  };
  onNext: (data: { name: string; phoneNumber: string }) => void;
}

const ContactInfoStep: React.FC<ContactInfoStepProps> = ({ onNext, initialData }) => {
  const [name, setName] = useState<string>(initialData?.name || ''); 
  const [phoneNumber, setPhoneNumber] = useState<string>(initialData?.phoneNumber || ''); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    // Basic validation
    if (name.trim() === '' || phoneNumber.trim() === '') {
      alert('Please fill in both name and phone number.');
      return;
    }
    onNext({ name, phoneNumber }); // Pass data up to the parent component
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
          Nice to meet you, I'm
        </label>
        <input
          type="text"
          id="name"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-medium mb-2">
          You can reach out at
        </label>
        <div className="flex items-center mt-1">
          {/* Country code input */}
          <select
            className="block pl-3 pr-8 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="+91">IN +91</option>
            {/* You can add more options here for other countries */}
          </select>
          <input
            type="tel" // Use type="tel" for phone numbers
            id="phoneNumber"
            className="block w-full px-4 py-2 border border-gray-300 rounded-r-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm -ml-px"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">Format: +91 xxxxx xxxxx</p>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Continue
        </button>
      </div>

      <p className="mt-4 text-xs text-gray-500 text-right">You can always edit this later</p>
    </form>
  );
};

export default ContactInfoStep;