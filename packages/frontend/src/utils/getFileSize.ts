export const getFileSize = (content: string): string => {
  const blob = new Blob([content], { type: "text/plain" });
  const size = blob.size;
  return `${(size / 1024).toFixed(2)} KB`;
};

export const getAudioFileSize = (size: number): string => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(2)} MB`;
  return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
};
