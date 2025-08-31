/**
 * C-Suite Intelligent Task Router
 * August 2025 Best Practices Implementation
 * 
 * This module demonstrates the intelligent routing logic for our
 * optimized C-suite agent architecture.
 */

interface TaskRequest {
  description: string;
  domain?: 'focus' | 'users' | 'value' | 'admin' | 'funds';
  complexity?: 'simple' | 'executive' | 'coordination' | 'strategic';
  impact?: 'single' | 'multi' | 'organization';
  urgency?: 'low' | 'medium' | 'high' | 'critical';
}

interface ExecutiveContext {
  currentLoad: number;
  recentDecisions: string[];
  specialistAvailability: Record<string, boolean>;
  performanceScore: number;
}

interface RoutingDecision {
  level: 1 | 2 | 3 | 4;
  executive: string;
  specialists: string[];
  collaborators: string[];
  estimatedTime: number;
  escalationPath: string[];
}

class CSuiteRouter {
  private executiveContext: Record<string, ExecutiveContext> = {
    'ceo-leadership': {
      currentLoad: 0.3,
      recentDecisions: ['strategic-planning', 'priority-alignment'],
      specialistAvailability: {
        'strategic-analyst': true,
        'organizational-coordinator': true,
        'decision-framework': true
      },
      performanceScore: 0.92
    },
    'cmo-marketing-sales': {
      currentLoad: 0.6,
      recentDecisions: ['ux-optimization', 'content-strategy'],
      specialistAvailability: {
        'content-marketer': true,
        'social-media-copywriter': false,
        'conversion-optimizer': true,
        'user-experience-designer': true,
        'marketing-attribution-analyst': true
      },
      performanceScore: 0.88
    },
    'cvo-product-service': {
      currentLoad: 0.4,
      recentDecisions: ['pricing-strategy', 'feature-prioritization'],
      specialistAvailability: {
        'product-strategist': true,
        'value-analyst': true,
        'service-optimizer': false,
        'pricing-strategist': true
      },
      performanceScore: 0.91
    },
    'coo-management-operations': {
      currentLoad: 0.7,
      recentDecisions: ['infrastructure-optimization', 'security-audit'],
      specialistAvailability: {
        'architect-reviewer': true,
        'code-reviewer': true,
        'debugger': true,
        'performance-profiler': false,
        'database-admin': true,
        'infrastructure-orchestrator': true,
        'mcp-integration-engineer': true,
        'security-specialist': true
      },
      performanceScore: 0.94
    },
    'cfo-cash-flow': {
      currentLoad: 0.2,
      recentDecisions: ['budget-allocation', 'compliance-review'],
      specialistAvailability: {
        'business-analyst': true,
        'legal-advisor': true,
        'payment-integration': true
      },
      performanceScore: 0.89
    }
  };

  /**
   * Analyze task and determine optimal routing
   */
  public routeTask(request: TaskRequest): RoutingDecision {
    // Step 1: Classify the task
    const classification = this.classifyTask(request);
    
    // Step 2: Determine complexity level
    const level = this.determineComplexityLevel(classification);
    
    // Step 3: Select primary executive
    const executive = this.selectExecutive(classification, level);
    
    // Step 4: Assign specialists
    const specialists = this.assignSpecialists(executive, classification);
    
    // Step 5: Identify collaborators
    const collaborators = this.identifyCollaborators(classification, executive);
    
    // Step 6: Estimate time and create escalation path
    const estimatedTime = this.estimateTime(level, specialists.length);
    const escalationPath = this.createEscalationPath(level, executive);

    return {
      level,
      executive,
      specialists,
      collaborators,
      estimatedTime,
      escalationPath
    };
  }

  private classifyTask(request: TaskRequest): TaskClassification {
    // AI-powered task classification logic
    const keywords = request.description.toLowerCase();
    
    // Domain classification
    let domain = request.domain;
    if (!domain) {
      domain = this.inferDomain(keywords);
    }

    // Complexity classification
    let complexity = request.complexity;
    if (!complexity) {
      complexity = this.inferComplexity(keywords, request.impact);
    }

    return {
      domain,
      complexity,
      impact: request.impact || this.inferImpact(keywords),
      urgency: request.urgency || this.inferUrgency(keywords),
      keywords
    };
  }

