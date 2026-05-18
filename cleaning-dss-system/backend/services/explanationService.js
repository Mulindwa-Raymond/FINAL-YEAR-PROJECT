/**
 * ExplanationService
 * Generates human-readable explanations for recommendations.
 * Formats reasoning traces into user-friendly text.
 */

class ExplanationService {
  constructor() {}

  /**
   * Generate summary explanation from reasoning trace
   */
  generateSummary(reasoningTrace, recommendations) {
    const summaryParts = [];
    
    // Equipment recommendation explanation
    if (recommendations.primary_equipment_id) {
      const equipRules = reasoningTrace.filter(r => 
        r.action_taken.includes('recommend_equipment')
      );
      if (equipRules.length > 0) {
        summaryParts.push(`Equipment recommendation: ${equipRules[equipRules.length - 1].explanation}`);
      }
    }
    
    // Detergent recommendation explanation
    if (recommendations.primary_detergent_id) {
      const detRules = reasoningTrace.filter(r => 
        r.action_taken.includes('recommend_detergent')
      );
      if (detRules.length > 0) {
        summaryParts.push(`Detergent recommendation: ${detRules[detRules.length - 1].explanation}`);
      }
    }
    
    // Alerts explanation
    if (recommendations.alerts && recommendations.alerts.length > 0) {
      const alertRules = reasoningTrace.filter(r => 
        r.action_taken.includes('add_alert')
      );
      for (let i = 0; i < recommendations.alerts.length; i++) {
        if (alertRules[i]) {
          summaryParts.push(`Alert: ${alertRules[i].explanation}`);
        }
      }
    }
    
    if (summaryParts.length === 0) {
      return "No specific reasoning could be generated for this recommendation.";
    }
    
    return summaryParts.join(' ');
  }

  /**
   * Generate detailed step-by-step explanation
   */
  generateDetailed(reasoningTrace) {
    const steps = [];
    
    for (const step of reasoningTrace) {
      steps.push({
        step: step.step_number,
        rule: step.rule_id,
        explanation: step.explanation,
        confidence: step.certainty ? `${Math.round(step.certainty * 100)}%` : 'N/A'
      });
    }
    
    return steps;
  }

  /**
   * Generate natural language explanation
   */
  generateNaturalLanguage(reasoningTrace, inputFacts) {
    const sentences = [];
    
    // Start with input facts
    sentences.push(`You requested a cleaning solution for ${inputFacts.surface_type || 'a surface'} with ${inputFacts.dirt_type || 'soil'}.`);
    
    if (inputFacts.power_stability === 'unstable') {
      sentences.push("Your power grid is unstable, so we prioritized battery-powered equipment.");
    }
    
    // Process each reasoning step
    for (const step of reasoningTrace) {
      if (step.explanation && !sentences.includes(step.explanation)) {
        sentences.push(step.explanation);
      }
    }
    
    return sentences;
  }

  /**
   * Format explanation as HTML for display
   */
  formatAsHtml(reasoningTrace, recommendations) {
    const summary = this.generateSummary(reasoningTrace, recommendations);
    const details = this.generateDetailed(reasoningTrace);
    
    let html = `<div class="explanation-container">
      <div class="explanation-summary">
        <h4>Why these recommendations?</h4>
        <p>${summary}</p>
      </div>
      <details class="explanation-details">
        <summary>View reasoning steps (${details.length} steps)</summary>
        <ol>`;
    
    for (const step of details) {
      html += `<li>
        <strong>Step ${step.step}:</strong> ${step.explanation}
        ${step.confidence !== 'N/A' ? `<span class="confidence">(Confidence: ${step.confidence})</span>` : ''}
      </li>`;
    }
    
    html += `</ol></details></div>`;
    
    return html;
  }
}

module.exports = new ExplanationService();