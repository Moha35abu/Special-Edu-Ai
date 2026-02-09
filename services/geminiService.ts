import type { Student, ChatMessage, SessionLog } from "../types";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://special-edu-api-key.vercel.app";

// Keep the file helper if you need it for frontend processing
export const fileToGenerativePart = async (file: File) => {
  const base64EncodedData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
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

export const getChatResponse = async (
  student: Student,
  chatHistory: ChatMessage[],
  userMessage: string,
  file?: File, // Optional file parameter
): Promise<string> => {
  try {
    // Prepare file data if provided
    let fileData = null;
    if (file) {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      fileData = {
        base64,
        type: file.type,
        name: file.name,
      };
    }

    const response = await fetch(`${BACKEND_URL}/api/v1/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student,
        chatHistory,
        userMessage,
        fileData,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (data.success) {
      return data.text;
    } else {
      throw new Error(data.error || "Backend returned unsuccessful response");
    }
  } catch (error) {
    console.error("Error getting chat response from backend:", error);

    // User-friendly error messages
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Cannot connect to the server. Please check your internet connection and try again.",
      );
    }

    throw new Error("Failed to get chat response. Please try again later.");
  }
};

export const generateReport = async (
  student: Student,
  logs: SessionLog[],
  startDate: string,
  endDate: string,
): Promise<string> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/generate-report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student,
        logs,
        startDate,
        endDate,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (data.success) {
      return data.text;
    } else {
      throw new Error(data.error || "Backend returned unsuccessful response");
    }
  } catch (error) {
    console.error("Error generating report from backend:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Cannot connect to the server. Please check your internet connection and try again.",
      );
    }

    throw new Error("Failed to generate report. Please try again later.");
  }
};

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/health`);
    if (response.ok) {
      const data = await response.json();
      return data.status === "healthy";
    }
    return false;
  } catch {
    return false;
  }
};
