/**
 * RuleForm.jsx
 * 
 * Admin form for creating or editing KB-DSS inference rules.
 * Supports:
 * - Rule ID, text description
 * - Antecedent (conditions with operator AND/OR)
 * - Consequent (actions with types)
 * - Certainty factor, priority, category
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  X, 
  AlertCircle, 
  Plus, 
  Trash2,
  TrendingUp,
  Zap,
  Gavel,
  Tag,
  Search
} from 'lucide-react';
import { createRule, updateRule, getRuleById, getAllRules } from '../../../services/ruleService';
import { getAllEquipment } from '../../../services/equipmentService';
import { getAllDetergents } from '../../../services/detergentService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { actionTypes, ruleCategories, surfaceTypes, dirtTypes } from '../../../utils/constants';

export const RuleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [ruleIdError, setRuleIdError] = useState('');

  // All equipment and detergents loaded upfront
  const [allEquipment, setAllEquipment] = useState([]);
  const [allDetergents, setAllDetergents] = useState([]);
  const [existingRuleIds, setExistingRuleIds] = useState(new Set());
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Search states for equipment and detergents per action
  const [equipmentSearch, setEquipmentSearch] = useState({});
  const [detergentSearch, setDetergentSearch] = useState({});
  const [showEquipDropdown, setShowEquipDropdown] = useState({});
  const [showDetDropdown, setShowDetDropdown] = useState({});

  // Refs for click-outside detection
  const equipmentDropdownRefs = useRef({});
  const detergentDropdownRefs = useRef({});

  const [formData, setFormData] = useState({
    rule_id: '',
    rule_text: '',
    antecedent: {
      operator: 'AND',
      conditions: [{ attribute: '', operator: 'EQ', value: '' }],
    },
    consequent: {
      actions: [{ type: 'recommend_equipment', target: null, parameters: {} }],
    },
    certainty_factor: 1.0,
    priority: 5,
    salience: 0,
    category: 'equipment',
    active: true,
  });

  // Load all equipment, detergents, and existing rules on mount
  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        // Fetch with no limit to get ALL equipment and detergents
        const [equipRes, detRes, rulesRes] = await Promise.all([
          getAllEquipment({ limit: 10000 }),
          getAllDetergents({ limit: 10000 }),
          getAllRules({ limit: 10000 })
        ]);
        
        console.log('Equipment API response:', equipRes);
        console.log('Detergent API response:', detRes);
        console.log('Rules API response:', rulesRes);
        
        // Extract data from response structure: { success, message, data: { equipment: [...], total, ... }, timestamp }
        const equipment = equipRes.data?.data?.equipment || equipRes.data?.data || [];
        const detergents = detRes.data?.data?.detergents || detRes.data?.data || [];
        const rules = rulesRes.data?.data?.rules || rulesRes.data?.data || [];
        
        console.log('Extracted equipment count:', equipment.length);
        console.log('Extracted detergents count:', detergents.length);
        console.log('Extracted rules count:', rules.length);
        
        setAllEquipment(Array.isArray(equipment) ? equipment : []);
        setAllDetergents(Array.isArray(detergents) ? detergents : []);
        
        // Build set of existing rule IDs (exclude current rule being edited)
        const ruleIdSet = new Set();
        if (Array.isArray(rules)) {
          rules.forEach(rule => {
            const ruleId = rule._id || rule.rule_id;
            if (ruleId && ruleId !== id) {
              ruleIdSet.add(rule.rule_id);
            }
          });
        }
        setExistingRuleIds(ruleIdSet);
      } catch (err) {
        console.error('Failed to fetch equipment/detergents:', err);
        setError('Failed to load equipment and detergent data');
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchOptions();
  }, [id]);

  // Handle click-outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close equipment dropdowns
      Object.entries(equipmentDropdownRefs.current).forEach(([idx, ref]) => {
        if (ref && !ref.contains(event.target)) {
          setShowEquipDropdown(prev => ({ ...prev, [idx]: false }));
        }
      });
      // Close detergent dropdowns
      Object.entries(detergentDropdownRefs.current).forEach(([idx, ref]) => {
        if (ref && !ref.contains(event.target)) {
          setShowDetDropdown(prev => ({ ...prev, [idx]: false }));
        }
      });
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get filtered equipment for a specific action index
  const getFilteredEquipment = (actionIdx) => {
    const query = equipmentSearch[actionIdx] || '';
    if (query.length < 2) return [];
    return allEquipment.filter(eq => 
      `${eq.brand_name} ${eq.model_name}`.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Get filtered detergents for a specific action index
  const getFilteredDetergents = (actionIdx) => {
    const query = detergentSearch[actionIdx] || '';
    if (query.length < 2) return [];
    return allDetergents.filter(det => 
      `${det.brand_name} ${det.product_name}`.toLowerCase().includes(query.toLowerCase())
    );
  };

  const selectEquipment = (actionIdx, equipment) => {
    updateAction(actionIdx, 'target', equipment._id || equipment.equipment_id);
    setEquipmentSearch(prev => ({ ...prev, [actionIdx]: `${equipment.brand_name} ${equipment.model_name}` }));
    setShowEquipDropdown(prev => ({ ...prev, [actionIdx]: false }));
  };

  const selectDetergent = (actionIdx, detergent) => {
    updateAction(actionIdx, 'target', detergent._id || detergent.detergent_id);
    setDetergentSearch(prev => ({ ...prev, [actionIdx]: `${detergent.brand_name} ${detergent.product_name}` }));
    setShowDetDropdown(prev => ({ ...prev, [actionIdx]: false }));
  };

  const addCondition = () => {
    setFormData(prev => ({
      ...prev,
      antecedent: {
        ...prev.antecedent,
        conditions: [...prev.antecedent.conditions, { attribute: '', operator: 'EQ', value: '' }]
      }
    }));
  };

  const removeCondition = (index) => {
    if (formData.antecedent.conditions.length === 1) {
      setError('You need at least one condition');
      return;
    }
    setFormData(prev => ({
      ...prev,
      antecedent: {
        ...prev.antecedent,
        conditions: prev.antecedent.conditions.filter((_, i) => i !== index)
      }
    }));
  };

  const updateCondition = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      antecedent: {
        ...prev.antecedent,
        conditions: prev.antecedent.conditions.map((cond, i) => 
          i === index ? { ...cond, [field]: value } : cond
        )
      }
    }));
  };

  const addAction = () => {
    setFormData(prev => ({
      ...prev,
      consequent: {
        actions: [...prev.consequent.actions, { type: 'flag_alert', target: null, parameters: {} }]
      }
    }));
  };

  const removeAction = (index) => {
    if (formData.consequent.actions.length === 1) {
      setError('You need at least one action');
      return;
    }
    setFormData(prev => ({
      ...prev,
      consequent: {
        actions: prev.consequent.actions.filter((_, i) => i !== index)
      }
    }));
  };

  const updateAction = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      consequent: {
        actions: prev.consequent.actions.map((action, i) => 
          i === index ? { ...action, [field]: value } : action
        )
      }
    }));
  };

  const updateActionParams = (index, paramKey, value) => {
    setFormData(prev => ({
      ...prev,
      consequent: {
        actions: prev.consequent.actions.map((action, i) => 
          i === index ? { ...action, parameters: { ...action.parameters, [paramKey]: value } } : action
        )
      }
    }));
  };

  const handleRuleIdChange = (value) => {
    setFormData({ ...formData, rule_id: value });
    
    // Check if rule ID already exists (when creating new, not editing)
    if (!id && value.trim() && existingRuleIds.has(value.trim())) {
      setRuleIdError(`Rule ID "${value}" already exists. Please use a different ID.`);
    } else {
      setRuleIdError('');
    }
  };

  useEffect(() => {
    if (id) {
      const fetchRule = async () => {
        setLoading(true);
        try {
          const res = await getRuleById(id);
          setFormData(res.data.data);
        } catch (err) {
          setError('Failed to load rule data.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchRule();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    // Validate required fields
    if (!formData.rule_id) {
      setError('Rule ID is required');
      setSaving(false);
      return;
    }
    
    // Check for duplicate rule ID
    if (ruleIdError) {
      setError('Cannot save rule: ' + ruleIdError);
      setSaving(false);
      return;
    }
    
    if (!formData.rule_text) {
      setError('Rule text is required');
      setSaving(false);
      return;
    }
    if (!formData.antecedent.conditions.some(c => c.attribute)) {
      setError('At least one valid condition is required');
      setSaving(false);
      return;
    }
    
    try {
      if (id) {
        await updateRule(id, formData);
      } else {
        await createRule(formData);
      }
      navigate('/admin/rules');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save rule.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 lg:px-6">
      <div className="bg-white rounded-lg border border-slate-200">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Gavel className="w-5 h-5 text-cyan-600" />
            <h1 className="text-xl font-semibold text-slate-800">
              {id ? 'Edit Rule' : 'Add New Rule'}
            </h1>
          </div>
          <button onClick={() => navigate('/admin/rules')} className="p-2 hover:bg-slate-100 rounded-lg transition">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {error && (
          <div className="m-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rule ID *</label>
              <input
                type="text"
                name="rule_id"
                value={formData.rule_id}
                onChange={(e) => handleRuleIdChange(e.target.value)}
                placeholder="e.g., R001, R002"
                required
                className={`w-full border rounded-lg p-2.5 font-mono text-sm focus:ring-1 outline-none ${
                  ruleIdError 
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-400' 
                    : 'border-slate-200 focus:border-cyan-400 focus:ring-cyan-400'
                }`}
              />
              {ruleIdError && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {ruleIdError}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                <Tag className="w-4 h-4 text-cyan-600" /> Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-slate-200 rounded-lg p-2.5 bg-white"
              >
                {ruleCategories.map(cat => (
                  <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rule Text *</label>
            <textarea
              value={formData.rule_text}
              onChange={(e) => setFormData({ ...formData, rule_text: e.target.value })}
              rows="3"
              placeholder="e.g., IF surface_type = tile AND dirt_type = grease THEN recommend floor scrubber"
              required
              className="w-full border border-slate-200 rounded-lg p-2.5 font-mono text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
            />
          </div>

          {/* Antecedent (IF part) */}
          <div className="border-t border-slate-200 pt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-md font-semibold text-slate-800">IF (Antecedent)</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Operator:</span>
                <select
                  value={formData.antecedent.operator}
                  onChange={(e) => setFormData({ ...formData, antecedent: { ...formData.antecedent, operator: e.target.value } })}
                  className="border border-slate-200 rounded-lg p-1 text-sm bg-white"
                >
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                </select>
              </div>
            </div>
            
            {formData.antecedent.conditions.map((condition, idx) => (
              <div key={idx} className="flex gap-2 mb-3 items-center">
                <select
                  value={condition.attribute}
                  onChange={(e) => updateCondition(idx, 'attribute', e.target.value)}
                  className="w-1/3 border border-slate-200 rounded-lg p-2 text-sm bg-white"
                >
                  <option value="">Select attribute</option>
                  <option value="surface_type">Surface Type</option>
                  <option value="dirt_type">Dirt Type</option>
                  <option value="power_stability">Power Stability</option>
                  <option value="budget_ugx">Budget</option>
                  <option value="area_size">Area Size</option>
                  <option value="eco_preference">Eco Preference</option>
                </select>
                
                <select
                  value={condition.operator}
                  onChange={(e) => updateCondition(idx, 'operator', e.target.value)}
                  className="w-24 border border-slate-200 rounded-lg p-2 text-sm bg-white"
                >
                  <option value="EQ">=</option>
                  <option value="NE">≠</option>
                  <option value="GT">{'>'}</option>
                  <option value="LT">{'<'}</option>
                  <option value="GTE">≥</option>
                  <option value="LTE">≤</option>
                </select>

                {condition.attribute === 'surface_type' ? (
                  <select
                    value={condition.value}
                    onChange={(e) => updateCondition(idx, 'value', e.target.value)}
                    className="flex-1 border border-slate-200 rounded-lg p-2 text-sm bg-white"
                  >
                    <option value="">Select value</option>
                    {surfaceTypes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : condition.attribute === 'dirt_type' ? (
                  <select
                    value={condition.value}
                    onChange={(e) => updateCondition(idx, 'value', e.target.value)}
                    className="flex-1 border border-slate-200 rounded-lg p-2 text-sm bg-white"
                  >
                    <option value="">Select value</option>
                    {dirtTypes.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                ) : condition.attribute === 'power_stability' ? (
                  <select
                    value={condition.value}
                    onChange={(e) => updateCondition(idx, 'value', e.target.value)}
                    className="flex-1 border border-slate-200 rounded-lg p-2 text-sm bg-white"
                  >
                    <option value="">Select value</option>
                    <option value="stable">Stable</option>
                    <option value="unstable">Unstable</option>
                  </select>
                ) : condition.attribute === 'eco_preference' ? (
                  <select
                    value={condition.value}
                    onChange={(e) => updateCondition(idx, 'value', e.target.value)}
                    className="flex-1 border border-slate-200 rounded-lg p-2 text-sm bg-white"
                  >
                    <option value="">Select value</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={condition.value}
                    onChange={(e) => updateCondition(idx, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-1 border border-slate-200 rounded-lg p-2 text-sm"
                  />
                )}

                <button
                  type="button"
                  onClick={() => removeCondition(idx)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addCondition}
              className="inline-flex items-center gap-1 text-sm text-cyan-600 hover:text-cyan-700 mt-2"
            >
              <Plus className="w-4 h-4" /> Add Condition
            </button>
          </div>

          {/* Consequent (THEN part) */}
          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-md font-semibold text-slate-800 mb-3">THEN (Consequent)</h3>
            
            {formData.consequent.actions.map((action, idx) => (
              <div key={idx} className="flex gap-2 mb-3 items-center flex-wrap">
                <select
                  value={action.type}
                  onChange={(e) => updateAction(idx, 'type', e.target.value)}
                  className="w-48 border border-slate-200 rounded-lg p-2 text-sm bg-white"
                >
                  {actionTypes.map(at => (
                    <option key={at} value={at}>{at.replace(/_/g, ' ')}</option>
                  ))}
                </select>

                {action.type.includes('equipment') && (
                  <div className="flex-1 relative" ref={(el) => { if (el) equipmentDropdownRefs.current[idx] = el; }}>
                    <div className="flex gap-1 items-center">
                      <Search className="absolute left-2 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search equipment..."
                        value={equipmentSearch[idx] || ''}
                        onChange={(e) => setEquipmentSearch(prev => ({ ...prev, [idx]: e.target.value }))}
                        onFocus={() => setShowEquipDropdown(prev => ({ ...prev, [idx]: true }))}
                        className="w-full border border-slate-200 rounded-lg p-2 pl-8 text-sm"
                      />
                    </div>
                    {showEquipDropdown[idx] && getFilteredEquipment(idx).length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                        {getFilteredEquipment(idx).map((equipment) => (
                          <div
                            key={equipment._id}
                            onMouseDown={() => selectEquipment(idx, equipment)}
                            className="p-2 hover:bg-cyan-50 cursor-pointer border-b border-slate-100 last:border-b-0 text-sm"
                          >
                            <div className="font-medium">{equipment.brand_name} {equipment.model_name}</div>
                            <div className="text-xs text-slate-600">{equipment.machine_category}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {showEquipDropdown[idx] && equipmentSearch[idx]?.length >= 2 && getFilteredEquipment(idx).length === 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-500 z-10">
                        No equipment found
                      </div>
                    )}
                  </div>
                )}

                {action.type.includes('detergent') && (
                  <div className="flex-1 relative" ref={(el) => { if (el) detergentDropdownRefs.current[idx] = el; }}>
                    <div className="flex gap-1 items-center">
                      <Search className="absolute left-2 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search detergent..."
                        value={detergentSearch[idx] || ''}
                        onChange={(e) => setDetergentSearch(prev => ({ ...prev, [idx]: e.target.value }))}
                        onFocus={() => setShowDetDropdown(prev => ({ ...prev, [idx]: true }))}
                        className="w-full border border-slate-200 rounded-lg p-2 pl-8 text-sm"
                      />
                    </div>
                    {showDetDropdown[idx] && getFilteredDetergents(idx).length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                        {getFilteredDetergents(idx).map((detergent) => (
                          <div
                            key={detergent._id}
                            onMouseDown={() => selectDetergent(idx, detergent)}
                            className="p-2 hover:bg-cyan-50 cursor-pointer border-b border-slate-100 last:border-b-0 text-sm"
                          >
                            <div className="font-medium">{detergent.brand_name} {detergent.product_name}</div>
                            <div className="text-xs text-slate-600">{detergent.detergent_type}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {showDetDropdown[idx] && detergentSearch[idx]?.length >= 2 && getFilteredDetergents(idx).length === 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-500 z-10">
                        No detergent found
                      </div>
                    )}
                  </div>
                )}

                {action.type === 'flag_alert' && (
                  <input
                    type="text"
                    placeholder="Alert message"
                    value={action.parameters?.message || ''}
                    onChange={(e) => updateActionParams(idx, 'message', e.target.value)}
                    className="flex-1 border border-slate-200 rounded-lg p-2 text-sm"
                  />
                )}

                {action.type === 'modify_score' && (
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Score factor (0.1-2.0)"
                    value={action.parameters?.factor || 1.0}
                    onChange={(e) => updateActionParams(idx, 'factor', parseFloat(e.target.value))}
                    className="w-32 border border-slate-200 rounded-lg p-2 text-sm"
                  />
                )}

                <button
                  type="button"
                  onClick={() => removeAction(idx)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addAction}
              className="inline-flex items-center gap-1 text-sm text-cyan-600 hover:text-cyan-700 mt-2"
            >
              <Plus className="w-4 h-4" /> Add Action
            </button>
          </div>

          {/* Rule Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-cyan-600" /> Priority (1-100)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                className="w-full border border-slate-200 rounded-lg p-2.5"
              />
              <p className="text-xs text-slate-400 mt-1">Higher = fires first</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                <Zap className="w-4 h-4 text-amber-500" /> Certainty Factor (0-1)
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={formData.certainty_factor}
                onChange={(e) => setFormData({ ...formData, certainty_factor: parseFloat(e.target.value) })}
                className="w-full border border-slate-200 rounded-lg p-2.5"
              />
              <p className="text-xs text-slate-400 mt-1">Closer to 1 = more confident</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Salience</label>
              <input
                type="number"
                value={formData.salience}
                onChange={(e) => setFormData({ ...formData, salience: parseInt(e.target.value) })}
                className="w-full border border-slate-200 rounded-lg p-2.5"
              />
              <p className="text-xs text-slate-400 mt-1">Tie-breaker when priority equal</p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
            />
            <span className="text-sm text-slate-700">Active (rule will be used by inference engine)</span>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/admin/rules')}
              className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-cyan-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-cyan-700 transition disabled:opacity-70"
            >
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Rule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};