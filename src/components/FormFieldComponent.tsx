'use client';

import { useState } from 'react';
import { FormField } from '../types';

interface FormFieldComponentProps {
  field: FormField;
  value: string | boolean | string[] | undefined;
  onChange: (value: string | boolean | string[]) => void;
  error?: string;
}

export default function FormFieldComponent({ field, value, onChange, error }: FormFieldComponentProps) {
  const [focused, setFocused] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { type, checked, value: inputValue } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      onChange(checked);
    } else if (type === 'radio') {
      onChange(inputValue);
    } else {
      onChange(inputValue);
    }
  };
  
  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  const handleCheckboxGroupChange = (optionValue: string, checked: boolean) => {
    const currentValues = Array.isArray(value) ? value : [];
    
    if (checked) {
      onChange([...currentValues, optionValue]);
    } else {
      onChange(currentValues.filter(v => v !== optionValue));
    }
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'tel':
      case 'email':
      case 'date':
        return (
          <input
            type={field.type}
            id={field.fieldId}
            name={field.fieldId}
            value={value as string || ''}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={field.placeholder}
            className={`w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${focused ? 'transform scale-[1.01]' : ''}`}
            data-testid={field.dataTestId}
            required={field.required}
            maxLength={field.maxLength}
            minLength={field.minLength}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            id={field.fieldId}
            name={field.fieldId}
            value={value as string || ''}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={field.placeholder}
            className={`w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${focused ? 'transform scale-[1.01]' : ''}`}
            data-testid={field.dataTestId}
            required={field.required}
            maxLength={field.maxLength}
            minLength={field.minLength}
            rows={4}
          />
        );
      
      case 'dropdown':
        return (
          <select
            id={field.fieldId}
            name={field.fieldId}
            value={value as string || ''}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${focused ? 'transform scale-[1.01]' : ''}`}
            data-testid={field.dataTestId}
            required={field.required}
          >
            <option value="">Select an option</option>
            {field.options?.map(option => (
              <option 
                key={option.value} 
                value={option.value}
                data-testid={option.dataTestId}
              >
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${field.fieldId}-${option.value}`}
                  name={field.fieldId}
                  value={option.value}
                  checked={value === option.value}
                  onChange={handleChange}
                  data-testid={option.dataTestId}
                  className="mr-2 h-4 w-4 text-primary focus:ring-primary transition-all duration-200"
                />
                <label htmlFor={`${field.fieldId}-${option.value}`}>
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
      
      case 'checkbox':
        if (field.options) {
          // Multiple checkboxes (checkbox group)
          return (
            <div className="space-y-2">
              {field.options.map(option => {
                const isChecked = Array.isArray(value) && value.includes(option.value);
                
                return (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`${field.fieldId}-${option.value}`}
                      name={`${field.fieldId}-${option.value}`}
                      checked={isChecked}
                      onChange={(e) => handleCheckboxGroupChange(option.value, e.target.checked)}
                      data-testid={option.dataTestId}
                      className="mr-2 h-4 w-4 text-primary focus:ring-primary transition-all duration-200"
                    />
                    <label htmlFor={`${field.fieldId}-${option.value}`}>
                      {option.label}
                    </label>
                  </div>
                );
              })}
            </div>
          );
        } else {
          // Single checkbox
          return (
            <div className="flex items-center">
              <input
                type="checkbox"
                id={field.fieldId}
                name={field.fieldId}
                checked={!!value}
                onChange={handleChange}
                data-testid={field.dataTestId}
                className="mr-2"
              />
              <label htmlFor={field.fieldId}>
                {field.label}
              </label>
            </div>
          );
        }
      
      default:
        return <div>Unsupported field type: {field.type}</div>;
    }
  };

  return (
    <div className="transition-all duration-300 ease-in-out animate-fade-in">
      {field.type !== 'checkbox' && (
        <label htmlFor={field.fieldId} className="block text-sm font-medium mb-2 text-text transition-colors duration-300">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="transition-all duration-300">
        {renderField()}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-500 animate-slide-up">{error}</p>
      )}
    </div>
  );
}