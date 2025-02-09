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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

