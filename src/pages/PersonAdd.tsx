import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { usePerson } from '../context/PersonContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import MaskedInput from 'react-text-mask';
import type { FormData } from '../types';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required').matches(/^[a-zA-Z\s]*$/, 'First name should not contain special characters'),
  lastName: yup.string().required('Last name is required').matches(/^[a-zA-Z\s]*$/, 'Last name should not contain special characters'),
  email: yup.string().required('Email is required').email('Invalid email format'),
  phone: yup.string().required('Phone number is required').matches(/^[1-9]\d{9}$/, 'Phone number must be 10 digits starting with 1-9'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
});

const PersonAdd = () => {
  const { addPerson } = usePerson();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    control,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const selectedState = watch('state');

  const onSubmit = (data: FormData) => {
    addPerson(data);
    setShowModal(true);
  };

  const handleAddAnother = () => {
    reset(); // Reset form
    setShowModal(false);
  };

  const handleGoToList = () => {
    navigate('/list');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto bg-gray-900 rounded-2xl shadow-xl p-10 border border-gray-700">
        <h2 className="text-4xl font-extrabold text-center text-white mb-8">Add New Person</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Fields */}
          {[
            { name: 'firstName', label: 'First Name', type: 'text' },
            { name: 'lastName', label: 'Last Name', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
          ].map(({ name, label, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
              <input
                type={type}
                {...register(name as keyof FormData)}
                className="w-full rounded-md bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 px-3 py-2"
                placeholder={label}
              />
              {errors[name as keyof typeof errors] && (
                <p className="mt-1 text-sm text-red-400">{errors[name as keyof typeof errors]?.message}</p>
              )}
            </div>
          ))}

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <MaskedInput
                  {...field}
                  mask={[/[1-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                  guide={false}
                  placeholder="9876543210"
                  className="w-full rounded-md bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 px-3 py-2"
                />
              )}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>}
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">State</label>
            <select
              {...register('state')}
              className="w-full rounded-md bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 px-3 py-2"
            >
              <option value="">Select a state</option>
              {['MH', 'DL', 'KA', 'TN', 'UP', 'WB', 'RJ', 'GJ', 'AP', 'MP'].map((code) => (
                <option key={code} value={code}>
                  {
                    {
                      MH: 'Maharashtra',
                      DL: 'Delhi',
                      KA: 'Karnataka',
                      TN: 'Tamil Nadu',
                      UP: 'Uttar Pradesh',
                      WB: 'West Bengal',
                      RJ: 'Rajasthan',
                      GJ: 'Gujarat',
                      AP: 'Andhra Pradesh',
                      MP: 'Madhya Pradesh',
                    }[code]
                  }
                </option>
              ))}
            </select>
            {errors.state && <p className="mt-1 text-sm text-red-400">{errors.state.message}</p>}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
            <select
              {...register('city')}
              disabled={!selectedState}
              className="w-full rounded-md bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 px-3 py-2"
            >
              <option value="">Select a city</option>
              {(() => {
                const citiesMap: Record<string, string[]> = {
                  MH: ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
                  DL: ['New Delhi', 'Dwarka', 'Noida', 'Gurgaon'],
                  KA: ['Bangalore', 'Mysore', 'Mangalore', 'Hubli'],
                  TN: ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
                  UP: ['Lucknow', 'Kanpur', 'Varanasi', 'Agra'],
                  WB: ['Kolkata', 'Siliguri', 'Howrah', 'Durgapur'],
                  RJ: ['Jaipur', 'Udaipur', 'Jodhpur', 'Kota'],
                  GJ: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
                  AP: ['Hyderabad', 'Visakhapatnam', 'Vijayawada', 'Guntur'],
                  MP: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior'],
                };
                return (citiesMap[selectedState] || []).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ));
              })()}
            </select>
            {errors.city && <p className="mt-1 text-sm text-red-400">{errors.city.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-lg"
          >
            Add Person
          </button>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
    <div className="bg-[#1f1f1f] p-8 rounded-xl border border-gray-700 shadow-2xl w-full max-w-md text-center animate-fade-in">
      <h3 className="text-2xl font-semibold text-white mb-4">Person Added</h3>
      <p className="text-gray-400 mb-6">The person has been successfully saved to the directory.</p>

      <div className="flex flex-row sm:flex-row justify-center gap-4">
        <button
          onClick={handleAddAnother}
          className="px-8 py-4 bg-black text-white border border-white rounded-lg transition-all duration-300 text-center w-full sm:w-auto font-medium hover:border-transparent hover:bg-black hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] relative after:absolute after:inset-0 after:p-[2px] after:rounded-lg after:content-[''] hover:after:bg-gradient-to-r hover:after:from-blue-500 hover:after:to-purple-600 after:mask-composite after:-z-10"
        >
          Add Another
        </button>
        <button
          onClick={handleGoToList}
          className="px-8 py-4 bg-black text-white border border-white rounded-lg transition-all duration-300 text-center w-full sm:w-auto font-medium hover:border-transparent hover:bg-black hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] relative after:absolute after:inset-0 after:p-[2px] after:rounded-lg after:content-[''] hover:after:bg-gradient-to-r hover:after:from-blue-500 hover:after:to-purple-600 after:mask-composite after:-z-10"
        >
          View Directory
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default PersonAdd;
