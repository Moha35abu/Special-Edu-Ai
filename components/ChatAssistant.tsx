
import React, { useState, useRef, useEffect } from 'react';
import type { Student, ChatMessage, GeneratedPlan } from '../types';
import { getChatResponse } from '../services/geminiService';
import { UserIcon, BrainIcon } from './Icons';

// Make TypeScript aware of the 'marked' library from the global scope
declare global {
  interface Window {
    marked: {
      parse: (markdown: string) => string;
    };
  }
}

interface ChatAssistantProps {
  student: Student;
  onUpdateStudent: (student: Student) => void;
}

const Spinner: React.FC = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-500"></div>
);

const ChatAssistant: React.FC<ChatAssistantProps> = ({ student, onUpdateStudent }) => {
    const [messages, setMessages] = useState<ChatMessage[]>(student.chatHistory);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    useEffect(() => {
        setMessages(student.chatHistory);
    }, [student.chatHistory]);

    const handleSendMessage = async (messageContent?: string) => {
        const content = messageContent || input;
        if (!content.trim() || isLoading) return;

        const newUserMessage: ChatMessage = { role: 'user', content };
        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const responseContent = await getChatResponse(student, updatedMessages, content);
            const newModelMessage: ChatMessage = { role: 'model', content: responseContent };
            
            const finalMessages = [...updatedMessages, newModelMessage];
            setMessages(finalMessages);
            onUpdateStudent({ ...student, chatHistory: finalMessages });

        } catch (err) {
            console.error(err);
            setError('عذرًا، حدث خطأ أثناء التواصل مع المساعد الذكي. يرجى المحاولة مرة أخرى.');
            // Revert user message on error if needed, or show error message
        } finally {
            setIsLoading(false);
        }
    };

    const handleSavePlan = (planContent: string) => {
        const newPlan: GeneratedPlan = {
            content: planContent,
            createdAt: new Date().toISOString(),
        };
        const updatedStudent = {
            ...student,
            planHistory: [...student.planHistory, newPlan],
        };
        onUpdateStudent(updatedStudent);
    };

    const QuickPrompts = [
        "اقترح خطة تعليمية فردية جديدة",
        "اكتب تقريرًا شهريًا للأهل",
        "اقترح 3 أنشطة لتنمية المهارات الاجتماعية",
        "لخص تقدم الطالب بناءً على بياناته",
    ];

    const isPlan = (content: string) => content.includes("### الخطة التعليمية الفردية (IEP)");

    return (
        <div className="flex flex-col h-[70vh] bg-white border border-slate-200 rounded-lg">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && <div className="p-2 bg-teal-500 rounded-full text-white"><BrainIcon className="w-6 h-6" /></div>}
                        
                        <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-sky-100 text-sky-900' : 'bg-slate-100 text-slate-800'}`}>
                            {msg.role === 'model' && window.marked ? (
                                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: window.marked.parse(msg.content) }} />
                            ) : (
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                            )}

                            {msg.role === 'model' && isPlan(msg.content) && (
                                <button
                                    onClick={() => handleSavePlan(msg.content)}
                                    className="mt-4 px-3 py-1 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    ✓ اعتماد وحفظ الخطة
                                </button>
                            )}
                        </div>

                        {msg.role === 'user' && <div className="p-2 bg-sky-500 rounded-full text-white"><UserIcon className="w-6 h-6" /></div>}
                    </div>
                ))}
                 <div ref={messagesEndRef} />
            </div>

            {isLoading && <div className="p-4 flex justify-center items-center gap-2 text-slate-500"><Spinner /><span>المساعد الذكي يكتب...</span></div>}
            {error && <div className="p-4 text-center text-red-600 bg-red-100 border-t border-red-200">{error}</div>}

            <div className="p-4 border-t border-slate-200 bg-slate-50">
                 <div className="flex flex-wrap gap-2 mb-3">
                    {QuickPrompts.map(prompt => (
                        <button key={prompt} onClick={() => handleSendMessage(prompt)} disabled={isLoading} className="px-3 py-1 text-sm bg-teal-100 text-teal-800 rounded-full hover:bg-teal-200 disabled:opacity-50 transition">
                            {prompt}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                        placeholder="اسأل المساعد الذكي..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition resize-none"
                        rows={2}
                        disabled={isLoading}
                    />
                    <button onClick={() => handleSendMessage()} disabled={isLoading} className="px-4 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 disabled:bg-slate-400">
                        إرسال
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatAssistant;
