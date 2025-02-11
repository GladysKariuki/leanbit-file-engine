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


app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

