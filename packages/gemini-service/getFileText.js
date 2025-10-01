import fs from "fs/promises"; // Importa la versión de promesas del módulo fs

export async function readFileText(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return data;
  } catch (err) {
    console.error("Error al leer el archivo:", err);
    throw err; // Es buena práctica relanzar el error para que pueda ser capturado por el código que llama
  }
}
