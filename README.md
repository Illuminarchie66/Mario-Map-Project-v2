# Mario Map Project

## Introduction
The Mario Map Project is a non-profit passion project to create an interactive map of the Mario Universe. Here we are displaying various different maps, and locations with respect to each other, to show the expanse of the Mario Universe. We do not own any of these characters, locations or assets.

If you would like to contribute, we would love your help! Be it new maps, adding waypoints, writing info or new features, we would love to make this a comprehensive geography of the world of Mario!

## Design
The design of this website is to emulate Google Maps in style, with a navigation bar to the left on big screens, and at the bottom on small screens, which allows you to interact with the world with panels opening each direction respectively. 

There are currently 4 types of maps:
1. Model Maps: these are 3D models that make use of three.js. Currently we only have a 3D model of the Mario Earth, but this may be expanded in the future. 
2. Image Maps: this is a map which is a single image that has fixed bounds. It loads in all at once. This uses Leaflet.js for navigation.
3. Plan Maps: this is a map which consists of multiple overlayed single images that have fixed bounds. This uses Leaflet.js for navigation, and an interface in the top right to control visible layers.
4. Tile Maps: this is a map which consists of multiple tiles defined by (z,x,y) file structure. These are generated via gdal2tiles. This style improves performance for large images, but can take up more memory and potentially introduce seams. 

The backend consists of two managers which interact via an event bus. On one side is the `MapManager`, which handles loading in the current map by a given config. It also contains the `WaypointManager`, which loads in the waypoints and attaches them to the map. On the other side is the `UIManager` which handles all interfaces and displays. This includes the `NavBar`, `PanelManager`, `CoordDisplay`, and `WaypointDisplayManager`. The `NavBar` contains controls for accessing the core functionality including the `MapSelector`, `Settings`, `Toggles`, `Attribution` and more*. The `PanelManager` controls the display of panels of `MapSelector`, `Settings`,... etc. The `CoordDisplay` is a simple display of the zoom level and current position the user is looking at, a helpful debug tool for placing waypoints. Finally the `WaypointDisplayManager` handles the three waypoint types, loading and rendering in their content.

Each map has a list of Waypoints defined by a config (validated via Zod), where each waypoint will have its location, an icon, and then its content. The content is rendered via a custom HTML renderer, as defined in src/ts/ui/components/. This includes text blocks, images, image carousels, etc. There are three ways we display waypoints:
1. Popups: These are small bitesized bits of information with an image above it. They pop up directly above the waypoint and are closed when clicking away or opening another waypoint.
2. Pamphlet: Modelled after Super Mario Odyssey, these are more info-rich with a left and right panel appearing with content on it. On smaller screens this is only a left panel, and on even smaller screens this is a single panel from the bottom up.
3. Document: These are richer documents that are to explain a distinct area or location. This is when there is a bit too much info to justify and needs a bit more help.

The event bus works by having listeners and emitters, so for example when clicking an 'Explore Button' on a waypoint, it will emit `map:load` with an associated payload of a map ID and map view. The `MapManager` listens for that load, and will load in a new map when it has done so. The `MapManager` will emit a `map:loaded` when the full map process is completed, to let the UI manager know it is ready.

## Utilities 

### Setup
1. `npm install` - this will install all of the packages and dependencies needed.
2. `npm run dev` - this will run the application on localhost:5173, and will update when you change and save a file.
3. `npm run build` - this will build the application into a folder of dist/, which should be minified and portable.  

### Cloudflare CDN upload
Uploading files to Cloudflare R2 CDN Storage:
1. Download rclone and add it to PATH 
2. run `rclone config` and use:
    - storage type: Amazon S3
    - provider: Cloudflare
    - Access Key ID: from R2 API Key 
    - Secret Access Key: from R2 API Key 
    - Endpoint: `https://<account-id>.r2.cloudflarestorage.com`
3. Top copy the tiles for example we use: `rclone copy tiles r2:webpage-assets/projects/mariomap/maps/globe/tiles --progress`

### Tiling
Tiling Maps via gdal2tiles:
`python "gdal2tiles.py" -p raster --xyz -z 0-8 "<file_name>.png" tiles/`

## Planned Features 

**Documentation**
- Document code
- Document css
- Document systems in readme
- Document how to add content to application
- Update architecture diagram

