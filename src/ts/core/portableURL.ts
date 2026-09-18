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