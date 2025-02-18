import fs from "fs/promises"

export const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log(`File deleted: ${filePath}`);
  } catch (error) {
    console.error(`Failed to delete file: ${filePath}`, error);
    throw error;
  }
};

