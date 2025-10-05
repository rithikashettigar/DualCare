# **App Name**: DualCare Connect

## Core Features:

- User Registration: Caregivers can register and manage users under their care using Firebase Authentication and Firestore.
- Medicine Schedule Management: Input and manage medicine schedules (name, dosage, time) with notifications for caregivers when medicine is missed. Store data in Firestore.
- Daily Task Management: Create and manage daily tasks/routines (exercise, meals, rest) for users. Store tasks and completion status in Firestore.
- Emergency Contacts: Maintain a list of emergency contacts accessible in User Mode.
- SOS Alert System: User can trigger an SOS alert that sends a notification to the caregiver's dashboard, and logs the alert in Firestore.
- Activity Dashboard: Caregiver dashboard displaying real-time updates on user activity (medicines taken/missed, tasks completed, mood logs) visualized using graphs.  Caregivers can generate reports and export them as PDFs.
- Multilingual Support: Supports English, Hindi, and Kannada, automatically setting the preferred language based on the user’s profile and allows the user to modify this setting.

## Style Guidelines:

- Background color: Light, desaturated blue (#EBF4FF) to provide a calm and soothing environment for both caregivers and users.
- Primary color: Muted teal (#45A0A2) for a sense of trustworthiness and tranquility. The subdued tone ensures readability and reduces visual fatigue.
- Accent color: Soft peach (#FFDAB9) used sparingly for interactive elements like buttons and alerts to draw attention without overwhelming the user. Its warmth contrasts effectively with the primary color.
- Headline font: 'PT Sans' (sans-serif) for headlines; body font: 'Inter' (sans-serif) for body. 'Inter' is selected for its modern, machined look; PT Sans will give a warm tone to headlines.
- Note: currently only Google Fonts are supported.
- Use simple, high-contrast icons for easy recognition, especially in User Mode. Icons should be large and clearly represent their functions.
- The user interface must follow a card-based layout with adequate spacing. Large buttons, especially in User Mode (minimum 44x44 px). Prioritize key actions like “Take” or “Done”. Ensure keyboard navigability.
- Subtle animations for feedback (e.g., button press, task completion) should be applied. Use smooth transitions for navigation to reduce cognitive load.