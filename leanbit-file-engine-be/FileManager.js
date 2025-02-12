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

    async searchFiles(dirPath, query, searchInContent = false) {
        const results = [];
        try {
            const files = await fs.readdir(dirPath, { withFileTypes: true });

            for (const file of files) {
                const filePath = path.join(dirPath, file.name);

                if (file.name.includes(query)) {
                    results.push({ filePath, match: "name" });
                }

                if (searchInContent && file.isFile()) {
                    const content = await fs.readFile(filePath, "utf-8").catch(() => "");
                    if (content.includes(query)) {
                        results.push({ filePath, match: "content" });
                    }
                }
            }
        } catch (error) {
            throw new Error("Search failed: " + error.message);
        }
        return results;
    }

    async createFileOrDir(filePath, isDirectory = false) {
        try {
            if (isDirectory) {
                await fs.mkdir(filePath, { recursive: true });
            } else {
                await fs.writeFile(filePath, "");
            }
        } catch (error) {
            throw new Error("Creation failed: " + error.message);
        }
    }

    async deleteFileOrDir(filePath) {
        try {
            const stats = await fs.stat(filePath);
            if (stats.isDirectory()) {
                await fs.rm(filePath, { recursive: true, force: true });
            } else {
                await fs.unlink(filePath);
            }
        } catch (error) {
            throw new Error("Deletion failed: " + error.message);
        }
    }

    async renameOrMoveFile(oldPath, newPath) {
        try {
            await fs.rename(oldPath, newPath);
        } catch (error) {
            throw new Error("Rename/move failed: " + error.message);
        }
    }
}

export default FileManager;