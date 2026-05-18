/**
 * RuleDetail.jsx
 * 
 * Admin page for viewing detailed information of a single rule.
 * Displays rule ID, category, condition (formatted JSON), action, priority, and status.
 * Provides edit and back buttons.
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
  Info
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
      try {
        const res = await getRuleById(id);
        setRule(res.data.data);
      } catch (err) {
        setError('Failed to load rule details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRule();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/admin/rules')}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl"
          >
            Back to Rules
          </button>
        </div>
      </div>
    );
  }
  if (!rule) return null;

  const getActionColor = (type) => {
    switch (type) {
      case 'modify_score': return 'bg-cyan-100 text-cyan-700';
      case 'add_alert': return 'bg-yellow-100 text-yellow-700';
      case 'exclude': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate('/admin/rules')}
          className="flex items-center gap-2 text-slate-600 hover:text-cyan-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Rules
        </button>
        <Link
          to={`/admin/rules/${id}/edit`}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition"
        >
          <Edit className="w-4 h-4" /> Edit Rule
        </Link>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <Gavel className="w-6 h-6 text-cyan-600" />
                {rule.rule_id}
              </h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs ${rule.category === 'equipment' ? 'bg-cyan-100 text-cyan-700' : 'bg-purple-100 text-purple-700'}`}>
                  {rule.category}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${getActionColor(rule.action.type)}`}>
                  Action: {rule.action.type.replace('_', ' ')}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${rule.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {rule.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">Priority</div>
              <div className="text-2xl font-bold text-slate-800">{rule.priority}</div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* Condition */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-cyan-600" /> Condition (IF)
            </h2>
            <pre className="bg-slate-50 rounded-xl p-4 text-sm font-mono overflow-x-auto border border-slate-200">
              {JSON.stringify(rule.condition, null, 2)}
            </pre>
          </div>

          {/* Action */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-blue-600" /> Action (THEN)
            </h2>
            <pre className="bg-slate-50 rounded-xl p-4 text-sm font-mono overflow-x-auto border border-slate-200">
              {JSON.stringify(rule.action, null, 2)}
            </pre>
            {rule.action.message && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-sm">
                <strong>Alert message:</strong> {rule.action.message}
              </div>
            )}
            {rule.action.factor && (
              <div className="mt-2 p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-cyan-700 text-sm">
                <strong>Score factor:</strong> {rule.action.factor}
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="border-t border-slate-200 pt-4">
            <h2 className="text-lg font-bold text-slate-800 mb-3">Metadata</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Created at:</span>
                <p>{new Date(rule.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-slate-500">Last updated:</span>
                <p>{new Date(rule.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};