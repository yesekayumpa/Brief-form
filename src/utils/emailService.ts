export interface EmailData {
  formData: any;
  userName: string;
  userEmail: string;
}

export const sendBriefEmail = async (emailData: EmailData): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch('http://localhost:3001/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Erreur lors de l\'envoi de l\'email');
    }

    return result;
  } catch (error) {
    console.error('Erreur service email:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};