  private inferDomain(keywords: string): 'focus' | 'users' | 'value' | 'admin' | 'funds' {
    const domainPatterns = {
      focus: ['strategy', 'priority', 'vision', 'alignment', 'planning', 'organizational'],
      users: ['user', 'ux', 'ui', 'frontend', 'conversion', 'marketing', 'content'],
      value: ['product', 'feature', 'value', 'pricing', 'service', 'offering'],
      admin: ['technical', 'infrastructure', 'database', 'security', 'backend', 'deploy'],
      funds: ['budget', 'cost', 'financial', 'payment', 'legal', 'compliance']
    };

    let maxScore = 0;
    let bestDomain: keyof typeof domainPatterns = 'admin';

    for (const [domain, patterns] of Object.entries(domainPatterns)) {
      const score = patterns.reduce((acc, pattern) => 
        acc + (keywords.includes(pattern) ? 1 : 0), 0);
      
      if (score > maxScore) {
        maxScore = score;
        bestDomain = domain as keyof typeof domainPatterns;
      }
    }

    return bestDomain;
  }

  private inferComplexity(keywords: string, impact?: string): 'simple' | 'executive' | 'coordination' | 'strategic' {
    const complexityIndicators = {
      simple: ['fix', 'bug', 'error', 'debug', 'quick'],
      executive: ['design', 'strategy', 'optimize', 'improve', 'plan'],
      coordination: ['launch', 'integrate', 'coordinate', 'multi', 'cross'],
      strategic: ['pivot', 'transform', 'restructure', 'major', 'fundamental']
    };

    if (impact === 'organization') return 'strategic';
    if (impact === 'multi') return 'coordination';

    let maxScore = 0;
    let bestComplexity: keyof typeof complexityIndicators = 'simple';

    for (const [complexity, indicators] of Object.entries(complexityIndicators)) {
      const score = indicators.reduce((acc, indicator) => 
        acc + (keywords.includes(indicator) ? 1 : 0), 0);
      
      if (score > maxScore) {
        maxScore = score;
        bestComplexity = complexity as keyof typeof complexityIndicators;
      }
    }

    return bestComplexity;
  }

  private inferImpact(keywords: string): 'single' | 'multi' | 'organization' {
    if (keywords.includes('organization') || keywords.includes('company')) return 'organization';
    if (keywords.includes('multi') || keywords.includes('cross') || keywords.includes('department')) return 'multi';
    return 'single';
  }

  private inferUrgency(keywords: string): 'low' | 'medium' | 'high' | 'critical' {
    if (keywords.includes('critical') || keywords.includes('urgent') || keywords.includes('emergency')) return 'critical';
    if (keywords.includes('asap') || keywords.includes('priority') || keywords.includes('important')) return 'high';
    if (keywords.includes('soon') || keywords.includes('needed')) return 'medium';
    return 'low';
  }

  private determineComplexityLevel(classification: TaskClassification): 1 | 2 | 3 | 4 {
    const levelMap = {
      simple: 1 as const,
      executive: 2 as const,
      coordination: 3 as const,
      strategic: 4 as const
    };

    return levelMap[classification.complexity];
  }

  private selectExecutive(classification: TaskClassification, level: number): string {
    const domainToExecutive = {
      focus: 'ceo-leadership',
      users: 'cmo-marketing-sales',
      value: 'cvo-product-service', 
      admin: 'coo-management-operations',
      funds: 'cfo-cash-flow'
    };

    // For level 3+ decisions, consider using c-suite-orchestrator
    if (level >= 3) {
      return 'c-suite-orchestrator';
    }

    const primaryExecutive = domainToExecutive[classification.domain];
    
    // Consider executive load and performance
    const context = this.executiveContext[primaryExecutive];
    if (context.currentLoad > 0.8 && classification.urgency !== 'critical') {
      // Find alternative executive with lower load
      const alternatives = Object.entries(this.executiveContext)
        .filter(([exec, ctx]) => exec !== primaryExecutive && ctx.currentLoad < 0.6)
        .sort(([,a], [,b]) => a.currentLoad - b.currentLoad);
      
      if (alternatives.length > 0) {
        return alternatives[0][0];
      }
    }

    return primaryExecutive;
  }

