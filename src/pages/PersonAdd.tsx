import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { usePerson } from '../context/PersonContext';
import { useNavigate } from 'react-router-dom';
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const selectedState = watch('state');

  const onSubmit = (data: FormData) => {
    addPerson(data);
    navigate('/list');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto bg-gray-900 rounded-2xl shadow-xl p-10 border border-gray-700">
        <h2 className="text-4xl font-extrabold text-center text-white mb-8">Add New Person</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {[
            { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'First Name' },
            { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last Name' },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'Email' },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                {...register(name as keyof FormData)}
                className="w-full rounded-md bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 px-3 py-2"
              />
              {errors[name as keyof typeof errors] && (
                <p className="mt-1 text-sm text-red-400">{errors[name as keyof typeof errors]?.message}</p>
              )}
            </div>
          ))}

         
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
                  className="w-full rounded-md bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 px-3 py-2"
                />
              )}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>}
          </div>

         
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">State</label>
            <select
              {...register('state')}
              className="w-full rounded-md bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 px-3 py-2"
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

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
            <select
              {...register('city')}
              className="w-full rounded-md bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 px-3 py-2"
              disabled={!selectedState}
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

         
          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-lg"
          >
            Add Person
          </button>
        </form>
      </div>
    </div>
  );
};

export default PersonAdd;
