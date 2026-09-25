import JSON5 from 'json5';
import * as yaml from 'js-yaml';

import { getPortableURL } from './portableURL';

class Loader {

    static async loadData<T = any>(path: string): Promise<T | null> {
        let res: Response;

        const targetPath = getPortableURL(path);

        try {
            res = await fetch(targetPath);
        } catch (error: any) {
            throw new Error(`Failed to fetch "${targetPath}": ${error.message}`);
        }

        if (!res.ok) {
            throw new Error(`Failed to load "${targetPath}": HTTP ${res.status} ${res.statusText}`);
        }

        const text = await res.text();

        if (!text || text.trim() === "") {
            return null;
        }

        if (targetPath.endsWith(".json5")) {
            try {
                return JSON5.parse(text) as T;
            } catch (error: any) {
                throw new Error(`Invalid JSON5 in "${targetPath}": ${error.message}`);
            }
        }

        if (targetPath.endsWith(".yaml") || targetPath.endsWith(".yml")) {
            try {
                return yaml.load(text) as T;
            } catch (error: any) {
                throw new Error(`Invalid YAML in "${targetPath}": ${error.message}`);
            }
        }
        
        throw new Error(`Unsupported file type for "${targetPath}"`);
    }
}

export { Loader };