import fs from "fs";
import path from "path";
import { globalState } from "./state";

// Local file fallback for Next.js isolated process environments (like API routes vs instrumentation)
const CACHE_FILE = path.join(process.cwd(), ".next", "aviation-cache.json");

export function getCachedAviationData() {
    // If we have it in memory (same process), return it
    if (globalState.aviationData) {
        return {
            data: globalState.aviationData,
            timestamp: globalState.aviationTimestamp,
        };
    }

    // Otherwise try to load from the shared file cache (for API routes)
    try {
        if (fs.existsSync(CACHE_FILE)) {
            const fileData = fs.readFileSync(CACHE_FILE, "utf-8");
            const parsed = JSON.parse(fileData);
            return {
                data: parsed.data,
                timestamp: parsed.timestamp,
            };
        }
    } catch (e) {
        // Ignore file read errors
        console.error("[Aviation Polling] Error reading file cache:", e);
    }

    return {
        data: null,
        timestamp: 0,
    };
}

export function updateFileCache(data: any, timestamp: number) {
    try {
        const dir = path.dirname(CACHE_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(CACHE_FILE, JSON.stringify({ data, timestamp }));
    } catch (err) {
        console.error("[Aviation Polling] Failed to write file cache:", err);
    }
}
