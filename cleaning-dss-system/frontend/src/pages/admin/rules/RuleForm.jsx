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

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  X, 
  AlertCircle, 
  Plus, 
  Trash2,
  TrendingUp,
  Zap
} from 'lucide-react';
import { createRule, updateRule, getRuleById } from '../../../services/ruleService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { actionTypes, ruleCategories, surfaceTypes, dirtTypes } from '../../../utils/constants';

export const RuleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            {id ? 'Edit Rule' : 'Add New Rule'}
          </h1>
          <button onClick={() => navigate('/admin/rules')} className="p-2 hover:bg-slate-100 rounded-xl transition">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rule ID *</label>
              <input
                type="text"
                name="rule_id"
                value={formData.rule_id}
                onChange={(e) => setFormData({ ...formData, rule_id: e.target.value })}
                placeholder="e.g., R001, R002"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
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
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-sm"
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
                  className="bg-slate-50 border border-slate-200 rounded-lg p-1 text-sm"
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
                  className="w-1/3 bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm"
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
                  className="w-24 bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm"
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
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm"
                  >
                    <option value="">Select value</option>
                    {surfaceTypes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : condition.attribute === 'dirt_type' ? (
                  <select
                    value={condition.value}
                    onChange={(e) => updateCondition(idx, 'value', e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm"
                  >
                    <option value="">Select value</option>
                    {dirtTypes.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                ) : condition.attribute === 'power_stability' ? (
                  <select
                    value={condition.value}
                    onChange={(e) => updateCondition(idx, 'value', e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm"
                  >
                    <option value="">Select value</option>
                    <option value="stable">Stable</option>
                    <option value="unstable">Unstable</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={condition.value}
                    onChange={(e) => updateCondition(idx, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm"
                  />
                )}

                <button
                  type="button"
                  onClick={() => removeCondition(idx)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addCondition}
              className="flex items-center gap-1 text-sm text-cyan-600 hover:text-cyan-700 mt-2"
            >
              <Plus className="w-4 h-4" /> Add Condition
            </button>
          </div>

          {/* Consequent (THEN part) */}
          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-md font-semibold text-slate-800 mb-3">THEN (Consequent)</h3>
            
            {formData.consequent.actions.map((action, idx) => (
              <div key={idx} className="flex gap-2 mb-3 items-center">
                <select
                  value={action.type}
                  onChange={(e) => updateAction(idx, 'type', e.target.value)}
                  className="w-48 bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm"
                >
                  {actionTypes.map(at => (
                    <option key={at} value={at}>{at.replace(/_/g, ' ')}</option>
                  ))}
                </select>

                {action.type.includes('equipment') && (
                  <input
                    type="text"
                    placeholder="Equipment ID or category"
                    value={action.target || ''}
                    onChange={(e) => updateAction(idx, 'target', e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm"
                  />
                )}

                {action.type.includes('detergent') && (
                  <input
                    type="text"
                    placeholder="Detergent ID or category"
                    value={action.target || ''}
                    onChange={(e) => updateAction(idx, 'target', e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm"
                  />
                )}

                {action.type === 'flag_alert' && (
                  <input
                    type="text"
                    placeholder="Alert message"
                    value={action.parameters?.message || ''}
                    onChange={(e) => updateAction(idx, 'parameters', { message: e.target.value })}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm"
                  />
                )}

                {action.type === 'modify_score' && (
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Score factor"
                    value={action.parameters?.factor || ''}
                    onChange={(e) => updateAction(idx, 'parameters', { factor: parseFloat(e.target.value) })}
                    className="w-32 bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm"
                  />
                )}

                <button
                  type="button"
                  onClick={() => removeAction(idx)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addAction}
              className="flex items-center gap-1 text-sm text-cyan-600 hover:text-cyan-700 mt-2"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
              />
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Salience</label>
              <input
                type="number"
                value={formData.salience}
                onChange={(e) => setFormData({ ...formData, salience: parseInt(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
              />
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
            />
            <span className="text-sm text-slate-700">Active (rule will be used by inference engine)</span>
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/rules')}
              className="px-6 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition disabled:opacity-70"
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