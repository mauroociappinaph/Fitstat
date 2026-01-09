# FitStat AI

**FitStat AI** acts as the "Elite Health Architect" & Oracle for the Atlas Load protocol. It is a comprehensive health engineering platform powered by **Google Gemini** to analyze biometric data, track nutrition, and optimize training performance through intelligent, data-driven coaching.

## 🚀 Key Features

*   **AI-Powered Coaching**: Utilizes Google Gemini to provide personalized daily audits, nutritional feedback, and training insights with a "Health Architect" persona.
*   **Comprehensive Tracking**: Log and visualize Daily Biometrics, Nutrition (Macros), Strength Training, and Cardio Sessions.
*   **Data Visualization**: Interactive charts for metabolic balance, biometric trends, and performance metrics using `Recharts`.
*   **Protocol Management**: Tracks adherence to the "Master Plan" phases and daily routines.
*   **Modern Tech Stack**: Built with React, Vite, and specific architectural choices for performance and scalability.

## 🛠 Tech Stack

*   **Frontend**: React, TypeScript, Vite
*   **State Management**: Zustand
*   **Styling**: TailwindCSS
*   **AI Integration**: Google GenAI SDK (`@google/genai`)
*   **Backend / Persistence**: Supabase
*   **Testing**: Vitest, React Testing Library
*   **Quality**: ESLint, Prettier

## 📦 Getting Started

### Prerequisites
*   **Node.js**: v18.0.0+
*   **NPM**: Package manager
*   **Supabase**: Project credentials
*   **Gemini API Key**: Required for AI features

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd Fitstat
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory with your keys:
    ```env
    VITE_GEMINI_API_KEY=your_gemini_api_key
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run Locally**
    Start the development server:
    ```bash
    npm run dev
    ```

## 💻 Development Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start local development server |
| `npm run build` | Build the project for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check for code quality issues |
| `npm run test` | Run Test suite with Vitest |

## 📂 Project Structure

*   `src/backend`: Core logic, AI services (`/ai`), and data persistence (`/services`).
*   `src/frontend`: UI components (`/components`), hooks (`/hooks`), and stores (`/stores`).
*   `src/shared`: Shared types, constants, and utility functions.
*   `database`: SQL schemas for Supabase setup.

---

*FitStat AI - Health Engineering Protocol*
