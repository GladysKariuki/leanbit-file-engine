import { watch } from "chokidar";

class FileWatcher {
    constructor() {
        this.watchers = new Map(); // Store active watchers
    }

    /**
     * Watch a directory for changes
     * @param {string} dirPath
     */
    watchDirectory(dirPath) {
        if (this.watchers.has(dirPath)) {
            console.log(`Already watching ${dirPath}`);
            return;
        }

        const watcher = watch(dirPath, { persistent: true });

        watcher
            .on("add", path => console.log(`File added: ${path}`))
            .on("change", path => console.log(`File changed: ${path}`))
            .on("unlink", path => console.log(`File removed: ${path}`))
            .on("error", error => console.error(`Watcher error: ${error}`));

        this.watchers.set(dirPath, watcher);
        console.log(`Started watching: ${dirPath}`);
    }

    /**
     * Stop watching a directory
     * @param {string} dirPath
     */
    stopWatching(dirPath) {
        const watcher = this.watchers.get(dirPath);
        if (watcher) {
            watcher.close();
            this.watchers.delete(dirPath);
            console.log(`Stopped watching: ${dirPath}`);
        } else {
            console.log(`No watcher found for ${dirPath}`);
        }
    }
}

export default FileWatcher;