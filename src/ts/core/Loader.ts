import JSON5 from 'json5';
import * as yaml from 'js-yaml';

/*
A simple utility function to get a portable URL for a given path.
If the path is a URL, then return it as is. 
If the path does not start with a slash, then return it as is.
If the path is a relative path, then prepend the base URL to it.
If the base URL is not set, then use the current directory as the base URL.
*/

export function getPortableURL(path: string): string {
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    if (!path.startsWith("/")) {
        return path;
    }

    const cleanPath = path.substring(1);
    let base = import.meta.env.BASE_URL || "./";

    if (base === "/") {
        base = "./";
    }

    return base.endsWith("/") ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
}

/*
This loader class is responsible for loading data files in JSON5 or YAML format.
It first makes sure the URL is portable, then fetches the file and checks for errors. If the file is empty it returns null.
We use JSON5 and YAML parsers to parse the text into a JavaScript object. If the file is not in one of these formats it throws an error.
*/

export async function loadData<T = any>(path: string): Promise<T | null> {
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