  private assignSpecialists(executive: string, classification: TaskClassification): string[] {
    const context = this.executiveContext[executive];
    if (!context) return [];

    // Get available specialists for this executive
    const availableSpecialists = Object.entries(context.specialistAvailability)
      .filter(([, available]) => available)
      .map(([specialist]) => specialist);

    // Select appropriate specialists based on task classification
    const selectedSpecialists: string[] = [];
    
    // Add domain-specific specialist selection logic here
    if (classification.domain === 'admin') {
      if (classification.keywords.includes('debug') || classification.keywords.includes('error')) {
        selectedSpecialists.push('debugger');
      }
      if (classification.keywords.includes('review') || classification.keywords.includes('code')) {
        selectedSpecialists.push('code-reviewer');
      }
      if (classification.keywords.includes('performance')) {
        selectedSpecialists.push('performance-profiler');
      }
    }

    return selectedSpecialists.filter(spec => availableSpecialists.includes(spec));
  }

  private identifyCollaborators(classification: TaskClassification, primaryExecutive: string): string[] {
    const collaborationMatrix: Record<string, string[]> = {
      'ceo-leadership': ['cmo-marketing-sales', 'cvo-product-service', 'coo-management-operations', 'cfo-cash-flow'],
      'cmo-marketing-sales': ['cvo-product-service', 'coo-management-operations'],
      'cvo-product-service': ['cmo-marketing-sales', 'coo-management-operations', 'cfo-cash-flow'],
      'coo-management-operations': ['cvo-product-service', 'cfo-cash-flow'],
      'cfo-cash-flow': ['cvo-product-service', 'coo-management-operations']
    };

    // For multi-domain tasks, include relevant collaborators
    if (classification.impact === 'multi' || classification.complexity === 'coordination') {
      return collaborationMatrix[primaryExecutive] || [];
    }

    // For strategic tasks, include all executives
    if (classification.complexity === 'strategic') {
      return Object.keys(this.executiveContext).filter(exec => exec !== primaryExecutive);
    }

    return [];
  }

  private estimateTime(level: number, specialistCount: number): number {
    const baseTimes = {
      1: 2,   // 2 minutes
      2: 15,  // 15 minutes  
      3: 30,  // 30 minutes
      4: 60   // 60 minutes
    };

    let time = baseTimes[level as keyof typeof baseTimes];
    
    // Adjust for specialist count
    time += specialistCount * 5;
    
    return time;
  }

  private createEscalationPath(level: number, executive: string): string[] {
    const paths: Record<number, string[]> = {
      1: [executive],
      2: [executive, 'ceo-leadership'],
      3: ['c-suite-orchestrator', 'ceo-leadership'], 
      4: ['c-suite-orchestrator', 'ceo-leadership', 'board-review']
    };

    return paths[level] || [executive];
  }
}

interface TaskClassification {
  domain: 'focus' | 'users' | 'value' | 'admin' | 'funds';
  complexity: 'simple' | 'executive' | 'coordination' | 'strategic';
  impact: 'single' | 'multi' | 'organization';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  keywords: string;
}

// Example usage and testing
export function demonstrateRouting() {
  const router = new CSuiteRouter();

  const testCases: TaskRequest[] = [
    {
      description: "Fix TypeScript error in checkout form",
      urgency: "medium"
    },
    {
      description: "Redesign the user experience for better conversion rates",
      impact: "multi"
    },
    {
      description: "Launch new premium product tier with updated pricing strategy",
      complexity: "coordination"
    },
    {
      description: "Pivot business model from SaaS to marketplace",
      complexity: "strategic",
      impact: "organization"
    }
  ];

  console.log('🏢 C-Suite Router Demonstration\\n');
  
  testCases.forEach((testCase, index) => {
    console.log(`📋 Test Case ${index + 1}: "${testCase.description}"`);
    const decision = router.routeTask(testCase);
    
    console.log(`   📊 Level ${decision.level} Decision`);
    console.log(`   👔 Executive: ${decision.executive}`);
    console.log(`   🔧 Specialists: ${decision.specialists.join(', ') || 'None'}`);
    console.log(`   🤝 Collaborators: ${decision.collaborators.join(', ') || 'None'}`);
    console.log(`   ⏱️  Estimated Time: ${decision.estimatedTime} minutes`);
    console.log(`   📈 Escalation Path: ${decision.escalationPath.join(' → ')}`);
    console.log('');
  });
}

export { CSuiteRouter, type TaskRequest, type RoutingDecision };