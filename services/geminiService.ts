
import { GoogleGenAI } from "@google/genai";
import type { Student, ChatMessage, SessionLog } from "../types";
import { CHAT_ASSISTANT_SYSTEM_PROMPT, REPORT_GENERATOR_SYSTEM_PROMPT } from "../prompts";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-3-flash-preview';

const fileToGenerativePart = async (file: File) => {
    const base64EncodedData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    return {
        inlineData: {
            data: base64EncodedData,
            mimeType: file.type,
        },
    };
};

export const getChatResponse = async (student: Student, chatHistory: ChatMessage[], userMessage: string): Promise<string> => {
    try {
        const studentDataForPrompt = JSON.parse(JSON.stringify(student));
        // Sanitize large or irrelevant data for the prompt
        delete studentDataForPrompt.chatHistory;
        studentDataForPrompt.personalInfo.photoUrl = undefined;
        if(studentDataForPrompt.medicalDiagnosis.reportFile) {
            studentDataForPrompt.medicalDiagnosis.reportFile = `[تم رفع ملف باسم: ${student.medicalDiagnosis.reportFile.name}]`;
        }
        
        // Take the last 2 plans for context to enforce non-repetition rule
        const recentPlans = student.planHistory.slice(-2).map((plan, index) => 
            `### الخطة السابقة ${index + 1} (${new Date(plan.createdAt).toLocaleDateString('ar-SA')})\n\n${plan.content}`
        ).join('\n\n---\n\n');

        const achievedGoalsSummary = student.achievedGoals.map(g => 
            `- ${g.description} (النوع: ${g.goalType}, الإتقان: ${g.masteryLevel}, التاريخ: ${new Date(g.achievedAt).toLocaleDateString('ar-SA')})`
        ).join('\n');

        const contextPrompt = `
${CHAT_ASSISTANT_SYSTEM_PROMPT}

## سياق الطالب الحالي

### بيانات الطالب
\`\`\`json
${JSON.stringify(studentDataForPrompt, null, 2)}
\`\`\`

### سجل الأهداف التي تم تحقيقها (للإطلاع ومنع التكرار)
${achievedGoalsSummary || "لا توجد أهداف محققة مسجلة بعد."}


### ملخص آخر خطتين (إن وجد)
${recentPlans || "لا توجد خطط سابقة."}
        `;

        // The entire history is not sent, only a summary. This can be improved.
        // For now, we will send the last few messages for conversation context.
        const conversationContext = chatHistory.slice(-6).map(msg => `${msg.role}: ${msg.content}`).join('\n');
        
        const fullPrompt = `${contextPrompt}\n\n## المحادثة الحالية\n\n${conversationContext}\nuser: ${userMessage}\nmodel: `;

        const response = await ai.models.generateContent({
            model,
            contents: fullPrompt
        });

        if (response.text) {
            return response.text;
        } else {
            throw new Error("No text response from Gemini API.");
        }

    } catch (error) {
        console.error("Error getting chat response from Gemini:", error);
        throw new Error("Failed to get chat response.");
    }
};


export const generateReport = async (student: Student, logs: SessionLog[], startDate: string, endDate: string): Promise<string> => {
    try {
        const studentName = student.personalInfo.fullName;
        const formattedStartDate = new Date(startDate).toLocaleDateString('ar-SA');
        const formattedEndDate = new Date(endDate).toLocaleDateString('ar-SA');
        
        const logsForPrompt = logs.map(log => ({
            date: log.date,
            duration: log.duration,
            notes: log.notes
        }));

        const prompt = `
${REPORT_GENERATOR_SYSTEM_PROMPT.replace(/\$\{studentName\}/g, studentName)}

## بيانات الطالب
- **الاسم:** ${studentName}

## سجل الجلسات للفترة المحددة
\`\`\`json
${JSON.stringify(logsForPrompt, null, 2)}
\`\`\`

## المطلوب
بناءً على السجل أعلاه فقط، قم بكتابة "تقرير التقدم" لولي الأمر عن الفترة من ${formattedStartDate} إلى ${formattedEndDate}.
`;

        const response = await ai.models.generateContent({
            model,
            contents: prompt
        });

        if (response.text) {
            const header = `### **مدرسة الإيمان**\n\n**تقرير التقدم للطالب/ة:** ${studentName}\n**عن الفترة من:** ${formattedStartDate} **إلى:** ${formattedEndDate}\n\n---\n\n`;
            return header + response.text;
        } else {
            throw new Error("No text response from Gemini API for report generation.");
        }

    } catch (error) {
        console.error("Error generating report from Gemini:", error);
        throw new Error("Failed to generate report.");
    }
};