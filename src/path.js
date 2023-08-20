import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
export const dirname = path.dirname(filename);