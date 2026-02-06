
import React, { useState } from 'react';
import type { GeneratedPlan } from '../types';

// Make TypeScript aware of the 'marked' library from the global scope
declare global {
  interface Window {
    marked: {
      parse: (markdown: string) => string;
    };
  }
}

interface PlanHistoryProps {
  plans: GeneratedPlan[];
}

const PlanHistory: React.FC<PlanHistoryProps> = ({ plans }) => {
  const [expandedPlan, setExpandedPlan] = useState<number | null>(plans.length > 0 ? 0 : null);

  if (plans.length === 0) {
    return (
      <div className="bg-slate-100 p-6 rounded-lg text-center text-slate-500">
        <p>لا توجد خطط محفوظة لهذا الطالب حتى الآن.</p>
        <p className="text-sm">يمكنك توليد وحفظ الخطط من تبويب "المساعد الذكي".</p>
      </div>
    );
  }

  return (
    <div>
        <h3 className="text-xl font-bold text-teal-700 mb-6 border-b-2 border-teal-200 pb-2">سجل الخطط التعليمية المعتمدة</h3>
        <div className="space-y-4">
            {plans.slice().reverse().map((plan, index) => {
                const originalIndex = plans.length - 1 - index;
                const isExpanded = expandedPlan === originalIndex;
                return (
                    <div key={plan.createdAt} className="border border-slate-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setExpandedPlan(isExpanded ? null : originalIndex)}
                            className="w-full text-right p-4 bg-slate-50 hover:bg-slate-100 flex justify-between items-center"
                        >
                            <span className="font-bold text-slate-700">الخطة المعتمدة بتاريخ: {new Date(plan.createdAt).toLocaleDateString('ar-SA', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                            <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                        {isExpanded && (
                            <div 
                                className="p-4 bg-white prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: window.marked ? window.marked.parse(plan.content) : plan.content }}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    </div>
  );
};

export default PlanHistory;
