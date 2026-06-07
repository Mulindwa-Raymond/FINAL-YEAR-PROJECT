/**
 * TcoMultipliers.jsx
 * 
 * Admin page for configuring global TCO calculation settings.
 * Note: Equipment-specific TCO values (price, maintenance, running costs)
 * are managed in the Equipment form per the ERD.
 * 
 * This page handles GLOBAL settings only:
 * - Electricity rate (UGX/kWh) - for running cost estimation
 * - Import duty rate (%) - for initial cost calculation
 * - Spare part lead time risk factors
 * - Annual maintenance cost percentage (default fallback)
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
  CheckCircle,
  DollarSign
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
      setError('Failed to load TCO settings. Using default values.');
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
      setSuccess('TCO settings updated successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update TCO settings.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 lg:px-6">
      <div className="bg-white rounded-lg border border-slate-200">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-cyan-600" />
              <h1 className="text-xl font-semibold text-slate-800">TCO Settings</h1>
            </div>
            <p className="text-slate-500 text-sm mt-0.5">
              Configure global cost calculation parameters
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="m-5 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Equipment TCO is calculated per equipment:</p>
            <p className="text-xs mt-1">
              <strong>Estimated TCO per year =</strong> Purchase Price + Maintenance Cost/Year + Running Cost/Year
            </p>
            <p className="text-xs mt-1">
              These values are set individually in each Equipment record. The settings below are used as 
              <strong> default fallbacks</strong> and for global calculations.
            </p>
          </div>
        </div>

        {error && (
          <div className="mx-5 mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}
        {success && (
          <div className="mx-5 mb-5 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
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
              className="w-full border border-slate-200 rounded-lg p-2.5 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
            />
            <p className="text-xs text-slate-400 mt-1">
              Current average: {formData.local_electricity_rate_ugx_per_kwh} UGX/kWh (Uganda).
              Used to calculate running costs for corded equipment.
            </p>
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
              className="w-full border border-slate-200 rounded-lg p-2.5"
            />
            <p className="text-xs text-slate-400 mt-1">
              As a decimal (e.g., 0.22 = 22%). Applied to equipment purchase price for imported machines.
            </p>
          </div>

          {/* Spare part lead time risk factors */}
          <div className="border-t border-slate-200 pt-4">
            <h2 className="text-md font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              Spare Part Lead Time Risk Factors
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Lead time &lt; 7 days</label>
                <input
                  type="number"
                  name="spare_part_lead_time_risk.less_than_7d"
                  value={formData.spare_part_lead_time_risk.less_than_7d}
                  onChange={handleChange}
                  step="0.05"
                  min="0"
                  className="w-full border border-slate-200 rounded-lg p-2"
                />
                <p className="text-xs text-slate-400 mt-1">Multiplier for low risk (default 0.8).</p>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Lead time 7‑21 days</label>
                <input
                  type="number"
                  name="spare_part_lead_time_risk.between_7_21d"
                  value={formData.spare_part_lead_time_risk.between_7_21d}
                  onChange={handleChange}
                  step="0.05"
                  min="0"
                  className="w-full border border-slate-200 rounded-lg p-2"
                />
                <p className="text-xs text-slate-400 mt-1">Medium risk (default 1.0).</p>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Lead time &gt; 21 days</label>
                <input
                  type="number"
                  name="spare_part_lead_time_risk.greater_than_21d"
                  value={formData.spare_part_lead_time_risk.greater_than_21d}
                  onChange={handleChange}
                  step="0.05"
                  min="0"
                  className="w-full border border-slate-200 rounded-lg p-2"
                />
                <p className="text-xs text-slate-400 mt-1">High risk multiplier (default 1.5).</p>
              </div>
            </div>
          </div>

          {/* Annual maintenance cost percentage */}
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
              className="w-full border border-slate-200 rounded-lg p-2.5"
            />
            <p className="text-xs text-slate-400 mt-1">
              As a decimal (e.g., 0.05 = 5% per year). Used as fallback when equipment doesn't have specific maintenance cost.
            </p>
          </div>

          {/* TCO Formula Explanation */}
          <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-cyan-600 mt-0.5" />
              <div>
                <strong className="text-sm text-slate-800">How Equipment TCO is calculated:</strong>
                <p className="text-xs text-slate-600 mt-1">
                  <strong>For each equipment:</strong><br />
                  • Purchase Price: Set in Equipment form<br />
                  • Maintenance Cost/Year: Set in Equipment form<br />
                  • Running Cost/Year: Set in Equipment form<br />
                  <br />
                  <strong>Estimated TCO per year = Purchase Price + Maintenance Cost/Year + Running Cost/Year</strong>
                </p>
                <p className="text-xs text-slate-500 mt-2 italic">
                  Note: Running costs (electricity, water) are estimated based on equipment power rating and local electricity rates.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={fetchMultipliers}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
            >
              <RefreshCw className="w-4 h-4" /> Reset
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-cyan-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-cyan-700 transition disabled:opacity-70"
            >
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};