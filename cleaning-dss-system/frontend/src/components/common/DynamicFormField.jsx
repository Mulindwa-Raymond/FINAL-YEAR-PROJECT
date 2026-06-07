/**
 * DynamicFormField.jsx
 * Renders different form field types based on configuration.
 * Supports: range, select, multiselect, number, radio, checkbox.
 * Professional design for cleaning equipment selection with portal-based dropdowns.
 */

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom'; // Added for boundary escape
import { 
  ChevronDown, Check, X, HelpCircle, 
  Ruler, DollarSign, Droplets, Zap, 
  Wind, Thermometer, Gauge, Clock,
  Building2, Home, Factory, Truck,
  Shield, Leaf, Volume2, Battery,
  Wifi, Users, Brush, Award,
  Maximize2, Minimize2
} from 'lucide-react';

// Helper function to get context-appropriate icon
const getFieldIcon = (fieldId, fieldLabel, fieldType) => {
  const label = fieldLabel?.toLowerCase() || '';
  const id = fieldId?.toLowerCase() || '';
  
  if (label.includes('area') || label.includes('size') || id.includes('area') || id.includes('size')) {
    return <Ruler size={18} />;
  }
  if (label.includes('budget') || label.includes('cost') || id.includes('budget')) {
    return <DollarSign size={18} />;
  }
  if (label.includes('water') || label.includes('tank') || id.includes('water')) {
    return <Droplets size={18} />;
  }
  if (label.includes('power') || id.includes('power')) {
    return <Zap size={18} />;
  }
  if (label.includes('air') || label.includes('flow') || id.includes('air')) {
    return <Wind size={18} />;
  }
  if (label.includes('temp') || label.includes('heat')) {
    return <Thermometer size={18} />;
  }
  if (label.includes('pressure') || id.includes('pressure')) {
    return <Gauge size={18} />;
  }
  if (label.includes('frequency') || id.includes('frequency')) {
    return <Clock size={18} />;
  }
  if (label.includes('env') || id.includes('environment')) {
    return <Building2 size={18} />;
  }
  if (label.includes('noise') || id.includes('sound')) {
    return <Volume2 size={18} />;
  }
  if (label.includes('battery') || id.includes('cordless')) {
    return <Battery size={18} />;
  }
  if (label.includes('smart') || id.includes('auto')) {
    return <Wifi size={18} />;
  }
  if (label.includes('eco') || id.includes('green')) {
    return <Leaf size={18} />;
  }
  if (label.includes('surface') || id.includes('floor')) {
    return <Brush size={18} />;
  }
  
  return <HelpCircle size={18} />;
};

