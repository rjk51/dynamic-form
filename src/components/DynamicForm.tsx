'use client';

import { useState } from 'react';
import { FormSection, FormField, FormData } from '../types';
import FormFieldComponent from './FormFieldComponent';

interface DynamicFormProps {
  formData: {
    formTitle: string;
    formId: string;
    version: string;
    sections: FormSection[];
  };
  onSubmit: (formValues: Record<string, any>) => void;
}

export default function DynamicForm({ formData, onSubmit }: DynamicFormProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [values, setValues] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);

  const currentSection = formData.sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === formData.sections.length - 1;

  const validateField = (field: FormField, value: any): string => {
    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return field.validation?.message || 'This field is required';
    }

    if (field.minLength && typeof value === 'string' && value.length < field.minLength) {
      return `Minimum length is ${field.minLength} characters`;
    }

    if (field.maxLength && typeof value === 'string' && value.length > field.maxLength) {
      return `Maximum length is ${field.maxLength} characters`;
    }

    return '';
  };

  const validateSection = (sectionIndex: number): boolean => {
    const section = formData.sections[sectionIndex];
    const newErrors: Record<string, string> = {};
    let isValid = true;

    section.fields.forEach(field => {
      const error = validateField(field, values[field.fieldId]);
      if (error) {
        newErrors[field.fieldId] = error;
        isValid = false;
      }
    });

    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [fieldId]: value
    }));

    // Clear error when field is changed
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    if (validateSection(currentSectionIndex)) {
      setTimeout(() => {
        setCurrentSectionIndex(prev => prev + 1);
      }, 200);
    }
  };

  const handlePrevious = () => {
    setTimeout(() => {
      setCurrentSectionIndex(prev => Math.max(0, prev - 1));
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSection(currentSectionIndex)) {
      if (isLastSection) {
        setShowConfirm(true);
      } else {
        onSubmit(values);
      }
    }
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    // Log all form data when submitting
    console.log('Form data submitted:', values);
    onSubmit(values);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <div className="form-card w-full max-w-4xl p-10 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-4 text-center text-white-800">{formData.formTitle}</h2>
      <p className="text-base text-gray-600 mb-8 text-center">Form ID: {formData.formId} | Version: {formData.version}</p>
      {/* Progress Bar */}
      <div className="progress-bar mb-8 h-2 bg-gray-200 rounded-full">
        <div 
          className="progress-value bg-gradient-to-r from-primary to-secondary h-full rounded-full" 
          style={{ width: `${((currentSectionIndex + 1) / formData.sections.length) * 100}%` }}
        />
      </div>
      <div className="mb-8">
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">{currentSection.title}</h3>
          <p className="text-base text-gray-600 mb-6">{currentSection.description}</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {currentSection.fields.map((field, index) => (
              <div 
                key={field.fieldId} 
                className="mb-6" 
              >
                <FormFieldComponent
                  field={field}
                  value={values[field.fieldId]}
                  onChange={(value) => handleFieldChange(field.fieldId, value)}
                  error={errors[field.fieldId]}
                />
              </div>
            ))}
            <div className="flex justify-between mt-10 pt-4 border-t border-gray-300">
              {currentSectionIndex > 0 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
              )}
              {!isLastSection ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/50 ml-auto flex items-center"
                >
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-hover focus:outline-none focus:ring-2 focus:ring-secondary/50 ml-auto flex items-center"
                >
                  Submit
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30 transition-all duration-300">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full relative animate-fade-in transform transition-all duration-300">
            <h4 className="text-xl font-bold mb-4 text-center text-gray-800">Confirm Submission</h4>
            <p className="mb-6 text-center text-gray-600">Are you sure you want to submit the form?</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={handleCancel} 
                className="px-5 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirm} 
                className="px-5 py-2 rounded bg-green-700 text-white hover:bg-primary-hover transition-colors duration-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}