import React, { useState } from 'react';
import OnboardingLayout from './components/OnboardingLayout';
import ContactInfoStep from './components/ContactInfoStep';
import HotelDetailsStep from './components/HotelDetailsStep';
import ReceptionHoursStep from './components/ReceptionHoursStep'; // Import the new step component

// Define the structure for operating hours (copy from ReceptionHoursStep.tsx to keep types consistent)
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

// Initial state for operating hours
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
  from: '09:00',
  to: '21:00',
};


function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    hotelName: '',
    hotelSize: '',
    hotelLocation: '',
    totalRooms: 0,
    receptionOperatingHours: initialOperatingHours, // Use the defined initial state
    // menuFiles: [] as File[], // If you decide to store files in formData, uncomment this
    description: '',
  });

  const handleContactInfoSubmit = (data: { name: string; phoneNumber: string }) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
    setCurrentStep(2);
    console.log('Contact Info Submitted:', data);
  };

  const handleHotelDetailsSubmit = (data: { hotelName: string; hotelSize: string; hotelLocation: string }) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
    setCurrentStep(3);
    console.log('Hotel Details Submitted:', data);
  };

  const handleReceptionHoursSubmit = (data: { totalRooms: number; receptionOperatingHours: OperatingHours; /* menuFiles: File[] */ description: string; }) => {
    setFormData((prevData) => ({
      ...prevData,
      totalRooms: data.totalRooms,
      receptionOperatingHours: data.receptionOperatingHours,
      // menuFiles: data.menuFiles, // If you decide to store files here
      description: data.description,
    }));
    setCurrentStep(4);
    console.log('Reception Hours Submitted:', data);
  };


  // Define onBack handlers for each step
  const handleBackToContactInfo = () => {
    setCurrentStep(1);
  };

  const handleBackToHotelDetails = () => {
    setCurrentStep(2);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ContactInfoStep onNext={handleContactInfoSubmit} />;
      case 2:
        return (
          <HotelDetailsStep
            initialData={{ hotelName: formData.hotelName, hotelSize: formData.hotelSize, hotelLocation: formData.hotelLocation }}
            onNext={handleHotelDetailsSubmit}
            onBack={handleBackToContactInfo}
          />
        );
      case 3:
        return (
          <ReceptionHoursStep
            initialData={{
              totalRooms: formData.totalRooms,
              receptionOperatingHours: formData.receptionOperatingHours,
              description: formData.description
            }}
            onNext={handleReceptionHoursSubmit}
            onBack={handleBackToHotelDetails}
          />
        );
      case 4:
        return (
          <div className="text-center text-gray-700">
            <h2>Onboarding Complete!</h2>
            <p>Thank you for providing your information.</p>
            <pre className="mt-4 p-4 bg-gray-100 rounded-md text-left text-sm overflow-auto max-h-60">
              {/* Note: Files cannot be directly JSON.stringified if stored in formData */}
              {JSON.stringify(formData, (key, value) => {
                // Custom replacer to handle File objects if they were in formData
                if (value instanceof File) {
                  return {
                    name: value.name,
                    size: value.size,
                    type: value.type,
                  };
                }
                return value;
              }, 2)}
            </pre>
          </div>
        );
      default:
        return <div>Something went wrong.</div>;
    }
  };

  // Update the title dynamically based on the current step
  const getTitle = () => {
    switch (currentStep) {
      case 1:
      case 2:
        return "Hello, I'm AgukenAI.";
      case 3:
        return "Total Number of Rooms"; // As per image_f597e3.png, the main title changes here
      case 4:
        return "Onboarding Complete!";
      default:
        return "Onboarding";
    }
  };

  const getSubtitle = () => {
    switch (currentStep) {
        case 1:
        case 2:
            return "I'm an AI Agent helping you handle reception and support calls using GenAI-based phone call automation.";
        case 3:
            return "Reception Operating Hours"; // Subtitle also changes slightly to match image
        default:
            return "";
    }
  };


  return (
    <OnboardingLayout
      title={getTitle()}
      subtitle={getSubtitle()}
    >
      {renderStep()}
    </OnboardingLayout>
  );
}

export default App;