**Backgrounds**
- Add in a basic background system
- Add in background options, plain color, patterned, moving patterns 
- Make different interchangable image icons 

**Markers**
- Add more marker types
- Add more marker consistency
- Add marker visited or not info

**Text rendering**
- Add built in anchors
- Add built in bold
- Add built in italics

**Star Atlas Interface**
- Book interface for mobile and big screens
- Book icons
- Book affects 
- Sticker book design
- Achievement design
- Credits design

**Stickers system**
- Sticker visual effect
- Sticker collection effect
- Sticker creation: partners and beyond
- Sticker placement at positions with certain zoom levels

**Achievement system**
- Achievement visual
- Achievement storage - groups and user value
- Create achievements: finding locations, partners, etc
- Setup unlockables

**Global Source of Truth**
- Go through all locations in the mario universe and store their location and relevant details
- Create or pair corresponding waypoints on each map to each location
- Create a game registry
- Create a search bar 
- Create a search system - simple approach is to find entries most similar in a breakdown of different elements
- Create navigation method via search
- Add in not implemented element

**Loading Screen**
- Fade in when load starts, fade out on load end
- Have icon in the centre, a mario icon of some form
- Have the icon be randomised
- Have it circled by glowing dots that rotate via theta

**User Storage (local storage + file upload)**
- Create centralized user storage system
- Clearly define accessibility 
- Update appropriately
- Add file upload system

**Settings system**
- Debug mode
- Volume settings
- Quality settings?
- Sensitivity settings
- Add into panel
- Save to user

**Audio**
- Add general audio manager
- Add audio control settings
- Add sound effects for panels, star atlas, docs, popups, and other interactions

**Luma Tutorial**
- Add a tutorial button
- Luma text box + pointer to each button 
- Walk through of features

**Waypoint toggles**
- Create a system to display / filter waypoints
- Create a global waypoint toggle
- Create a tag system 
- Add in dynamic toggle groups for each map
- Integrate with GSOT for toggle system*
- (Global toggles like games, year, etc.)

**Path toggles**
- Create ordered list of waypoints
- Draw lines between waypoints with arrows in correct order
- Create game path dropdown by map

**Text Waypoints**
- Replace waypoints with text
- Place onto map in the correct way
- Make visually distinct 
- Potentially map specific overlays

**Map Overlays**
- Political border overlay
- Old timey map overlay
- Distance map overlay
- Overlay toggle settings in panel

**Justification document**
- Create page for that document
- Breakdown the topics
- Write each section with consistency and evidence

**Lat-Lng projection**
- Find globe projection of latitude longitude
- Find individual map positions of lat / lng
- Update display accordingly
- Define arc distance

**Geoguesser**
- Create geoguesser mode
- Add in appropriate interface details
- Add in placable interactive marker
- Add in a clue zoom system
- Add in point score system based on arcdistance

**Mario Odyssey Maps**
- Get the maps and prep them
- Place the moons + purple coins
- Add in filters
- Add in kingdom pamphlets

**Mario 64 Maps**
- Get the maps and make them
- Place the stars and red coins
- Add in filters
- Add in map pamphlets 

**Sunshine Archipelago map**
- Draw the detailed map
- Draw isle delfino
- Draw bonus isles
- Draw daisy cruiser + gooper blooper
- Add waypoints
- Add shine sprites

**DK Archipelago map**
- Draw the detailed map
- Draw the different islands
- Draw the mainland
- Add waypoints

**Rogue Coast Map**
- Draw the detailed map
- Draw the cap kingdom
- Draw cascade kingdom
- Draw rogueport areas
- Add the waypoints

**Galaxy Map**

**Dimensional Map**

**Bugs**
- Fix popup offset on 3d globe
- Fix popup offset on static image waypoint
- Carousel image resize fix
- Carousel image height on panel size fix
- Phone maps needs to be able to zoom out more
- center zoom when you click on a waypoint
- when its offscreen then unloading popup would be good
- white box appears on 3d map
- when zoom in make the images smaller
- 0.5 zoom levels are crisp vs not
- drop shadow on image waypoints

**Random extras**
- Color styling
- 3D map options: ambient light, orbit speed, toggles
- Add waypoints to peach’s castle