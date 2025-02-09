import { promises as fs } from "fs";
import path from 'path';

class FileManager {
    async getDirectoryContents(dirPath) {
        try {
            const files = await fs.readdir(dirPath, {withFileTypes: true});
            return files.map(file => ({
                name: file.name,
                type: file.isDirectory() ? "directory" : "file"
            }));
        } catch (error) {
            throw new Error("Failed to read directory: " + error.message);
        }
    }

    async getFileDetails(filePath) {
        try {
            const fileInformation = await fs.stat(filePath);
            return {
                name: path.basename(filePath),
                size: fileInformation.size,
                type: fileInformation.isDirectory() ? "directory" : "file",
                lastModified: fileInformation.mtime
            };
        } catch (error) {
            throw new Error("Failed to get file details: " + error.message);
        }
    }

    async readFileContent(filePath, type = "text") {
        try {
            const buffer = await fs.readFile(filePath);
            return {
                content: type === "text" ? buffer.toString("utf-8") : buffer,
                contentType: type === "text" ? "text/plain" : "application/octet-stream"
            };
        } catch (error) {
            throw new Error("Unable to read file: " + error.message);
        }
    }
}

export default FileManager;