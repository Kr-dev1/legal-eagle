## Project Description

Legal Hawk is an AI-powered contract analysis application designed to help users understand complex legal documents. Users can securely upload their contracts in PDF format, and the application provides an intuitive chat interface to ask questions and receive clear, context-aware answers based on the document's content. The system leverages advanced AI models and vector embeddings to deliver precise and relevant information.

## Key Features

Based on the provided code, the following key features have been implemented:

*   **User Authentication**:
    *   Secure sign-up and sign-in with email and password.
    *   Password reset functionality with email verification.
    *   Social login option via Google OAuth.
    *   Client-side and server-side session management to protect routes.

*   **PDF Contract Upload**:
    *   Drag-and-drop file uploader for PDF documents (max 32MB).
    *   Users can specify their country and the organization's country to provide relevant legal context during analysis.
    *   Secure file handling and storage managed by UploadThing.

*   **AI-Powered Chat Interface**:
    *   An interactive chat screen where users can ask questions about their uploaded contract.
    *   Real-time, streaming responses from the AI for a better user experience.
    *   Chat history is saved and displayed for each contract.

*   **Intelligent Document Analysis (RAG)**:
    *   The system processes uploaded PDFs by extracting text, splitting it into chunks, and generating vector embeddings using Google's embedding models.
    *   Utilizes a PostgreSQL database with the `pgvector` extension to perform efficient similarity searches, ensuring answers are highly relevant to the user's query and the contract's content.
    *   Integrates with both Groq (Llama 3.1) and Google Gemini for generating answers, with a fallback mechanism for robustness.

*   **Dynamic User Interface**:
    *   A responsive layout featuring a collapsible sidebar for easy navigation between multiple contracts.
    *   Modern UI components built with Shadcn/UI, Tailwind CSS, and Lucide Icons.
    *   Includes custom animations, such as a "fuzzy text" effect used on the 404 page.

## Technologies and Dependencies

*   **Framework**: Next.js (App Router)
*   **Language**: TypeScript
*   **Database**: PostgreSQL with Prisma ORM
*   **Vector Store**: pgvector
*   **Authentication**: `better-auth`
*   **File Uploads**: UploadThing
*   **AI & LLMs**:
    *   Vercel AI SDK (`@ai-sdk/rsc`)
    *   Groq API (Llama 3.1)
    *   Google Gemini API
*   **Document Processing**: LangChain (for text splitting and PDF loading)
*   **UI & Styling**:
    *   Tailwind CSS
    *   Shadcn/UI
    *   Lucide React (Icons)
    *   Sonner (Toast notifications)
    *   `@uiw/react-md-editor` (for rendering Markdown in chat)
*   **Data Fetching**: TanStack Query (`@tanstack/react-query`)
*   **Emailing**: Nodemailer

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    The project uses `bun` as the package manager.
    ```bash
    bun install
    ```

3.  **Set up the database:**
    *   Ensure you have a PostgreSQL instance running with the `pgvector` extension enabled.
    *   Create a `.env` file by copying the `.env.example` file.
    *   Update the `DATABASE_URL` in your `.env` file with your PostgreSQL connection string.

4.  **Configure Environment Variables:**
    Fill in the required API keys and credentials in your `.env` file for the following services:
    *   `DATABASE_URL`
    *   `GOOGLE_CLIENT_ID`
    *   `GOOGLE_CLIENT_SECRET`
    *   `GEMINI_API_KEY`
    *   `GROQ_API_KEY`
    *   `NODEMAILER_EMAIL` (and other Nodemailer/Gmail OAuth variables)
    *   UploadThing API keys (`UPLOADTHING_SECRET`, `UPLOADTHING_APP_ID`)

5.  **Run database migrations:**
    Apply the database schema to your PostgreSQL instance.
    ```bash
    npx prisma db push
    ```

6.  **Run the development server:**
    ```bash
    bun dev
    ```
    The application will be available at `http://localhost:3000`.

## Usage

1.  **Register or Sign In**: Create a new account using your email and password or sign in with Google.   
2.  **Upload a Contract**:
    *   Navigate to the `/upload` page.
    *   Drag and drop a PDF file or click to select one.
    *   Select your country and the organization's country from the dropdown menus.
    *   Review the details and submit the contract for analysis.
3.  **Chat with your Document**:
    *   After submission, you will be redirected to a dedicated chat page for your contract (`/chat/[id]`).
    *   Use the chat input at the bottom to ask questions about the contract's content.
    *   View previous contracts and their chat histories using the sidebar.
