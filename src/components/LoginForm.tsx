'use client';

import { useState } from 'react';
import { User } from '../types';

interface LoginFormProps {
  onSubmit: (userData: User) => void;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [formData, setFormData] = useState<User>({
    rollNumber: '',
    name: ''
  });
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFocus = (field: string) => {
    setFocused(field);
  };

  const handleBlur = () => {
    setFocused(null);
  };

  return (
    <div className="form-card w-full max-w-4xl p-10 animate-fade-in hover:animate-pulse">
      <h2 className="text-2xl font-semibold mb-6 text-center">Student Login</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="mb-4 transition-all duration-300 ease-in-out">
          <label htmlFor="rollNumber" className="block text-sm font-medium mb-2 text-text">
            Roll Number
          </label>
          <div className={`relative ${focused === 'rollNumber' ? 'transform scale-[1.02] transition-transform duration-300' : ''}`}>
            <input
              type="text"
              id="rollNumber"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              onFocus={() => handleFocus('rollNumber')}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              placeholder="Enter your roll number"
              required
            />
          </div>
        </div>
        
        <div className="mb-6 transition-all duration-300 ease-in-out">
          <label htmlFor="name" className="block text-sm font-medium mb-2 text-text">
            Name
          </label>
          <div className={`relative ${focused === 'name' ? 'transform scale-[1.02] transition-transform duration-300' : ''}`}>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => handleFocus('name')}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1 font-medium text-base mt-4"
        >
          Login
        </button>
      </form>
    </div>
  );
}