# Escuela IT Scrapper

Escuela IT Scrapper is a web application designed to scrape educational content, process transcripts, and organize information in a structured way. The project includes a Python backend, a React frontend, and an additional service for formatting transcripts using Google Generative AI.

## Project Structure

```
escuela-it-scrapper/
├── packages/
│   ├── backend/          # Backend in Python
│   ├── frontend/         # Frontend in React
│   └── gemini-service/   # Service for transcript formatting
├── package.json          # Scripts and dependencies configuration
├── pnpm-workspace.yaml   # Monorepo configuration
└── README.md             # Project documentation
```

## Features

- **Content Scraping**: Extracts information from web pages.
- **Transcript Processing**: Organizes and structures video transcripts.
- **Interactive Frontend**: User interface to interact with the system.
- **Google Generative AI Integration**: Enhances the format and clarity of transcripts.

## Requirements

- **Node.js**: >= 18.0.0
- **Python**: >= 3.11
- **PNPM**: >= 7.0.0

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/escuela-it-scrapper.git
   cd escuela-it-scrapper
   ```

2. Install dependencies:

   ```bash
   pnpm install
   pnpm run pip-install
   ```

3. Configure environment variables:
   - Create a `.env` file in `packages/gemini-service/` with your Google Generative AI API key:
     ```
     GEMINI_API_KEY=your_api_key
     ```

## Available Scripts

### Global

- **`pnpm dev`**: Runs all services in development mode.
- **`pnpm dev:frontend`**: Runs the frontend.
- **`pnpm dev:backend`**: Runs the backend.
- **`pnpm build:frontend`**: Builds the frontend.
- **`pnpm preview`**: Previews the built frontend.
- **`pnpm start`**: Starts the backend.
- **`pnpm lint`**: Runs linters across all packages.
- **`pnpm clean`**: Cleans generated files.

### Backend

- **`pnpm --filter ./packages/backend run dev`**: Runs the Flask server.
- **`pnpm --filter ./packages/backend run pip-install`**: Installs Python dependencies.

### Frontend

- **`pnpm --filter ./packages/frontend run dev`**: Runs the Vite development server.
- **`pnpm --filter ./packages/frontend run build`**: Builds the project.

### Gemini Service

- **`pnpm --filter ./packages/gemini-service run dev`**: Runs the transcript formatting service.

## Endpoints

### Backend

1. **`POST /scrape`**

   - **Description**: Submits a URL for scraping.
   - **Request Body**:
     ```json
     {
       "url": "https://example.com"
     }
     ```
   - **Response**:
     ```json
     {
       "data": "Scraped content"
     }
     ```

2. **`POST /get-content`**

   - **Description**: Retrieves processed content with or without timestamps.
   - **Request Body**:
     ```json
     {
       "hasTime": true,
       "url": "https://example.com"
     }
     ```
   - **Response**:
     ```json
     {
       "content": "Processed content"
     }
     ```

3. **`POST /format`**
   - **Description**: Formats a provided text.
   - **Request Body**:
     ```json
     {
       "text": "Raw transcript text"
     }
     ```
   - **Response**:
     ```json
     {
       "formatted": "Formatted transcript"
     }
     ```

## Frontend Routes

1. **`/` (Home Page)**

   - **Description**: Main page to input a URL and perform scraping.

2. **`/history` (History Page)**

   - **Description**: Displays the history of generated files.

3. **`*` (Not Found Page)**
   - **Description**: Error page for non-existent routes.

## Usage

1. **Frontend**: Access the interface at `http://localhost:5173` to interact with the system.
2. **Endpoints**:
   - Use the provided endpoints to scrape content, process transcripts, and format text.

## Technologies Used

- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Flask, Python
- **Additional Service**: Google Generative AI, Express

## Contribution

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/new-feature
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Added new feature"
   ```
4. Push your changes:
   ```bash
   git push origin feature/new-feature
   ```
5. Open a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).

---

Thank you for contributing to Escuela IT Scrapper!
