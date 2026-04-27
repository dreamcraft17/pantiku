import path from "node:path";
import fs from "node:fs/promises";
import { env } from "../config/env.js";

export class StorageService {
  async saveFile(fileName: string, content: Buffer): Promise<string> {
    const storageRoot = path.resolve(env.LOCAL_STORAGE_PATH);
    await fs.mkdir(storageRoot, { recursive: true });
    const filePath = path.join(storageRoot, fileName);
    await fs.writeFile(filePath, content);
    return filePath;
  }
}