const DynamicFormField = ({ field, value, onChange, onBlur, error, errorMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null); // Ref to track button layout position
  const [rangeHover, setRangeHover] = useState(false);
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0, width: 0 });
  
  if (!field) {
    console.warn('DynamicFormField: field prop is undefined');
    return null;
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        (!document.getElementById(`portal-${fieldId}`)?.contains(event.target))
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [field.id]);

  // Dynamically calculate and track trigger button positions for viewport rendering
  useEffect(() => {
    const updateCoordinates = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setDropdownCoords({
          top: rect.bottom,
          left: rect.left,
          width: rect.width
        });
      }
    };

    if (isOpen) {
      updateCoordinates();
      window.addEventListener('resize', updateCoordinates);
      window.addEventListener('scroll', updateCoordinates, true); // Dynamic re-alignment on container scrolls
    }

    return () => {
      window.removeEventListener('resize', updateCoordinates);
      window.removeEventListener('scroll', updateCoordinates, true);
    };
  }, [isOpen]);

  const fieldType = field.type;
  const fieldId = field.id;
  const fieldLabel = field.label;
  const fieldRequired = field.required;
  const fieldOptions = field.options;
  const fieldMin = field.min;
  const fieldMax = field.max;
  const fieldStep = field.step;
  const fieldUnit = field.unit;
  const fieldPlaceholder = field.placeholder;
  const fieldDefault = field.default;
  const fieldDescription = field.description;
  const fieldHelpText = field.helpText;

  const handleChange = (newValue) => {
    onChange(fieldId, newValue);
    if (fieldType === 'select' && fieldOptions) {
      setIsOpen(false);
    }
    if (onBlur) onBlur();
  };

  // SELECT Dropdown - Portal Escaped Floating Design
  if (fieldType === 'select' && fieldOptions && Array.isArray(fieldOptions)) {
    const selectedOption = fieldOptions.find(opt => opt.value === value);
    const fieldIcon = getFieldIcon(fieldId, fieldLabel, fieldType);
    
    return (
      <div className="space-y-3" ref={dropdownRef}>
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
            {fieldIcon}
            {fieldLabel}
            {fieldRequired && <span className="text-rose-500 text-[10px] font-normal ml-1">(Required)</span>}
          </label>
          {fieldDescription && (
            <p className="text-xs text-slate-400 leading-relaxed">{fieldDescription}</p>
          )}
        </div>
        
        <div className="relative">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            onBlur={onBlur}
            className={`
              w-full flex items-center justify-between px-5 py-4 
              bg-white border-2 rounded-xl transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-1
              min-h-[56px]
              ${error 
                ? 'border-rose-400 focus:ring-rose-200' 
                : isOpen 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-slate-200 hover:border-blue-300'
              }
            `}
          >
            <div className="flex items-center gap-3">
              {selectedOption?.icon && (
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                  {selectedOption.icon}
                </span>
              )}
              <span className={`text-base ${selectedOption ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
                {selectedOption?.label || 'Select an option...'}
              </span>
            </div>
            <ChevronDown 
              size={20} 
              className={`text-slate-400 transition-all duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          {/* Render at document body level to escape any parent overflow boundaries */}
          {isOpen && createPortal(
            <div 
              id={`portal-${fieldId}`}
              style={{
                position: 'fixed',
                top: `${dropdownCoords.top + 6}px`,
                left: `${dropdownCoords.left}px`,
                width: `${dropdownCoords.width}px`,
              }}
              className="z-[9999] bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden origin-top transform transition-all duration-200 ease-out animate-in fade-in slide-in-from-top-2"
            >
              <div className="max-h-80 overflow-y-auto overscroll-contain scroll-smooth divide-y divide-slate-100">
                {fieldOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChange(option.value)}
                    className={`
                      w-full flex items-center gap-3 px-5 py-4 
                      hover:bg-blue-50/60 transition-all duration-150 text-left
                      border-l-4 ${value === option.value ? 'border-l-blue-500 bg-blue-50' : 'border-l-transparent'}
                      min-h-[64px]
                    `}
                  >
                    {option.icon && (
                      <span className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                        {option.icon}
                      </span>
                    )}
                    <div className="flex-1">
                      <p className={`text-base font-medium ${value === option.value ? 'text-blue-700' : 'text-slate-700'}`}>
                        {option.label}
                      </p>
                      {option.description && (
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{option.description}</p>
                      )}
                    </div>
                    {value === option.value && (
                      <Check size={18} className="text-blue-600 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>,
            document.body
          )}
        </div>
        
        {fieldHelpText && (
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
            <HelpCircle size={12} className="text-slate-400" />
            <span>{fieldHelpText}</span>
          </p>
        )}
        {error && errorMessage && (
          <p className="text-rose-500 text-xs mt-1 flex items-center gap-1">
            <span className="text-rose-500">●</span> {errorMessage}
          </p>
        )}
      </div>
    );
  }

  // RANGE Slider
  if (fieldType === 'range') {
    const rangeValue = value || fieldDefault || fieldMin || 0;
    const min = fieldMin || 0;
    const max = fieldMax || 1000;
    const percentage = ((rangeValue - min) / (max - min)) * 100;
    const fieldIcon = getFieldIcon(fieldId, fieldLabel, fieldType);
    
    const tickCount = 5;
    const ticks = Array.from({ length: tickCount + 1 }, (_, i) => min + (i * (max - min) / tickCount));
    
    return (
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              {fieldIcon}
              {fieldLabel}
              {fieldRequired && <span className="text-rose-500 text-[10px] font-normal ml-1">(Required)</span>}
            </label>
            <div className="flex items-baseline gap-1 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-sm">
              <span className="text-xl font-bold text-blue-700">{Math.round(rangeValue)}</span>
              {fieldUnit && <span className="text-xs font-medium text-blue-500">{fieldUnit}</span>}
            </div>
          </div>
          {fieldDescription && (
            <p className="text-xs text-slate-400 leading-relaxed">{fieldDescription}</p>
          )}
        </div>
        
        <div className="space-y-4 pt-2">
          <div className="relative">
            <input
              type="range"
              min={min}
              max={max}
              step={fieldStep || (max - min) / 100}
              value={rangeValue}
              onChange={(e) => handleChange(parseFloat(e.target.value))}
              onMouseEnter={() => setRangeHover(true)}
              onMouseLeave={() => setRangeHover(false)}
              className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`
              }}
            />
            
            <style jsx>{`
              input[type="range"]::-webkit-slider-thumb {
                appearance: none;
                width: 20px;
                height: 20px;
                background: white;
                border: 2px solid #3b82f6;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                transition: all 0.2s ease;
              }
              input[type="range"]::-webkit-slider-thumb:hover {
                transform: scale(1.2);
                background: #3b82f6;
              }
              input[type="range"]::-moz-range-thumb {
                width: 20px;
                height: 20px;
                background: white;
                border: 2px solid #3b82f6;
                border-radius: 50%;
                cursor: pointer;
              }
            `}</style>
          </div>
          
          <div className="relative px-1">
            <div className="flex justify-between">
              {ticks.map((tick, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-px h-2 bg-slate-300"></div>
                  <span className="text-[9px] text-slate-400 mt-1 font-mono">
                    {Math.round(tick)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between text-[10px] text-slate-500 pt-1">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-slate-300"></div>
              <span>Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              <span>High</span>
            </div>
          </div>
        </div>
        
        {fieldHelpText && (
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <HelpCircle size={12} className="text-slate-400" />
            <span>{fieldHelpText}</span>
          </p>
        )}
        {error && errorMessage && (
          <p className="text-rose-500 text-xs flex items-center gap-1">
            <span className="text-rose-500">●</span> {errorMessage}
          </p>
        )}
      </div>
    );
  }

  // NUMBER Input
  if (fieldType === 'number') {
    const fieldIcon = getFieldIcon(fieldId, fieldLabel, fieldType);
    
    return (
      <div className="space-y-3">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
            {fieldIcon}
            {fieldLabel}
            {fieldRequired && <span className="text-rose-500 text-[10px] font-normal ml-1">(Required)</span>}
          </label>
          {fieldDescription && (
            <p className="text-xs text-slate-400 leading-relaxed">{fieldDescription}</p>
          )}
        </div>
        
        <div className="relative">
          <input
            type="number"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={onBlur}
            placeholder={fieldPlaceholder || `Enter ${fieldLabel?.toLowerCase()}`}
            min={fieldMin}
            max={fieldMax}
            step={fieldStep || 1}
            className={`
              w-full px-5 py-4 bg-white border-2 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all
              placeholder:text-slate-400 text-base
              min-h-[56px]
              ${error 
                ? 'border-rose-400 focus:ring-rose-200' 
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
              }
            `}
          />
          {fieldUnit && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-mono text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
              {fieldUnit}
            </span>
          )}
        </div>
        
        {fieldMin && fieldMax && (
          <div className="flex justify-between text-[10px] text-slate-400 px-1">
            <span>Min: {fieldMin} {fieldUnit || ''}</span>
            <span>Max: {fieldMax} {fieldUnit || ''}</span>
          </div>
        )}
        
        {fieldHelpText && (
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <HelpCircle size={12} className="text-slate-400" />
            <span>{fieldHelpText}</span>
          </p>
        )}
        {error && errorMessage && (
          <p className="text-rose-500 text-xs flex items-center gap-1">
            <span className="text-rose-500">●</span> {errorMessage}
          </p>
        )}
      </div>
    );
  }

  // RADIO Group
  if (fieldType === 'radio' && fieldOptions && Array.isArray(fieldOptions)) {
    const fieldIcon = getFieldIcon(fieldId, fieldLabel, fieldType);
    
    return (
      <div className="space-y-3">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
            {fieldIcon}
            {fieldLabel}
            {fieldRequired && <span className="text-rose-500 text-[10px] font-normal ml-1">(Required)</span>}
          </label>
          {fieldDescription && (
            <p className="text-xs text-slate-400 leading-relaxed">{fieldDescription}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fieldOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleChange(option.value)}
              onBlur={onBlur}
              className={`
                p-5 rounded-xl border-2 transition-all text-left group
                min-h-[100px]
                ${value === option.value
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
                }
              `}
            >
              <div className="flex items-start gap-4">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center transition-all
                  ${value === option.value 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100'
                  }
                `}>
                  {option.icon || <Gauge size={22} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`text-base font-semibold ${value === option.value ? 'text-blue-700' : 'text-slate-700'}`}>
                      {option.label}
                    </p>
                    {value === option.value && (
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-sm">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  {option.description && (
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{option.description}</p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {error && errorMessage && (
          <p className="text-rose-500 text-xs flex items-center gap-1">
            <span className="text-rose-500">●</span> {errorMessage}
          </p>
        )}
      </div>
    );
  }

  // MULTISELECT
  if (fieldType === 'multiselect' && fieldOptions && Array.isArray(fieldOptions)) {
    const selectedValues = Array.isArray(value) ? value : (value ? [value] : []);
    const availableOptions = fieldOptions.filter(opt => !selectedValues.includes(opt.value));
    const fieldIcon = getFieldIcon(fieldId, fieldLabel, fieldType);
    
    return (
      <div className="space-y-3">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
            {fieldIcon}
            {fieldLabel}
            {fieldRequired && <span className="text-rose-500 text-[10px] font-normal ml-1">(Required)</span>}
          </label>
          {fieldDescription && (
            <p className="text-xs text-slate-400 leading-relaxed">{fieldDescription}</p>
          )}
        </div>

        {selectedValues.length > 0 && (
          <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
            {selectedValues.map((val) => {
              const opt = fieldOptions.find(o => o.value === val);
              return (
                <span
                  key={val}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                >
                  {opt?.icon && <span className="w-4 h-4">{opt.icon}</span>}
                  {opt?.label || val}
                  <button
                    type="button"
                    onClick={() => handleChange(selectedValues.filter(v => v !== val))}
                    className="ml-1 hover:text-blue-900 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              );
            })}
          </div>
        )}

        {availableOptions.length > 0 && (
          <div className="space-y-3">
            <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Available options
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleChange([...selectedValues, option.value])}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl text-sm transition-all min-h-[52px]"
                >
                  {option.icon && <span className="w-5 h-5 text-slate-500">{option.icon}</span>}
                  <span className="text-slate-600">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {error && errorMessage && (
          <p className="text-rose-500 text-xs flex items-center gap-1">
            <span className="text-rose-500">●</span> {errorMessage}
          </p>
        )}
      </div>
    );
  }

  // CHECKBOX
  if (fieldType === 'checkbox') {
    const fieldIcon = getFieldIcon(fieldId, fieldLabel, fieldType);
    
    return (
      <label className={`
        flex items-center justify-between p-5 bg-white rounded-xl border-2 cursor-pointer
        transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/20
        min-h-[80px]
        ${value ? 'border-blue-500 bg-blue-50/30 shadow-sm' : 'border-slate-200'}
      `}>
        <div className="flex items-center gap-4">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center transition-all
            ${value ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-500'}
          `}>
            {fieldIcon}
          </div>
          <div>
            <p className={`text-base font-semibold ${value ? 'text-blue-700' : 'text-slate-700'}`}>
              {fieldLabel}
            </p>
            {fieldDescription && (
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{fieldDescription}</p>
            )}
          </div>
        </div>
        <div className={`
          w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all
          ${value ? 'bg-blue-500 border-blue-500 shadow-sm' : 'border-slate-300 bg-white'}
        `}>
          {value && <Check size={16} className="text-white" />}
        </div>
        <input
          type="checkbox"
          checked={value || false}
          onChange={(e) => handleChange(e.target.checked)}
          onBlur={onBlur}
          className="hidden"
        />
      </label>
    );
  }

  console.warn('Unsupported field type:', fieldType, 'for field:', fieldId);
  return (
    <div className="text-amber-600 p-5 bg-amber-50 rounded-xl border border-amber-200">
      <div className="flex items-center gap-2">
        <span className="font-semibold">⚠️ Unsupported field type</span>
      </div>
      <div className="text-xs mt-2 text-amber-500">
        Field: {fieldLabel || fieldId} | Type: {fieldType || 'unknown'}
      </div>
    </div>
  );
};

export default DynamicFormField;