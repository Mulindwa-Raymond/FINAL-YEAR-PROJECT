/**
 * RuleDetail.jsx
 * 
 * Admin page for viewing detailed information of a single rule.
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Gavel, 
  Tag, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Zap,
  Power,
  FileText,
  Settings
} from 'lucide-react';
import { getRuleById } from '../../../services/ruleService';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';

export const RuleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rule, setRule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRule = async () => {
      if (!id) {
        setError('No rule ID provided');
        setLoading(false);
        return;
      }
      try {
        const res = await getRuleById(id);
        console.log('Fetched rule:', res.data);
        setRule(res.data?.data || res.data);
      } catch (err) {
        setError('Failed to load rule details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRule();
  }, [id]);

  const getActionTypeColor = (type) => {
    const config = {
      recommend_equipment: { bg: 'bg-green-100', text: 'text-green-700', label: 'Recommend Equipment' },
      recommend_detergent: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Recommend Detergent' },
      recommend_both: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Recommend Both' },
      flag_alert: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Flag Alert' },
      exclude_equipment: { bg: 'bg-red-100', text: 'text-red-700', label: 'Exclude Equipment' },
      exclude_detergent: { bg: 'bg-red-100', text: 'text-red-700', label: 'Exclude Detergent' },
    };
    return config[type] || { bg: 'bg-slate-100', text: 'text-slate-600', label: type };
  };

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => navigate('/admin/rules')} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">Back to Rules</button>
        </div>
      </div>
    );
  }
  
  if (!rule) return null;

  const firstAction = rule.consequent?.actions?.[0]?.type || rule.action_type;
  const actionConfig = getActionTypeColor(firstAction);

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 lg:px-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <button onClick={() => navigate('/admin/rules')} className="flex items-center gap-2 text-slate-600 hover:text-cyan-600 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Rules
        </button>
        <Link to={`/admin/rules/${id}/edit`} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition">
          <Edit className="w-4 h-4" /> Edit Rule
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Gavel className="w-6 h-6 text-cyan-600" />
                <h1 className="text-2xl font-bold text-slate-800 font-mono">{rule.rule_id}</h1>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                  rule.category === 'safety' ? 'bg-red-100 text-red-700' :
                  rule.category === 'cost' ? 'bg-green-100 text-green-700' :
                  rule.category === 'environmental' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-cyan-100 text-cyan-700'
                }`}>
                  <Tag className="w-3 h-3" />
                  {rule.category?.toUpperCase()}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${actionConfig.bg} ${actionConfig.text}`}>
                  <Settings className="w-3 h-3" />
                  {actionConfig.label}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                  rule.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  <Power className="w-3 h-3" />
                  {rule.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="flex gap-4 text-right">
              <div>
                <div className="text-xs text-slate-500 uppercase">Priority</div>
                <div className="text-2xl font-bold text-slate-800">{rule.priority}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase">Certainty</div>
                <div className="text-2xl font-bold text-amber-600">{Math.round((rule.certainty_factor || 1) * 100)}%</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase">Salience</div>
                <div className="text-2xl font-bold text-slate-800">{rule.salience}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Rule Text */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-cyan-600" /> Rule Description
            </h2>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-slate-700 font-mono text-sm">{rule.rule_text}</p>
            </div>
          </div>

          {/* Antecedent (IF) */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-blue-600" /> IF (Antecedent)
              <span className="text-sm font-normal text-slate-500 ml-2">Operator: {rule.antecedent?.operator || 'AND'}</span>
            </h2>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="space-y-2">
                {rule.antecedent?.conditions && rule.antecedent.conditions.length > 0 ? (
                  rule.antecedent.conditions.map((cond, idx) => (
                    <div key={idx} className="flex items-center gap-2 font-mono text-sm">
                      <span className="text-cyan-600 font-medium">{cond.attribute}</span>
                      <span className="text-slate-400">{cond.operator}</span>
                      <span className="text-slate-800 font-medium">{String(cond.value)}</span>
                      {idx < rule.antecedent.conditions.length - 1 && (
                        <span className="text-amber-600 font-bold ml-2">{rule.antecedent.operator || 'AND'}</span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm">No conditions defined</p>
                )}
              </div>
            </div>
          </div>

          {/* Consequent (THEN) */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-amber-600" /> THEN (Consequent)
            </h2>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              {rule.consequent?.actions && rule.consequent.actions.length > 0 ? (
                rule.consequent.actions.map((action, idx) => (
                  <div key={idx} className="mb-3 last:mb-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-700">
                        {action.type?.replace(/_/g, ' ') || 'Unknown Action'}
                      </span>
                      {action.target && (
                        <span className="text-sm text-slate-600">Target: <code className="bg-white px-1 py-0.5 rounded">{action.target}</code></span>
                      )}
                      {action.parameters?.factor && (
                        <span className="text-sm text-slate-600">Factor: {action.parameters.factor}</span>
                      )}
                      {action.parameters?.message && (
                        <span className="text-sm text-amber-600">⚠️ {action.parameters.message}</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm">No actions defined</p>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="border-t border-slate-200 pt-4">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Metadata</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {rule.createdAt && (
                <div>
                  <span className="text-slate-500">Created:</span>
                  <p>{new Date(rule.createdAt).toLocaleString()}</p>
                </div>
              )}
              {rule.updatedAt && (
                <div>
                  <span className="text-slate-500">Last Updated:</span>
                  <p>{new Date(rule.updatedAt).toLocaleString()}</p>
                </div>
              )}
              {rule.created_by && (
                <div>
                  <span className="text-slate-500">Created By:</span>
                  <p>{rule.created_by}</p>
                </div>
              )}
              {rule._id && (
                <div>
                  <span className="text-slate-500">Database ID:</span>
                  <p className="font-mono text-xs">{rule._id}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};