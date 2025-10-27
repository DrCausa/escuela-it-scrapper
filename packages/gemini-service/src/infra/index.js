import { createServer } from "./server.js";
import { env } from "./config/env.js";

const app = createServer();

app.listen(env.PORT, () => {
  console.log(`Gemini Service running on port ${env.PORT}`);
});
