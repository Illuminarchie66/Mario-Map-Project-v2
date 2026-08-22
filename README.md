# Mario Map Project

# Utilities 
Setup:
1. `npm init -y`
2. `npm install --save-dev typescript`
3. `npx tsc --init`
4. Update tsconfig: `{}`
5. `npm install --save-dev vite`
6. Update `package.json` 
```json
{
  "name": "breakout-game",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "typescript": "^...",
    "vite": "^..."
  }
}
```

Uploading files to Cloudflare R2 CDN Storage:
1. Download rclone and add it to PATH 
2. run `rclone config` and use:
    - storage type: Amazon S3
    - provider: Cloudflare
    - Access Key ID: from R2 API Key 
    - Secret Access Key: from R2 API Key 
    - Endpoint: `https://<your-account-id>.r2.cloudflarestorage.com`
3. Top copy the tiles for example we use: `rclone copy tiles r2:webpage-assets/projects/mariomap/maps/globe/tiles --progress`

Tiling Maps:
`python "C:\Users\Archie Harrodine\AppData\Local\Programs\OSGeo4W\apps\Python312\Scripts\gdal2tiles.py" -p raster --xyz -z 0-8 "<file_name>.png" tiles/`