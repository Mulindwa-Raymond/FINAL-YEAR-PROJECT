/**
 * TcoMultipliers.jsx
 * 
 * Admin page for configuring TCO (Total Cost of Ownership) multipliers.
 * These values affect the 5‑year cost calculation for equipment recommendations.
 * 
 * Fields:
 * - Local electricity rate (UGX/kWh)
 * - Import duty rate (%)
 * - Spare part lead time risk factors (for <7d, 7-21d, >21d)
 * - Annual maintenance cost (% of purchase price)
 * 
 * Fetches current values from GET /tco, updates via PUT /tco.
 */

import React, { useEffect, useState } from 'react';
import { 
  Zap, 
  Percent, 
  Clock, 
  Wrench, 
  Save, 
  RefreshCw, 
  Info,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { getTcoMultipliers, updateTcoMultipliers } from '../../../services/tcoService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';

export const TcoMultipliers = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    local_electricity_rate_ugx_per_kwh: 780,
    duty_rate_percent: 0.22,
    spare_part_lead_time_risk: {
      less_than_7d: 0.8,
      between_7_21d: 1.0,
      greater_than_21d: 1.5,
    },
    annual_maintenance_cost_percent: 0.05,
  });

  const fetchMultipliers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getTcoMultipliers();
      const data = res.data.data;
      setFormData({
        local_electricity_rate_ugx_per_kwh: data.local_electricity_rate_ugx_per_kwh || 780,
        duty_rate_percent: data.duty_rate_percent || 0.22,
        spare_part_lead_time_risk: {
          less_than_7d: data.spare_part_lead_time_risk?.less_than_7d ?? 0.8,
          between_7_21d: data.spare_part_lead_time_risk?.between_7_21d ?? 1.0,
          greater_than_21d: data.spare_part_lead_time_risk?.greater_than_21d ?? 1.5,
        },
        annual_maintenance_cost_percent: data.annual_maintenance_cost_percent ?? 0.05,
      });
    } catch (err) {
      setError('Failed to load TCO multipliers. Using default values.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMultipliers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('spare_part_lead_time_risk.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        spare_part_lead_time_risk: {
          ...prev.spare_part_lead_time_risk,
          [field]: parseFloat(value),
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await updateTcoMultipliers(formData);
      setSuccess('TCO multipliers updated successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update TCO multipliers.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            TCO Multipliers
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Configure local economic factors for 5‑year Total Cost of Ownership calculation.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Electricity rate */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Local Electricity Rate (UGX/kWh)
            </label>
            <input
              type="number"
              name="local_electricity_rate_ugx_per_kwh"
              value={formData.local_electricity_rate_ugx_per_kwh}
              onChange={handleChange}
              step="10"
              min="0"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
            />
            <p className="text-xs text-slate-400 mt-1">Current average: 780 UGX/kWh (Uganda). Used to calculate 5‑year power cost.</p>
          </div>

          {/* Duty rate */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
              <Percent className="w-4 h-4 text-blue-500" />
              Import Duty Rate (%)
            </label>
            <input
              type="number"
              name="duty_rate_percent"
              value={formData.duty_rate_percent}
              onChange={handleChange}
              step="0.01"
              min="0"
              max="1"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
            />
            <p className="text-xs text-slate-400 mt-1">As a decimal (e.g., 0.22 = 22%). Applied to equipment purchase price.</p>
          </div>

          {/* Spare part lead time risk factors */}
          <div className="border-t border-slate-200 pt-4">
            <h2 className="text-md font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              Spare Part Lead Time Risk Factors
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-slate-600">Lead time &lt; 7 days</label>
                <input
                  type="number"
                  name="spare_part_lead_time_risk.less_than_7d"
                  value={formData.spare_part_lead_time_risk.less_than_7d}
                  onChange={handleChange}
                  step="0.05"
                  min="0"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2"
                />
                <p className="text-xs text-slate-400">Multiplier for low risk (default 0.8).</p>
              </div>
              <div>
                <label className="block text-sm text-slate-600">Lead time 7‑21 days</label>
                <input
                  type="number"
                  name="spare_part_lead_time_risk.between_7_21d"
                  value={formData.spare_part_lead_time_risk.between_7_21d}
                  onChange={handleChange}
                  step="0.05"
                  min="0"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2"
                />
                <p className="text-xs text-slate-400">Medium risk (default 1.0).</p>
              </div>
              <div>
                <label className="block text-sm text-slate-600">Lead time &gt; 21 days</label>
                <input
                  type="number"
                  name="spare_part_lead_time_risk.greater_than_21d"
                  value={formData.spare_part_lead_time_risk.greater_than_21d}
                  onChange={handleChange}
                  step="0.05"
                  min="0"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2"
                />
                <p className="text-xs text-slate-400">High risk multiplier (default 1.5).</p>
              </div>
            </div>
          </div>

          {/* Annual maintenance cost */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-orange-500" />
              Annual Maintenance Cost (% of purchase price)
            </label>
            <input
              type="number"
              name="annual_maintenance_cost_percent"
              value={formData.annual_maintenance_cost_percent}
              onChange={handleChange}
              step="0.01"
              min="0"
              max="1"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
            />
            <p className="text-xs text-slate-400 mt-1">As a decimal (e.g., 0.05 = 5% per year).</p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={fetchMultipliers}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition"
            >
              <RefreshCw className="w-4 h-4" /> Reset
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition disabled:opacity-70"
            >
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-cyan-50/50 rounded-xl text-sm text-slate-600 border border-cyan-100">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-cyan-600 mt-0.5" />
            <div>
              <strong>How TCO is calculated:</strong>
              <p className="mt-1">
                5‑year TCO = Purchase Price + (Duty Rate × Price) + (Power (kW) × Hours/year × 5 × Electricity Rate) + (Annual Maintenance% × Price × 5 × Spare Part Risk)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};