export const getFileSize = (content: string): string => {
  const blob = new Blob([content], { type: "text/plain" });
  const size = blob.size;
  return `${(size / 1024).toFixed(2)} KB`;
};
