
import React, { useState } from 'react';
import type { Student } from '../types';
import { generateReport } from '../services/geminiService';
import { SectionTitle } from './Common';

// Make TypeScript aware of the 'marked' library from the global scope
declare global {
  interface Window {
    marked: {
      parse: (markdown: string) => string;
    };
  }
}

interface ReportGeneratorProps {
  student: Student;
}

const Spinner: React.FC = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-500"></div>
);

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ student }) => {
    const [range, setRange] = useState<'7' | '30'>('30');
    const [reportContent, setReportContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const getISODateString = (date: Date): string => date.toISOString().split('T')[0];

    const handleGenerateReport = async () => {
        setIsLoading(true);
        setError(null);
        setReportContent(null);

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - parseInt(range));
        
        const filteredLogs = student.sessionLogs.filter(log => {
            const logDate = new Date(log.date);
            return logDate >= startDate && logDate <= endDate;
        });

        if (filteredLogs.length === 0) {
            setError('لا توجد جلسات مسجلة في الفترة المحددة لتوليد التقرير.');
            setIsLoading(false);
            return;
        }

        try {
            const content = await generateReport(student, filteredLogs, getISODateString(startDate), getISODateString(endDate));
            setReportContent(content);
        } catch (err) {
            setError('عذرًا، حدث خطأ أثناء توليد التقرير. يرجى المحاولة مرة أخرى.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div>
            <SectionTitle>توليد تقرير ذكي للأهل</SectionTitle>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-slate-700 mb-4">
                    يقوم المساعد الذكي بتحليل الجلسات المسجلة في الفترة المحددة وكتابة تقرير تقدم موجز بلغة بسيطة ومناسبة لمشاركته مع ولي الأمر.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1">
                        <label htmlFor="dateRange" className="block text-sm font-medium text-slate-700 mb-1">
                            الفترة الزمنية للتقرير
                        </label>
                        <select
                            id="dateRange"
                            value={range}
                            onChange={(e) => setRange(e.target.value as '7' | '30')}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition bg-white"
                        >
                            <option value="7">آخر 7 أيام</option>
                            <option value="30">آخر 30 يومًا</option>
                        </select>
                    </div>
                    <button
                        onClick={handleGenerateReport}
                        disabled={isLoading}
                        className="w-full sm:w-auto px-6 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 disabled:bg-slate-400 transition-colors self-end h-[42px] flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Spinner />
                                <span>جاري التوليد...</span>
                            </>
                        ) : (
                            '🚀 توليد التقرير'
                        )}
                    </button>
                </div>
            </div>

            {error && <div className="mt-4 p-3 text-center text-red-600 bg-red-100 border border-red-200 rounded-lg">{error}</div>}

            {reportContent && (
                <div id="report-content-wrapper" className="mt-6">
                    <div className="p-6 bg-white border border-slate-200 rounded-lg shadow">
                         <div
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: window.marked.parse(reportContent) }}
                         />
                    </div>
                    <div className="mt-4 text-right">
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                        >
                            طباعة / تصدير PDF
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Create a separate file for common components if it grows
const CommonSectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-xl font-bold text-teal-700 mb-6 border-b-2 border-teal-200 pb-2">{children}</h3>
);


export default ReportGenerator;
