# Escuela IT Scrapper

**Escuela IT Scrapper** is a full-stack web application designed to **extract, process, and organize educational content** from Escuela IT and similar sources.  
It automates transcript retrieval, audio processing, and text formatting — powered by **Flask**, **Selenium**, and **Google Generative AI**.

---

## 🧭 Project Structure

```
escuela-it-scrapper/
├── packages/
│   ├── backend/          # Python Flask API
│   ├── frontend/         # React app with Vite
│   └── gemini-service/   # Transcript formatting microservice (Google AI)
├── package.json          # Root configuration and scripts
├── pnpm-workspace.yaml   # Monorepo workspace configuration
└── README.md             # Project documentation
```

---

## 🚀 Features

- **Video Scraping** – Extracts text tracks (subtitles) and M3U8 URLs using Selenium.
- **Audio Downloading** – Saves `.m3u8` audio streams locally.
- **VTT Processing** – Converts `.vtt` subtitle files into plain text.
- **Automatic Transcript Formatting** – Uses Google Generative AI for structured transcript generation.
- **History Management** – Stores processed session data in JSON.
- **REST API Design** – Clean, modular, and easy to integrate.

---

## ⚙️ Requirements

- **Node.js** ≥ 18.0.0
- **Python** ≥ 3.11
- **PNPM** ≥ 7.0.0
- **Google Generative AI API Key**

---

## 🧩 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/escuela-it-scrapper.git
   cd escuela-it-scrapper
   ```

2. **Install dependencies**

   ```bash
   pnpm run install:all
   ```

3. **Environment setup**

   Create a `.env` file in `packages/gemini-service/`:

   ```
   PORT=4000
   CORS_ORIGIN=http://localhost:5173
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   MAX_MB=50
   ```

---

## 🧠 Scripts

### 🌐 Global

| Command               | Description                            |
| --------------------- | -------------------------------------- |
| `pnpm dev`            | Runs all services in development mode. |
| `pnpm dev:frontend`   | Starts the React frontend.             |
| `pnpm dev:backend`    | Starts the Flask backend.              |
| `pnpm dev:gemini`     | Starts the Gemini formatting service.  |
| `pnpm build:frontend` | Builds the frontend for production.    |
| `pnpm preview`        | Previews the built frontend.           |
| `pnpm lint`           | Runs linters across all packages.      |
| `pnpm clean`          | Removes generated files.               |

---

## 🔌 API Endpoints

### 🎞️ Videos

| Method | Endpoint             | Description                                                           |
| ------ | -------------------- | --------------------------------------------------------------------- |
| `POST` | `/get-texttrack-url` | Extracts the VTT (text track) URL from a given Escuela IT video page. |
| `POST` | `/get-m3u8-url`      | Extracts the M3U8 audio URL from a video player configuration.        |

---

### 🎧 Audios

| Method | Endpoint                     | Description                                         |
| ------ | ---------------------------- | --------------------------------------------------- |
| `POST` | `/save-audio-using-m3u8-url` | Downloads an audio file from an M3U8 source.        |
| `POST` | `/download-saved-audio`      | Downloads an already saved audio file.              |
| `POST` | `/generate-vtt-content`      | Generates a VTT transcript from a given audio file. |

---

### 🗂️ Data

| Method | Endpoint          | Description                                         |
| ------ | ----------------- | --------------------------------------------------- |
| `POST` | `/add-to-history` | Appends a record to the history file (`data.json`). |
| `GET`  | `/get-history`    | Retrieves stored history data.                      |

---

### 🧾 Transcripts

| Method | Endpoint             | Description                                      |
| ------ | -------------------- | ------------------------------------------------ |
| `POST` | `/get-vtt-content`   | Retrieves raw VTT content from a text track URL. |
| `POST` | `/vvt-to-plain-text` | Converts VTT content to plain text.              |

---

### ⚙️ Utilities

| Method | Endpoint                  | Description                                             |
| ------ | ------------------------- | ------------------------------------------------------- |
| `POST` | `/is-valid-escuelait-url` | Validates whether a provided URL belongs to Escuela IT. |
| `POST` | `/is-valid-texttrack-url` | Validates a text track (VTT) URL.                       |

---

### 🤖 Gemini Service

| Method | Endpoint                 | Description                                                           |
| ------ | ------------------------ | --------------------------------------------------------------------- |
| `POST` | `/api/format-plain-text` | Sends a plain text transcript to Google Generative AI for formatting. |

---

## 🖥️ Frontend Routes

| Route      | Description                                               |
| ---------- | --------------------------------------------------------- |
| `/`        | Home page — allows input of Escuela IT URLs and scraping. |
| `/history` | Displays saved scraping history.                          |
| `*`        | Fallback page (404 Not Found).                            |

---

## 🧰 Tech Stack

**Frontend**

- React, Vite, TailwindCSS

**Backend**

- Flask, Python, Selenium

**External Service**

- Node.js, Express, Google Generative AI

**Infrastructure**

- PNPM (monorepo management)
- JSON storage for local data

---

## 🧪 Usage

1. **Start all services**
   ```bash
   pnpm dev
   ```
2. **Open the frontend**
   Go to [http://localhost:5173](http://localhost:5173)
3. **Use the API**
   Test endpoints with Postman, HTTPie or your frontend app.

---

## 🤝 Contribution

1. Fork this repository
2. Create a new feature branch:
   ```bash
   git checkout -b feature/new-feature
   ```
3. Make your changes and commit:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/new-feature
   ```
5. Open a Pull Request 🎉

---

## 🧾 License

This project is licensed under the [MIT License](LICENSE).
