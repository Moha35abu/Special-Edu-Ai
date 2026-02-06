import React, { useState, useEffect } from "react";
import type { Student } from "./types";
import StudentCard from "./components/StudentCard";
import StudentProfile from "./components/StudentProfile";
import { LogoIcon } from "./components/Icons";

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const savedStudents = window.localStorage.getItem("students");
      if (savedStudents) {
        console.log("Loaded students from localStorage:", savedStudents);
        return JSON.parse(savedStudents);
      }
    } catch (error) {
      console.error("Error reading students from localStorage", error);
    }
    return [];
  });

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem("students", JSON.stringify(students));
    } catch (error) {
      console.error("Error saving students to localStorage", error);
    }
  }, [students]);

  const handleSelectStudent = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    setSelectedStudent(student || null);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prevStudents) =>
      prevStudents.map((s) =>
        s.id === updatedStudent.id ? updatedStudent : s,
      ),
    );
    setSelectedStudent(updatedStudent);
  };

  const handleDeleteStudent = (studentId: string) => {
    if (
      window.confirm(
        "هل أنت متأكد من رغبتك في حذف ملف هذا الطالب؟ لا يمكن التراجع عن هذا الإجراء.",
      )
    ) {
      setStudents((prevStudents) =>
        prevStudents.filter((s) => s.id !== studentId),
      );
      if (selectedStudent && selectedStudent.id === studentId) {
        setSelectedStudent(null);
      }
      alert("تم حذف الطالب بنجاح.");
    }
  };

  const handleBack = () => {
    setSelectedStudent(null);
  };

  const handleAddNewStudent = () => {
    const newStudent: Student = {
      id: `student-${Date.now()}`,
      personalInfo: {
        fullName: "طالب جديد",
        studentId: "",
        dob: "",
        grade: "",
        photoUrl: `https://picsum.photos/seed/${Date.now()}/200`,
        parentContact: "",
        enrollmentDate: new Date().toISOString().split("T")[0],
      },
      medicalDiagnosis: {
        primaryDiagnosis: "",
        secondaryDiagnoses: "",
        reportFile: null,
        diagnosisDate: "",
        diagnosingEntity: "",
      },
      caseStudy: {
        medicalHistory: "",
        developmentalHistory: "",
        familySituation: "",
        strengths: "",
        challenges: "",
        prominentBehaviors: "",
        interestsAndMotivators: "",
      },
      assessments: {
        academicSkills: { level: 1, notes: "" },
        languageAndCommunication: { level: 1, notes: "" },
        sensoryAndCognitiveSkills: { level: 1, notes: "" },
        socialSkills: { level: 1, notes: "" },
        behaviorAndSelfRegulation: { level: 1, notes: "" },
        motorSkills: { level: 1, notes: "" },
      },
      planHistory: [],
      chatHistory: [],
      sessionLogs: [],
      upcomingSessions: [],
      achievedGoals: [],
    };
    setStudents((prev) => [...prev, newStudent]);
    setSelectedStudent(newStudent);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <LogoIcon className="w-10 h-10 text-teal-600" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-teal-700">
                مساعد المعلم الذكي
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                | مدرسة الإيمان
              </p>
            </div>
          </div>
          {selectedStudent && (
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              → العودة للوحة التحكم
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {!selectedStudent ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-700">
                ملفات الطلبة
              </h2>
              <button
                onClick={handleAddNewStudent}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 flex items-center gap-2"
              >
                <span>+</span>
                <span>إضافة طالب جديد</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {students.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onSelect={() => handleSelectStudent(student.id)}
                  onDelete={handleDeleteStudent}
                />
              ))}
            </div>
          </div>
        ) : (
          <StudentProfile
            student={selectedStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        )}
      </main>
      <footer className="w-full text-center py-4 bg-white border-t border-slate-200">
        <p className="text-xs text-slate-500">
          هذا التطبيق مخصص للاستخدام الداخلي في مدرسة الإيمان
        </p>
      </footer>
    </div>
  );
};

export default App;
