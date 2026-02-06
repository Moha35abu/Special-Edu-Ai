
import React from 'react';
import type { Student } from '../types';

interface StudentCardProps {
  student: Student;
  onSelect: () => void;
  onDelete: (studentId: string) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onSelect, onDelete }) => {
  const getAge = (dob: string) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card's onSelect from firing
    onDelete(student.id);
  };

  return (
    <div
      onClick={onSelect}
      className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-transparent hover:border-teal-500"
    >
      <button
        onClick={handleDeleteClick}
        className="absolute top-2 left-2 w-7 h-7 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 z-10"
        aria-label={`حذف ${student.personalInfo.fullName}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex flex-col items-center p-6">
        <img
          className="w-24 h-24 rounded-full object-cover mb-4 ring-2 ring-offset-2 ring-teal-200"
          src={student.personalInfo.photoUrl}
          alt={student.personalInfo.fullName}
        />
        <h3 className="text-lg font-bold text-slate-800">{student.personalInfo.fullName}</h3>
        <p className="text-sm text-slate-500">{student.medicalDiagnosis.primaryDiagnosis}</p>
        <div className="mt-4 text-sm text-slate-600 flex flex-col items-center gap-1">
          <span>العمر: {getAge(student.personalInfo.dob)} سنوات</span>
          <span>الصف: {student.personalInfo.grade}</span>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
