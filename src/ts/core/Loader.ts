import JSON5 from 'json5';
import * as yaml from 'js-yaml';

class Loader {

    static async loadData<T = any>(path: string): Promise<T | null> {
        let res: Response;

        try {
            res = await fetch(path);
        } catch (error: any) {
            throw new Error(`Failed to fetch "${path}": ${error.message}`);
        }

        if (!res.ok) {
            throw new Error(`Failed to load "${path}": HTTP ${res.status} ${res.statusText}`);
        }

        const text = await res.text();

        if (!text || text.trim() === "") {
            return null;
        }

        if (path.endsWith(".json5")) {
            try {
                return JSON5.parse(text) as T;
            } catch (error: any) {
                throw new Error(`Invalid JSON5 in "${path}": ${error.message}`);
            }
        }

        if (path.endsWith(".yaml") || path.endsWith(".yml")) {
            try {
                return yaml.load(text) as T;
            } catch (error: any) {
                throw new Error(`Invalid YAML in "${path}": ${error.message}`);
            }
        }
        
        throw new Error(`Unsupported file type for "${path}"`);
    }
}

export { Loader };