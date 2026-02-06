
import React, { useState, useEffect } from 'react';
import type { Student, AssessmentArea, CaseStudy, MedicalDiagnosis, PersonalInfo, SessionLog, UpcomingSession, AchievedGoal } from '../types';
import { ASSESSMENT_AREAS, DIAGNOSIS_OPTIONS, GOAL_TYPES, MASTERY_LEVELS } from '../constants';
import ChatAssistant from './ChatAssistant';
import PlanHistory from './PlanHistory';
import ReportGenerator from './ReportGenerator';
import { UserIcon, DocumentIcon, ChartIcon, BrainIcon, HistoryIcon, CalendarIcon, ReportIcon, TrophyIcon } from './Icons';

interface StudentProfileProps {
  student: Student;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ student, onUpdateStudent, onDeleteStudent }) => {
  const [activeTab, setActiveTab] = useState('sessions');
  
  const tabs = [
    { id: 'aiAssistant', label: 'المساعد الذكي', icon: BrainIcon },
    { id: 'planHistory', label: 'سجل الخطط', icon: HistoryIcon },
    { id: 'achievedGoals', label: 'الأهداف المحققة', icon: TrophyIcon },
    { id: 'reports', label: 'التقارير الذكية', icon: ReportIcon },
    { id: 'sessions', label: 'تقويم الجلسات', icon: CalendarIcon },
    { id: 'personalInfo', label: 'الملف الشخصي', icon: UserIcon },
    { id: 'diagnosis', label: 'التشخيص الطبي', icon: DocumentIcon },
    { id: 'caseStudy', label: 'دراسة الحالة', icon: DocumentIcon },
    { id: 'assessment', label: 'التقييم الشامل', icon: ChartIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'personalInfo':
        return <PersonalInfoForm data={student.personalInfo} onSave={(newData) => onUpdateStudent({ ...student, personalInfo: newData })} />;
      case 'diagnosis':
        return <DiagnosisForm data={student.medicalDiagnosis} onSave={(newData) => onUpdateStudent({ ...student, medicalDiagnosis: newData })} />;
      case 'caseStudy':
        return <CaseStudyForm data={student.caseStudy} onSave={(newData) => onUpdateStudent({ ...student, caseStudy: newData })} />;
      case 'assessment':
        return <AssessmentForm data={student.assessments} onSave={(newData) => onUpdateStudent({ ...student, assessments: newData })} />;
      case 'aiAssistant':
        return <ChatAssistant student={student} onUpdateStudent={onUpdateStudent} />;
      case 'planHistory':
        return <PlanHistory plans={student.planHistory} />;
      case 'sessions':
        return <SessionsForm 
                    sessionLogs={student.sessionLogs} 
                    upcomingSessions={student.upcomingSessions} 
                    onSave={(newLogs, newSessions) => onUpdateStudent({ ...student, sessionLogs: newLogs, upcomingSessions: newSessions })} />;
      case 'reports':
        return <ReportGenerator student={student} />;
      case 'achievedGoals':
        return <AchievedGoalsForm achievedGoals={student.achievedGoals} onSave={(newGoals) => onUpdateStudent({ ...student, achievedGoals: newGoals })} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg">
       <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8 border-b border-slate-200 pb-6">
            <div className="flex items-center gap-6">
                <img 
                    src={student.personalInfo.photoUrl} 
                    alt={student.personalInfo.fullName}
                    className="w-32 h-32 rounded-full object-cover ring-4 ring-offset-2 ring-teal-300"
                />
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">{student.personalInfo.fullName}</h2>
                    <p className="text-lg text-slate-500">{student.medicalDiagnosis.primaryDiagnosis || 'لا يوجد تشخيص محدد'}</p>
                </div>
            </div>
             <button
                onClick={() => onDeleteStudent(student.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
                حذف الطالب
            </button>
        </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <ul className="space-y-2">
            {tabs.map(tab => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-right flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-teal-100 text-teal-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <tab.icon className="w-6 h-6" />
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full md:w-3/4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Helper components
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-xl font-bold text-teal-700 mb-6 border-b-2 border-teal-200 pb-2">{children}</h3>
);

const FormActions: React.FC<{ onCancel: () => void; onSave: () => void; isDirty: boolean }> = ({ onCancel, onSave, isDirty }) => (
    <div className="mt-6 flex justify-end gap-3">
        <button
            onClick={onCancel}
            disabled={!isDirty}
            className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            إلغاء
        </button>
        <button
            onClick={onSave}
            disabled={!isDirty}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            حفظ التغييرات
        </button>
    </div>
);

// Form Components
const InputField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string }> = ({ label, name, value, onChange, type = 'text' }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"/>
    </div>
);

const TextAreaField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; rows?: number }> = ({ label, name, value, onChange, rows = 3 }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <textarea id={name} name={name} value={value} onChange={onChange} rows={rows} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"></textarea>
    </div>
);

const SelectField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[] }> = ({ label, name, value, onChange, options }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <select id={name} name={name} value={value} onChange={onChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition bg-white">
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);


const PersonalInfoForm: React.FC<{data: PersonalInfo, onSave: (data: PersonalInfo) => void}> = ({data, onSave}) => {
    const [formData, setFormData] = useState(data);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => { setFormData(data); setIsDirty(false); }, [data]);
    useEffect(() => { setIsDirty(JSON.stringify(data) !== JSON.stringify(formData)); }, [formData, data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSave = () => { onSave(formData); setIsDirty(false); };
    const handleCancel = () => { setFormData(data); setIsDirty(false); };

    return (
        <div>
            <SectionTitle>المعلومات الشخصية</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="الاسم الكامل" name="fullName" value={formData.fullName} onChange={handleChange} />
                <InputField label="رقم الطالب" name="studentId" value={formData.studentId} onChange={handleChange} />
                <InputField label="تاريخ الميلاد" name="dob" value={formData.dob} onChange={handleChange} type="date" />
                <InputField label="الصف" name="grade" value={formData.grade} onChange={handleChange} />
                <InputField label="معلومات التواصل مع الأهل" name="parentContact" value={formData.parentContact} onChange={handleChange} />
                <InputField label="تاريخ الالتحاق" name="enrollmentDate" value={formData.enrollmentDate} onChange={handleChange} type="date" />
            </div>
            <FormActions onCancel={handleCancel} onSave={handleSave} isDirty={isDirty} />
        </div>
    );
};

const DiagnosisForm: React.FC<{data: MedicalDiagnosis, onSave: (data: MedicalDiagnosis) => void}> = ({data, onSave}) => {
    const [formData, setFormData] = useState(data);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => { setFormData(data); setIsDirty(false); }, [data]);
    
    useEffect(() => {
        const { reportFile: currentFile, ...currentRest } = formData;
        const { reportFile: originalFile, ...originalRest } = data;
        const filesAreDifferent = (currentFile?.name !== originalFile?.name) || (!!currentFile !== !!originalFile);
        const restIsDifferent = JSON.stringify(currentRest) !== JSON.stringify(originalRest);
        setIsDirty(filesAreDifferent || restIsDifferent);
    }, [formData, data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData({ ...formData, reportFile: file, reportFileSummary: file ? undefined : data.reportFileSummary });
    };
    const handleSave = () => { onSave(formData); setIsDirty(false); };
    const handleCancel = () => { setFormData(data); setIsDirty(false); };

    return (
        <div>
            <SectionTitle>التشخيص الطبي</SectionTitle>
            <div className="space-y-6">
                <div>
                    <label htmlFor="primaryDiagnosis" className="block text-sm font-medium text-slate-700 mb-1">التشخيص الأساسي</label>
                    <select id="primaryDiagnosis" name="primaryDiagnosis" value={formData.primaryDiagnosis} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition bg-white">
                        <option value="">اختر التشخيص</option>
                        {DIAGNOSIS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <InputField label="التشخيصات الفرعية" name="secondaryDiagnoses" value={formData.secondaryDiagnoses} onChange={handleChange} />
                <InputField label="تاريخ التشخيص" name="diagnosisDate" value={formData.diagnosisDate} onChange={handleChange} type="date" />
                <InputField label="الجهة المشخِّصة" name="diagnosingEntity" value={formData.diagnosingEntity} onChange={handleChange} />
                <div>
                    <label htmlFor="reportFile" className="block text-sm font-medium text-slate-700 mb-1">رفع تقرير طبي (PDF / صورة)</label>
                    <input type="file" id="reportFile" name="reportFile" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"/>
                    {formData.reportFile && <p className="text-sm text-slate-600 mt-2">الملف المحدد: {formData.reportFile.name}</p>}
                    {formData.reportFileSummary && <div className="mt-4 p-3 bg-slate-100 rounded-lg"><p className="text-sm font-bold">ملخص التقرير:</p><p className="text-sm text-slate-700">{formData.reportFileSummary}</p></div>}
                </div>
            </div>
            <FormActions onCancel={handleCancel} onSave={handleSave} isDirty={isDirty} />
        </div>
    );
};

const CaseStudyForm: React.FC<{data: CaseStudy, onSave: (data: CaseStudy) => void}> = ({data, onSave}) => {
    const [formData, setFormData] = useState(data);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => { setFormData(data); setIsDirty(false); }, [data]);
    useEffect(() => { setIsDirty(JSON.stringify(data) !== JSON.stringify(formData)); }, [formData, data]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSave = () => { onSave(formData); setIsDirty(false); };
    const handleCancel = () => { setFormData(data); setIsDirty(false); };

    return (
        <div>
            <SectionTitle>دراسة الحالة (نص مفتوح)</SectionTitle>
            <div className="space-y-4">
                <TextAreaField label="التاريخ الطبي" name="medicalHistory" value={formData.medicalHistory} onChange={handleChange} />
                <TextAreaField label="التاريخ التطوري" name="developmentalHistory" value={formData.developmentalHistory} onChange={handleChange} />
                <TextAreaField label="الوضع الأسري" name="familySituation" value={formData.familySituation} onChange={handleChange} />
                <TextAreaField label="نقاط القوة" name="strengths" value={formData.strengths} onChange={handleChange} />
                <TextAreaField label="التحديات" name="challenges" value={formData.challenges} onChange={handleChange} />
                <TextAreaField label="السلوكيات البارزة" name="prominentBehaviors" value={formData.prominentBehaviors} onChange={handleChange} />
                <TextAreaField label="الاهتمامات والمحفزات" name="interestsAndMotivators" value={formData.interestsAndMotivators} onChange={handleChange} />
            </div>
            <FormActions onCancel={handleCancel} onSave={handleSave} isDirty={isDirty} />
        </div>
    );
};

const AssessmentForm: React.FC<{data: Student['assessments'], onSave: (data: Student['assessments']) => void}> = ({data, onSave}) => {
    const [formData, setFormData] = useState(data);
    const [isDirty, setIsDirty] = useState(false);
    
    useEffect(() => { setFormData(data); setIsDirty(false); }, [data]);
    useEffect(() => { setIsDirty(JSON.stringify(data) !== JSON.stringify(formData)); }, [formData, data]);
    
    const handleChange = (area: keyof typeof ASSESSMENT_AREAS, field: keyof AssessmentArea, value: string | number) => {
        setFormData(prev => ({ ...prev, [area]: { ...prev[area], [field]: value } }));
    };
    const handleSave = () => { onSave(formData); setIsDirty(false); };
    const handleCancel = () => { setFormData(data); setIsDirty(false); };

    return (
        <div>
            <SectionTitle>التقييم الشامل</SectionTitle>
            <div className="space-y-6">
                {Object.entries(ASSESSMENT_AREAS).map(([key, label]) => (
                    <div key={key} className="p-4 border border-slate-200 rounded-lg">
                        <h4 className="font-bold text-slate-700 mb-2">{label}</h4>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm text-slate-600">المستوى (1=ضعيف, 5=ممتاز)</label>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="range" 
                                        min="1" 
                                        max="5" 
                                        value={formData[key as keyof typeof ASSESSMENT_AREAS].level} 
                                        onChange={(e) => handleChange(key as keyof typeof ASSESSMENT_AREAS, 'level', parseInt(e.target.value))} 
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                                    />
                                    <span className="font-bold text-teal-600 w-4 text-center">{formData[key as keyof typeof ASSESSMENT_AREAS].level}</span>
                                </div>
                            </div>
                            <TextAreaField 
                                label="ملاحظات" 
                                name={`${key}-notes`}
                                value={formData[key as keyof typeof ASSESSMENT_AREAS].notes} 
                                onChange={(e) => handleChange(key as keyof typeof ASSESSMENT_AREAS, 'notes', e.target.value)}
                                rows={2}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <FormActions onCancel={handleCancel} onSave={handleSave} isDirty={isDirty} />
        </div>
    );
};

const SessionsForm: React.FC<{
    sessionLogs: SessionLog[], 
    upcomingSessions: UpcomingSession[], 
    onSave: (logs: SessionLog[], sessions: UpcomingSession[]) => void 
}> = ({ sessionLogs, upcomingSessions, onSave }) => {
    const [logs, setLogs] = useState(sessionLogs);
    const [sessions, setSessions] = useState(upcomingSessions);
    const [isDirty, setIsDirty] = useState(false);

    const [newLogNotes, setNewLogNotes] = useState('');
    const [newLogDate, setNewLogDate] = useState(new Date().toISOString().split('T')[0]);
    const [newLogTime, setNewLogTime] = useState(new Date().toTimeString().slice(0, 5));
    const [newLogDuration, setNewLogDuration] = useState(45);

    const [newSessionDate, setNewSessionDate] = useState('');
    const [newSessionTime, setNewSessionTime] = useState('');
    const [newSessionDuration, setNewSessionDuration] = useState(45);

    useEffect(() => {
        setLogs(sessionLogs);
        setSessions(upcomingSessions);
        setIsDirty(false);
    }, [sessionLogs, upcomingSessions]);

    useEffect(() => {
        const originalData = JSON.stringify({ logs: sessionLogs, sessions: upcomingSessions });
        const currentData = JSON.stringify({ logs, sessions });
        setIsDirty(originalData !== currentData);
    }, [logs, sessions, sessionLogs, upcomingSessions]);

    const handleAddLog = () => {
        if (!newLogNotes.trim() || !newLogDate || !newLogTime) return;
        const newLog: SessionLog = {
            id: `log-${Date.now()}`,
            date: newLogDate,
            time: newLogTime,
            duration: newLogDuration,
            notes: newLogNotes
        };
        setLogs(prev => [newLog, ...prev].sort((a, b) => new Date(`${b.date}T${b.time || '00:00'}`).getTime() - new Date(`${a.date}T${a.time || '00:00'}`).getTime()));
        setNewLogNotes('');
    };

    const handleDeleteLog = (id: string) => {
        setLogs(prev => prev.filter(log => log.id !== id));
    };

    const handleAddSession = () => {
        if (!newSessionDate || !newSessionTime) return;
        const newSession: UpcomingSession = {
            id: `session-${Date.now()}`,
            date: newSessionDate,
            time: newSessionTime,
            duration: newSessionDuration,
        };
        setSessions(prev => [...prev, newSession].sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()));
        setNewSessionDate('');
        setNewSessionTime('');
    };

    const handleDeleteSession = (id: string) => {
        setSessions(prev => prev.filter(session => session.id !== id));
    };

    const handleSave = () => {
        onSave(logs, sessions);
        setIsDirty(false);
    };

    const handleCancel = () => {
        setLogs(sessionLogs);
        setSessions(upcomingSessions);
        setIsDirty(false);
    };

    return (
        <div>
            <SectionTitle>تقويم الجلسات الذكي</SectionTitle>
            
            <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-bold text-slate-800 mb-3">إضافة جلسة مكتملة للسجل</h4>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <InputField label="تاريخ الجلسة" name="newLogDate" value={newLogDate} onChange={e => setNewLogDate(e.target.value)} type="date" />
                        <InputField label="وقت البدء" name="newLogTime" value={newLogTime} onChange={e => setNewLogTime(e.target.value)} type="time" />
                        <div>
                             <label htmlFor="newLogDuration" className="block text-sm font-medium text-slate-700 mb-1">مدة الجلسة (بالدقائق)</label>
                             <input type="number" id="newLogDuration" name="newLogDuration" value={newLogDuration} onChange={e => setNewLogDuration(parseInt(e.target.value) || 0)} min="1" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"/>
                        </div>
                    </div>
                    <TextAreaField label="ملخص الجلسة والمهارات المستهدفة" name="newLogNotes" value={newLogNotes} onChange={e => setNewLogNotes(e.target.value)} rows={3} />
                    <div className="text-right">
                        <button onClick={handleAddLog} className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors">
                            + إضافة للسجل
                        </button>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                 <h4 className="font-bold text-slate-800 mb-3">سجل الجلسات السابقة</h4>
                 <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {logs.length > 0 ? logs.map(log => (
                        <div key={log.id} className="p-3 bg-white border border-slate-200 rounded-lg flex justify-between items-start">
                           <div>
                                <p className="font-bold text-teal-700">{new Date(log.date).toLocaleDateString('ar-SA', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                {log.time && log.duration > 0 && (
                                    <p className="text-sm text-slate-500">
                                        الوقت: {new Date(`1970-01-01T${log.time}`).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })} | المدة: {log.duration} دقيقة
                                    </p>
                                )}
                                <p className="text-slate-600 whitespace-pre-wrap mt-1">{log.notes}</p>
                           </div>
                           <button onClick={() => handleDeleteLog(log.id)} className="text-red-500 hover:text-red-700 text-sm flex-shrink-0 ml-4">حذف</button>
                        </div>
                    )) : <p className="text-slate-500 text-center py-4">لا توجد جلسات مسجلة.</p>}
                 </div>
            </div>

            <hr className="my-8" />

            <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-bold text-slate-800 mb-3">جدولة جلسة قادمة</h4>
                <div className="flex flex-col sm:flex-row items-end gap-4">
                    <div className="w-full sm:flex-1"><InputField label="تاريخ الجلسة" name="newSessionDate" value={newSessionDate} onChange={e => setNewSessionDate(e.target.value)} type="date" /></div>
                    <div className="w-full sm:flex-1"><InputField label="وقت الجلسة" name="newSessionTime" value={newSessionTime} onChange={e => setNewSessionTime(e.target.value)} type="time" /></div>
                    <div className="w-full sm:w-40">
                        <label htmlFor="newSessionDuration" className="block text-sm font-medium text-slate-700 mb-1">المدة (بالدقائق)</label>
                         <input type="number" id="newSessionDuration" name="newSessionDuration" value={newSessionDuration} onChange={e => setNewSessionDuration(parseInt(e.target.value) || 0)} min="1" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"/>
                    </div>
                    <button onClick={handleAddSession} className="w-full sm:w-auto px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors self-end h-[42px]">
                        + تحديد موعد
                    </button>
                </div>
            </div>

             <div className="mb-8">
                 <h4 className="font-bold text-slate-800 mb-3">الجلسات القادمة المجدولة</h4>
                 <div className="space-y-3">
                    {sessions.length > 0 ? sessions.map(session => (
                        <div key={session.id} className="p-3 bg-white border border-slate-200 rounded-lg flex justify-between items-center">
                           <div>
                                <p className="font-bold text-teal-700">{new Date(session.date).toLocaleDateString('ar-SA', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                <p className="text-slate-600">
                                    الوقت: {new Date(`1970-01-01T${session.time}`).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                                    {session.duration > 0 && ` | المدة: ${session.duration} دقيقة`}
                                </p>
                           </div>
                           <button onClick={() => handleDeleteSession(session.id)} className="text-red-500 hover:text-red-700 text-sm">حذف</button>
                        </div>
                    )) : <p className="text-slate-500 text-center py-4">لا توجد جلسات قادمة مجدولة.</p>}
                 </div>
            </div>

            <FormActions onCancel={handleCancel} onSave={handleSave} isDirty={isDirty} />
        </div>
    );
};

const AchievedGoalsForm: React.FC<{
    achievedGoals: AchievedGoal[],
    onSave: (goals: AchievedGoal[]) => void
}> = ({ achievedGoals, onSave }) => {
    const [goals, setGoals] = useState(achievedGoals);
    const [isDirty, setIsDirty] = useState(false);

    const [newGoalDescription, setNewGoalDescription] = useState('');
    const [newGoalType, setNewGoalType] = useState(GOAL_TYPES[0]);
    const [newMasteryLevel, setNewMasteryLevel] = useState(MASTERY_LEVELS[0]);

    useEffect(() => {
        setGoals(achievedGoals);
        setIsDirty(false);
    }, [achievedGoals]);

    useEffect(() => {
        setIsDirty(JSON.stringify(achievedGoals) !== JSON.stringify(goals));
    }, [goals, achievedGoals]);

    const handleAddGoal = () => {
        if (!newGoalDescription.trim()) return;
        const newGoal: AchievedGoal = {
            id: `goal-${Date.now()}`,
            description: newGoalDescription,
            achievedAt: new Date().toISOString(),
            goalType: newGoalType,
            masteryLevel: newMasteryLevel,
        };
        setGoals(prev => [newGoal, ...prev].sort((a, b) => new Date(b.achievedAt).getTime() - new Date(a.achievedAt).getTime()));
        setNewGoalDescription('');
    };

    const handleSave = () => {
        onSave(goals);
        setIsDirty(false);
    };

    const handleCancel = () => {
        setGoals(achievedGoals);
        setIsDirty(false);
    };

    return (
        <div>
            <SectionTitle>سجل الأهداف المحققة</SectionTitle>
             <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-bold text-slate-800 mb-3">إضافة هدف تم تحقيقه</h4>
                <div className="space-y-4">
                    <TextAreaField label="وصف الهدف المحقق" name="newGoalDescription" value={newGoalDescription} onChange={e => setNewGoalDescription(e.target.value)} rows={3} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <SelectField label="نوع الهدف" name="newGoalType" value={newGoalType} onChange={e => setNewGoalType(e.target.value)} options={GOAL_TYPES} />
                        <SelectField label="مستوى الإتقان" name="newMasteryLevel" value={newMasteryLevel} onChange={e => setNewMasteryLevel(e.target.value)} options={MASTERY_LEVELS} />
                    </div>
                    <div className="text-right">
                        <button onClick={handleAddGoal} className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors">
                           + إضافة للسجل
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <h4 className="font-bold text-slate-800 mb-3">قائمة الأهداف المنجزة (غير قابلة للحذف)</h4>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {goals.length > 0 ? goals.map(goal => (
                        <div key={goal.id} className="p-4 bg-white border border-slate-200 rounded-lg">
                            <p className="text-slate-800 font-medium">{goal.description}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                                <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">{goal.goalType}</span>
                                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">الإتقان: {goal.masteryLevel}</span>
                                <span>{new Date(goal.achievedAt).toLocaleString('ar-SA', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                            </div>
                        </div>
                    )) : <p className="text-slate-500 text-center py-4">لا توجد أهداف محققة مسجلة بعد.</p>}
                </div>
            </div>

            <FormActions onCancel={handleCancel} onSave={handleSave} isDirty={isDirty} />
        </div>
    );
};


export default StudentProfile;