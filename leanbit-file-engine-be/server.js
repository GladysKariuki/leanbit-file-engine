import express from 'express';
import FileManager from './FileManager.js';

const app = express();
const port = 3030;

app.use(express.json());

const fileManager = new FileManager();

app.get("/api/files", async(req, res) => {
    const { path } = req.query;
    if (!path) return res.status(400).json({ error: "Path is missing" });

    try {
        const contents = await fileManager.getDirectoryContents(path);
        res.json(contents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/api/file-details", async (req, res) => {
    const { path } = req.query;
    if (!path) return res.status(400).json({ error: "Path is required" });

    try {
        const details = await fileManager.getFileDetails(path);
        res.json(details);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/api/read-file", async (req, res) => {
    const { path, type } = req.query;
    if (!path) return res.status(400).json({ error: "Path is required" });

    try {
        const { content, contentType } = await fileManager.readFileContent(path, type);
        res.setHeader("Content-Type", contentType);
        res.send(content);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/api/watch-directory", (req, res) => {
    const { path } = req.body;
    if (!path) return res.status(400).json({ error: "Path is required" });

    fileWatcher.watchDirectory(path);
    res.json({ message: `Watching directory: ${path}` });
});

app.post("/api/file/search", async (req, res) => {
    const { dirPath, query, searchInContent } = req.body;
    try {
        const results = await fileManager.searchFiles(dirPath, query, searchInContent);
        res.json(results);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post("/api/file/create", async (req, res) => {
    const { filePath, isDirectory } = req.body;
    try {
        await fileManager.createFileOrDir(filePath, isDirectory);
        res.json({ message: "Created successfully." });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete("/api/file/delete", async (req, res) => {
    const { filePath } = req.body;
    try {
        await fileManager.deleteFileOrDir(filePath);
        res.json({ message: "Deleted successfully." });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put("/api/file/rename", async (req, res) => {
    const { oldPath, newPath } = req.body;
    try {
        await fileManager.renameOrMoveFile(oldPath, newPath);
        res.json({ message: "Renamed or moved successfully." });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

