
import * as THREE from 'three';
import { ModelMap } from '../maps/ModelMap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/Addons.js';
import {ModelMapConfig } from "../MapConfig";
import { PopupWaypoint, Waypoint } from '../waypoints/Waypoint';
import { IconIdentifier } from '../waypoints/IconRegistry';
import { eventBus } from '../../core/EventBus';
import { PopupComponent } from '../../ui/components/Popup';
import { deepDispose } from './deepDispose';
import { getPortableURL } from '../../core/portableURL';

export class WaypointSprite extends THREE.Sprite {
    waypoint: Waypoint;
    icon: IconIdentifier;
    sphereProjection: THREE.Object3D;
    active: boolean;

    constructor(waypoint: Waypoint, icon: IconIdentifier, sphereProjection: THREE.Object3D, material?: THREE.SpriteMaterial, active?: boolean) {
        super(material);
        this.waypoint = waypoint;
        this.icon = icon;
        this.sphereProjection = sphereProjection;
        this.active = active || false;
        if (!this.active)
            this.visible = false;
    }

    activate() {
        this.active = true;
        this.visible = true;
    }

    deactivate() {
        this.active = false;
        this.visible = false;
    }
}

export class Globe3D extends ModelMap {

    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    animationFrameId: number | null = null;

    htmlRenderer: CSS2DRenderer;
    popupContainer: CSS2DObject;
    activeMarker: WaypointSprite | null = null;

    ambientLight!: THREE.AmbientLight;
    sunPivot!: THREE.Object3D;
    sun!: THREE.DirectionalLight;

    earth!: THREE.Mesh;
    earthRing!: THREE.Mesh;
    earthCollision!: THREE.Object3D;
    clouds!: THREE.Group;
    cloudBase!: THREE.Mesh;
    cloudTop!: THREE.Mesh;
    cloudBottom!: THREE.Mesh;

    moonPivot!: THREE.Object3D;
    moon!: THREE.Group;
    moonRing!: THREE.Mesh;
    moonCollision!: THREE.Object3D;

    cometObservatoryPivot!: THREE.Object3D;
    cometObservatory!: THREE.Group;
    cometObservatoryRing!: THREE.Mesh;
    cometObservatoryCollision!: THREE.Object3D;

    skybox!: THREE.Group;
    
    controls!: OrbitControls;

    waypoints!: THREE.Group;
    showWaypoints: boolean = true;
    earthWaypointActive: boolean = false;
    moonWaypointActive: boolean = false;
    cometObservatoryWaypointActive: boolean = false;

    raycaster!: THREE.Raycaster;
    mouse!: THREE.Vector2;

    grid!: THREE.Group;

    mouseDelta: number = 6;
    mouseStart: THREE.Vector2 = new THREE.Vector2();
    mouseEnd: THREE.Vector2 = new THREE.Vector2();

    displacement!: THREE.Texture<unknown, THREE.TextureEventMap>
    displacementScale: number = 0.1;
    displacementCanvas!: HTMLCanvasElement;
    displacementCtx!: CanvasRenderingContext2D;

    debug: boolean = false;

    maxWaypointScale: number = 0.003;
    minWaypointScale: number = 0.001;

    origin: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    earthPos: THREE.Vector3 = new THREE.Vector3();
    moonPos: THREE.Vector3 = new THREE.Vector3();
    cometObservatoryPos: THREE.Vector3 = new THREE.Vector3();
    P: THREE.Vector3 = new THREE.Vector3();
    P_prime: THREE.Vector3 = new THREE.Vector3();
    ray: THREE.Vector3 = new THREE.Vector3();
    closestPoint: THREE.Vector3 = new THREE.Vector3();

    constructor(config: ModelMapConfig) {
        super(config);

        this.camera = new THREE.PerspectiveCamera(
            45,
            this.mapContainer.clientWidth / this.mapContainer.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 3;

        this.renderer = new THREE.WebGLRenderer({ antialias: false });
        this.renderer.setSize(this.mapContainer.clientWidth, this.mapContainer.clientHeight);
        this.renderer.domElement.style.display = 'block';
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.mapContainer.appendChild(this.renderer.domElement);

        this.htmlRenderer = new CSS2DRenderer();
        this.htmlRenderer.setSize(this.mapContainer.clientWidth, this.mapContainer.clientHeight);
        this.htmlRenderer.domElement.style.position = 'absolute';
        this.htmlRenderer.domElement.style.top = '0px';
        this.htmlRenderer.domElement.style.left = '0px';
        this.htmlRenderer.domElement.style.width = '100%';
        this.htmlRenderer.domElement.style.height = '100%';
        this.htmlRenderer.domElement.style.zIndex = '1';
        this.htmlRenderer.domElement.style.pointerEvents = 'none';
        this.mapContainer.appendChild(this.htmlRenderer.domElement);
        this.mapContainer.style.position = 'relative';

        this.popupContainer = new CSS2DObject(document.createElement('div'));
        this.scene.add(this.popupContainer);

        this.waypoints = new THREE.Group();
        this.scene.add(this.waypoints);
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        window.addEventListener('resize', () => {
            this.camera.lookAt(this.origin);

            const width = this.mapContainer.clientWidth;
            const height = this.mapContainer.clientHeight;
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
            this.htmlRenderer.setSize(width, height);
            this.renderer.render(this.scene, this.camera);
            this.htmlRenderer.render(this.scene, this.camera);
        });

        window.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'r') {
                this.toggleRings(!this.earthRing.visible);
            }

            if (event.key === 'g') {
                this.grid.visible = !this.grid.visible; 
            }

            if (event.key === 'w') {
                this.showWaypoints = !this.showWaypoints;
                this.waypoints.visible = this.showWaypoints;
            }

            if (event.key === 'd') {
                this.debug = !this.debug;
            }
        });

        this.mapContainer.addEventListener('mousedown', (event) => {
            this.mouseStart.set(event.pageX, event.pageY);
        });

        this.mapContainer.addEventListener('mouseup', (event) => {
            this.mouseEnd.set(event.pageX, event.pageY);
            const diffX = Math.abs(this.mouseEnd.x - this.mouseStart.x);
            const diffY = Math.abs(this.mouseEnd.y - this.mouseStart.y);

            if (diffX < this.mouseDelta && diffY < this.mouseDelta) {
                this.click(event);
            } 
        });

        window.addEventListener('wheel', (event: WheelEvent) => {
            eventBus.emit("map:zoom", {zoom: this.getZoom()}) 
        });
        
        eventBus.on("waypoint:close", () => {
            this.earthWaypointActive = false;
            this.moonWaypointActive = false;
            this.cometObservatoryWaypointActive = false;
        });
        
    }

    async init(): Promise<void> {
        await this.createLights();
        await this.createEarth();
        await this.createClouds();
        await this.createMoon();
        await this.createCometObservatory();
        await this.createSkybox();
        this.createControls();
        this.toggleRings(false);
        this.animate();
    }

    async createLights(): Promise<void> {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        this.scene.add(this.ambientLight);

        this.sunPivot = new THREE.Object3D();
        this.scene.add(this.sunPivot);

        this.sun = new THREE.DirectionalLight(0xffffff, 2);
        this.sun.position.set(-20, 0, 0);
        this.sunPivot.add(this.sun);
    }

    async createEarth(): Promise<void> {
        const albedo = await this.loadTexture('/data/maps/globe-3d/assets/earth/alb.png');
        albedo.colorSpace = THREE.SRGBColorSpace;
        albedo.wrapS = THREE.RepeatWrapping;
        albedo.repeat.x = 1;

        const normal = await this.loadTexture('/data/maps/globe-3d/assets/earth/norm.png');
        normal.colorSpace = THREE.NoColorSpace;

        const rough = await this.loadTexture('/data/maps/globe-3d/assets/earth/rgh.png');
        rough.colorSpace = THREE.NoColorSpace;

        const emmisive = await this.loadTexture('/data/maps/globe-3d/assets/earth/emm.png');
        emmisive.colorSpace = THREE.NoColorSpace;

        const metalness = await this.loadTexture('/data/maps/globe-3d/assets/earth/mtl.png');
        metalness.colorSpace = THREE.NoColorSpace;

        const displacement = await this.loadTexture('/data/maps/globe-3d/assets/earth/displace.png');
        displacement.colorSpace = THREE.NoColorSpace;

        this.displacement = displacement;

        const material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
            map: albedo,
            normalMap: normal,
            roughnessMap: rough,
            emissiveMap: emmisive,
            emissive: new THREE.Color(0xffff00),
            emissiveIntensity: 2,
            metalnessMap: metalness,
            metalness: 0.0,
            displacementMap: displacement,
            displacementScale: this.displacementScale,
        });

        material.normalScale.set(-1, -1);

        const geometry = new THREE.SphereGeometry(
            1, 512, 512,     
        );  

        this.earth = new THREE.Mesh(geometry, material);
        this.earthCollision = new THREE.Mesh(
            new THREE.SphereGeometry(1, 32, 32),
            new THREE.MeshBasicMaterial({ 
                color: 0xffffff, 
                transparent: true,
                opacity: 0,
                depthWrite: false,
                // wireframe: true
            })
        );
        this.earth.add(this.earthCollision);
        
        this.createAtmosphere(this.earth, 1.025);
        this.createEarthRing();
        this.createSphereGrid();

        this.scene.add(this.earth);
    }

    //https://discourse.threejs.org/t/fresnel-shader-or-similar-effect/9997/17
    createAtmosphere(planet: THREE.Object3D, radius: number): void {
        const atmosphereMaterial: THREE.ShaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                glowColor: { value: new THREE.Color(0.3, 0.6, 1.0) },
                power: { value: 2.0 },
                bias: { value: 0.5 }
            },
            vertexShader: `
                varying vec3 vWorldNormal;
                varying vec3 vWorldPosition;

                void main() {
                    vWorldNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
                    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;

                    gl_Position = projectionMatrix * viewMatrix * vec4(vWorldPosition, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                uniform float power;
                uniform float bias;

                varying vec3 vWorldNormal;
                varying vec3 vWorldPosition;

                void main() {
                    // view dir in world space
                    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
                    
                    // dot product of normal and view direction, inverted and raised to power for freshnel effect
                    float fresnel = dot(normalize(vWorldNormal), viewDirection);
                    float intensity = pow(bias + (1.0 - fresnel), power);

                    // clamp intensity between 0 and 1 
                    intensity = clamp(intensity, 0.0, 1.0);

                    gl_FragColor = vec4(glowColor * intensity, intensity);
                }
            `,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true,
        });

        const atmosphereGeometry = new THREE.SphereGeometry(radius, 64, 64);
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        planet.add(atmosphere);
    }

    createEarthRing(): void {
        const ringRadius = 100

        const ringGeometry = new THREE.TorusGeometry(
            ringRadius, // torus radius
            0.01,       // tube radius
            128, 128,
            Math.PI/2   // end angle
        );
        const ringMaterial = new THREE.MeshPhongMaterial({
            color: 0xb18f01,
            emissive: new THREE.Color(0xb18f01),
            side: THREE.DoubleSide,
        });
        this.earthRing = new THREE.Mesh(ringGeometry, ringMaterial);
        this.earthRing.position.set(0, 0, -ringRadius);
        this.earthRing.rotation.set(Math.PI / 2, 0, Math.PI/4);
        this.scene.add(this.earthRing);
    }

    createGridRing(radius: number): THREE.LineLoop {
        const curve = new THREE.EllipseCurve(
            0, 0,
            radius, radius,
            0, 2 * Math.PI,
            false,
            0
        );
        const points = curve.getPoints( 50 );
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const material = new THREE.LineBasicMaterial( { color: 0xb18f01 } );
        const ellipse = new THREE.LineLoop(geometry, material);

        return ellipse;
    }

    createSphereGrid(): void {
        this.grid = new THREE.Group();

        const radius = 1.05;
        for (let phi=0; phi<360; phi+=15) {
            const ellipse = this.createGridRing(radius);
            ellipse.rotation.y = phi * (Math.PI / 180);
            this.grid.add(ellipse)
        }

        for (let theta=-90; theta<90; theta+=15) {
            const r = radius * Math.cos(theta * (Math.PI / 180))
            const ellipse = this.createGridRing(r);
            ellipse.position.y = -Math.sin(theta * (Math.PI/180)) 
            ellipse.rotation.x = Math.PI/2;
            this.grid.add(ellipse);
        }

        this.earth.add(this.grid);
    }

    async createClouds(): Promise<void> {
        this.clouds = new THREE.Group();
        this.scene.add(this.clouds);

        const albedo = await this.loadTexture('/data/maps/globe-3d/assets/earth/cloud_alb.png');
        const normal = await this.loadTexture('/data/maps/globe-3d/assets/earth/cloud_nrm.png');

        const cloudMaterial = new THREE.MeshStandardMaterial({
            map: albedo,
            alphaMap: albedo, 
            normalMap: normal,
            transparent: true,
            depthWrite: false,
            roughness: 1.0,
            metalness: 0.0,
            alphaTest: 0.01,
            opacity: 0.9
        });

        const cloudGeometry = new THREE.SphereGeometry(1.04, 128, 128);
        this.cloudBase = new THREE.Mesh(cloudGeometry, cloudMaterial);
        this.clouds.add(this.cloudBase);

        const cloudGeneralMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            depthWrite: false,
            roughness: 1.0,
            metalness: 0.0,
            alphaTest: 0.01,
            opacity: 0.9
        });
        const cloudTopGeometry = new THREE.SphereGeometry(1.05, 128, 128, 0, Math.PI * 2, 0, Math.PI * 0.1/2);
        this.cloudTop = new THREE.Mesh(cloudTopGeometry, cloudGeneralMaterial);

        const albedoTop = await this.loadTexture('/data/maps/globe-3d/assets/earth/cloud_top_alb.png');
        albedoTop.colorSpace = THREE.SRGBColorSpace;
        albedoTop.magFilter = THREE.LinearFilter;
        const cloudTopBandMaterial = new THREE.MeshStandardMaterial({
            map: albedoTop,
            alphaMap: albedoTop,
            transparent: true,
            depthWrite: false,
            roughness: 1.0,
            metalness: 0.0,
            alphaTest: 0.01,
            opacity: 0.9
        });
        const cloudTopBandGeometry = new THREE.SphereGeometry(1.05, 128, 128, 0, Math.PI * 2,  Math.PI * 0.1/2, Math.PI * 0.15/2);
        const cloudTopBand = new THREE.Mesh(cloudTopBandGeometry, cloudTopBandMaterial);
        this.cloudTop.add(cloudTopBand); 
        this.clouds.add(this.cloudTop);

        const cloudBottomGeometry = new THREE.SphereGeometry(1.05, 128, 128, 0, Math.PI * 2, (1 - 0.1/2) * Math.PI, 0.1 * Math.PI);
        this.cloudBottom = new THREE.Mesh(cloudBottomGeometry, cloudGeneralMaterial);

        const albedoBottom = await this.loadTexture('/data/maps/globe-3d/assets/earth/cloud_bottom_alb.png');
        albedoBottom.colorSpace = THREE.SRGBColorSpace;
        albedoBottom.magFilter = THREE.LinearFilter;
        const cloudBottomBandMaterial = new THREE.MeshStandardMaterial({
            map: albedoBottom,
            alphaMap: albedoBottom,
            transparent: true,
            depthWrite: false,
            roughness: 1.0,
            metalness: 0.0,
            alphaTest: 0.01,
            opacity: 0.9
        });
        const cloudBottomBandGeometry = new THREE.SphereGeometry(1.05, 128, 128, 0, Math.PI * 2,  (1 - 0.4/2) * Math.PI, 0.3 * Math.PI / 2);
        const cloudBottomBand = new THREE.Mesh(cloudBottomBandGeometry, cloudBottomBandMaterial);
        this.cloudBottom.add(cloudBottomBand); 
        this.clouds.add(this.cloudBottom);
    }

    async createMoon(): Promise<void> {
        this.moon = await this.loadGLTF('/data/maps/globe-3d/assets/moon/moon.glb');

        this.moonPivot = new THREE.Object3D();
        this.moonPivot.position.set(0, 0, 0);
        this.moonPivot.rotation.set(0.3, 0, 0);
        this.scene.add(this.moonPivot);

        this.moon.scale.set(0.68, 0.68, 0.68);
        this.moon.position.set(2.336, 0, 0);
        this.moonPivot.add(this.moon);

        this.moonCollision = new THREE.Mesh(
            new THREE.SphereGeometry(0.68/2 + 0.15, 32, 32),
            new THREE.MeshBasicMaterial({ 
                color: 0xffffff, 
                transparent: true,
                opacity: 0,
                depthWrite: false,
                // wireframe: true
            })
        );
        this.moon.add(this.moonCollision);

        const ringGeometry = new THREE.TorusGeometry(
            2.336,      // torus radius
            0.005,      // tube radius
            128, 128,
            Math.PI * 2 // end angle
        );
        const ringMaterial = new THREE.MeshPhongMaterial({
            color: 0xb18f01,
            emissive: new THREE.Color(0xb18f01),
            side: THREE.DoubleSide,
        });
        this.moonRing = new THREE.Mesh(ringGeometry, ringMaterial);
        this.moonRing.position.y -= 0.0075
        this.moonRing.rotation.x = Math.PI / 2; 
        this.moonPivot.add(this.moonRing);
    }

    //"Wii - Super Mario Galaxy - Comet Observatory" (https://skfb.ly/puIFF) by Then is Peach is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
    async createCometObservatory(): Promise<void> {
        this.cometObservatory = await this.loadGLTF('/data/maps/globe-3d/assets/comet-observatory.glb');

        this.cometObservatoryPivot = new THREE.Object3D();
        this.cometObservatoryPivot.position.set(0, 0, 0);
        this.cometObservatoryPivot.rotation.set(-0.2, 0.2, 0);
        this.scene.add(this.cometObservatoryPivot);

        this.cometObservatory.scale.set(0.0001, 0.0001, 0.0001);
        this.cometObservatory.position.set(-1.2, 0, 0);
        this.cometObservatory.rotation.set(Math.PI/8, 0, 0);
        this.cometObservatoryPivot.add(this.cometObservatory);

        this.cometObservatoryCollision = new THREE.Mesh(
            new THREE.SphereGeometry(250, 32, 32),
            new THREE.MeshBasicMaterial({ 
                color: 0xffffff,
                transparent: true,
                opacity: 0,
                depthWrite: false
            })
        );
        this.cometObservatory.add(this.cometObservatoryCollision)

        const ringGeometry = new THREE.TorusGeometry(
            1.2,        // torus radius
            0.001,      // tube radius
            128, 128,
            Math.PI * 2 // end angle
        );
        const ringMaterial = new THREE.MeshPhongMaterial({
            color: 0xb18f01,
            emissive: new THREE.Color(0xb18f01),
            side: THREE.DoubleSide,
        });
        this.cometObservatoryRing = new THREE.Mesh(ringGeometry, ringMaterial);
        this.cometObservatoryRing.rotation.x = Math.PI / 2; 
        this.cometObservatoryPivot.add(this.cometObservatoryRing);

    }

    // https://tools.wwwtyro.net/space-3d/index.html
    async createSkybox(): Promise<void> {
        const textureUrls = [
            getPortableURL('/data/maps/globe-3d/assets/skybox/right.png'),
            getPortableURL('/data/maps/globe-3d/assets/skybox/left.png'),
            getPortableURL('/data/maps/globe-3d/assets/skybox/top.png'),
            getPortableURL('/data/maps/globe-3d/assets/skybox/bottom.png'),
            getPortableURL('/data/maps/globe-3d/assets/skybox/front.png'),
            getPortableURL('/data/maps/globe-3d/assets/skybox/back.png'),
        ];

        const texture = this.cubeTextureLoader.load(textureUrls);

        texture.colorSpace = THREE.SRGBColorSpace;
        this.scene.background = texture;
    }

    createControls(): void {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.controls.enablePan = false;      
        this.controls.minDistance = 1.5;        
        this.controls.maxDistance = 7.0;

        this.controls.rotateSpeed = 0.6;
        this.controls.zoomSpeed = 0.8;
        this.controls.enableDamping = true;

        eventBus.emit("map:zoom", {zoom: this.getZoom()}) 
    }

    click(event: MouseEvent) {
        this.earthWaypointActive = false;
        this.moonWaypointActive = false;
        this.cometObservatoryWaypointActive = false;
        this.removePopup();

        if (!this.showWaypoints) {
            eventBus.emit("map:click", {});
            return;
        }

        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const activeWaypoints = this.waypoints.children.filter((wp) => (wp as WaypointSprite).active);
        const earthIntersections = this.raycaster.intersectObjects(activeWaypoints);
        if (earthIntersections.length > 0) {
            this.earthWaypointActive = true;
            const marker = earthIntersections[0].object as WaypointSprite;
            eventBus.emit("waypoint:click", marker.waypoint);

            if (marker.waypoint.displayType === "popup") {
                this.addPopup(marker.waypoint as PopupWaypoint);
            }

            this.activeMarker= marker;
            
            return;
        } 

        const otherIntersection = this.raycaster.intersectObjects([this.earthCollision, this.moonCollision, this.cometObservatoryCollision])
        if (otherIntersection.length > 0) {
            if (otherIntersection[0].object === this.moonCollision) {
                this.clickMoon();
                return;
            } else if (otherIntersection[0].object === this.cometObservatoryCollision) {
                this.clickCometObservatory();
                return;
            } 
        }

        eventBus.emit("map:click", {});
    }

    clickMoon() {
        this.moonWaypointActive = true;
        const waypoint: Waypoint = {
            id: "moon",
            coords: [0, 0],
            
            label: "The Moon",
            icon: "default",
            path: "/data/maps/globe-3d/assets/waypoints/moon",

            displayType: "pamphlet",

            content: {
                left: [
                    {
                        type: "header",
                        title: "The Moon",
                        tagline: "Destination Above All Others",
                        image: "smo-brochure.webp",
                        link: "https://www.mariowiki.com/Moon",
                    },
                    {
                        type: "appeared-table",
                        firstAppeared: {
                            game: "Paper Mario: The Thousand-Year Door",
                            year: 2004,
                            link: "https://www.mariowiki.com/Paper_Mario:_The_Thousand-Year_Door"
                        },
                        lastAppeared: {
                            game: "Super Mario Odyssey",
                            year: 2017,
                            link: "https://www.mariowiki.com/Super_Mario_Odyssey"
                        }
                    },
                    {
                        type: "text",
                        content: "The Moon is the natural satellite that orbits the home of the Mushroom Kingdom. It is a quiet and beautiful place, with a view of Earth that is unmatched anywhere else in the Mario universe. The surface of the moon is harsh, with few creatures that live here. Interestingly, similar creatures can be found in the Seaside Kingdom - some speculate that life on Earth may have originated from the Moon!",
                        alignContent: "left",
                    },
                    {
                        type: "horizontal-rule",
                    },
                    {
                        type: "text",
                        title: "Honeylune Ridge",
                        titleColor: "#b18f01",
                        alignTitle: "left",
                        content: "Legends tell of a moon goddess, and this wedding hall is said to have been created in her honor, though no one knows for sure. The stunning exterior contrasts beautifully with the black sky, a symbol of Honeylune Ridge. Weddings here are often open, so lucky travelers can join the party.",
                        alignContent: "left",
                    },
                    {
                        type: "image",
                        image: "wedding_hall.webp",
                        caption: "Wedding Hall of Honeylune Ridge",
                        zoomable: true,
                        imageHeight: "220px",
                        alignCaption: "left",
                    },
                    {
                        type: "horizontal-rule",
                    },
                    {
                        type: "image-right",
                        title: "Rabbit Ridge",
                        titleColor: "#b18f01",
                        alignImage: "center",
                        image: "rabbit_ridge.webp",
                        content: "This is the home of the Broodals, ruled by the vegetable-loving Madame Broode. The stone tower was carved to resemble a carrot, at the direction of Madame Broode herself.",
                        caption: "Carrot-shaped Tower of Rabbit Ridge"
                    },
                    {
                        type: "text",
                        content: "The Broodals are a group of rabbits that are very dedicated wedding planners. They consist of Topper (client relations), Rango (the bouncer), Hariet (pyrotechnics) and Speward (the entertainer). ",
                        alignContent: "left",
                    },
                ],
                right: [
                    {
                        type: "text",
                        title: "Culmina Crater",
                        titleColor: "#b18f01",
                        alignTitle: "left",
                        content: "This giant crater was formed by a huge meteor collision long ago. The impact destroyed the civilization that flourished on the moon, which is how Culmina Crater came to be. The crater itself is so massive, you cannot see the bottom. From here you can observe galaxies shining in ways you never could see from home.",
                        alignContent: "left",
                    },
                    {
                        type: "text",
                        content: "There is a colossal building that stands in the center of the crater, that looks to be similar to the city hall in New Donk City. To reach it you, you must brave the lunar interior, a giant cavern of lava and challenges.",
                        alignContent: "left",
                    },
                    {
                        type: "carousel",
                        images: [
                            {
                                image: "darker_side.webp",
                                caption: "Even More Remote Region"
                            },
                            {
                                image: "building.webp",
                                caption: "A Bewildering Building"
                            },
                            {
                                image: "interior.jpg",
                                caption: "Lunar Interior"
                            }
                        ]
                    },
                    {
                        "type": "horizontal-rule",
                    },
                    {
                        type: "image-right",
                        title: "X-Naut Fortress",
                        titleColor: "#b18f01",
                        titleOnTop: true,
                        alignImage: "center",
                        image: "x_naut_fortress.webp",
                        imageWidth: "250px",
                        content: "Grodus' main base of operations, and home to the X-Nauts. The fortress is a massive technological marvel, with a large dome, teleporters, and TEC-XX, their primary computer.",
                        caption: "X-Naut Fortress in the Distance"
                    },
                    {
                        type: "image",
                        image: "fort_inside.webp",
                        caption: "X-Naut Fortress Interior",
                        alignCaption: "right",
                    },
                    {
                        "type": "horizontal-rule",
                    },
                    {
                        type: "text",
                        title: "Moon Barrel",
                        titleColor: "#b18f01",
                        alignTitle: "left",
                        content: "In the final stages of Donkey Kong Jungle Beat, D.K. is sent to the Moon Barrel, that launches him into space. Here is works through the disturbing insides of the moon, to face the Ghastly King.",
                        alignContent: "left",
                    },
                    {
                        type: "image",
                        image: "dk_moon.png",
                        caption: "D.K. in moon caves",
                        alignCaption: "right",
                    },
                    {
                        type: "image-left",
                        alignImage: "center",
                        image: "dk_punch.png",
                        imageWidth: "250px",
                        content: "Donkey Kong has also gone and punched the Moon! Against the Tiki Tong Tower, he plummets the moon into the tower, destroying it and liberating his island!",
                        caption: "D.K. punching the Moon"
                    },
                    {
                        "type": "horizontal-rule",
                    },
                    {
                        type: "image-right",
                        title: "Lunar Colony",
                        titleColor: "#b18f01",
                        alignImage: "center",
                        image: "lunar_colony.webp",
                        imageWidth: "250px",
                        content: "A futuristic settlement on the Moon, equipped with rovers and shuttles.",
                        caption: "Moon Surface"
                    },
                    {
                        type: "spacer",
                        height: "3rem"
                    },
                    {
                        type: "image-bottom",
                        image: "bottom.png",
                        height: "150px"
                    }
                ]
            },
        }

        eventBus.emit("waypoint:click", waypoint);
    }

    clickCometObservatory() {
        this.cometObservatoryWaypointActive = true;
        const waypoint: Waypoint = {
            id: "comet-observatory",
            coords: [0, 0],
            
            label: "The Comet Observatory",
            icon: "default",
            path: "/data/maps/globe-3d/assets/waypoints/comet-observatory",

            displayType: "pamphlet",

            content: {
                left: [
                    {
                        type: "header",
                        title: "The Comet Observatory",
                        tagline: "Starship of the Cosmos",
                        image: "header.png",
                        link: "https://www.mariowiki.com/Comet_Observatory",
                    },
                    {
                        type: "appeared-table",
                        firstAppeared: {
                            game: "Super Mario Galaxy",
                            year: 2007,
                            link: "https://www.mariowiki.com/Super_Mario_Galaxy"
                        },
                        lastAppeared: {
                            game: "Mario Tennis Fever",
                            year: 2026,
                            link: ""
                        }
                    },
                    {
                        type: "text",
                        content: "The star-kissed home of the Lumas, that acts as both a space station and an observatory for the vast universe. Rosalina, Mother of the Stars, calls this station her home, where she traverses tbe galaxy aiding the little Lumas who need a place to call home. Granted energy by the power stars, the comet observatory comes to orbut the Earth every 100 years, when the people of the Mushroom Kingdom come to celebrate the Star Festival.",
                        alignContent: "left",
                    },
                    {
                        type: "image",
                        image: "overview.webp",
                        caption: "Overview of the Comet Observatory",
                        imageHeight: "300px",
                        alignCaption: "left",
                    },
                    {
                        type: "horizontal-rule",
                    },
                    {
                        type: "image-left",
                        title: "Watcher of the Stars",
                        titleColor: "#b18f01",
                        titleOnTop: true,
                        alignTitle: "left",
                        content: "Lady of the Shooting Stars, Rosalina, is the tall illustrious princess of the cosmos who is the adoptive mother of the Lumas. After departing into space in search of her mother aboard the Starshroom, Rosalina eventually built the Comet Observatory with her adopted family, as a place to call home. Helping her fly the starship is Polari, a black Luma with deep blue eyes.",
                        alignImage: "center",
                        image: "rosalina-polari.jpg",
                        imageWidth: "250px",
                        caption: "Rosalina and Polari"
                    },
                    {
                        type: "horizontal-rule",
                    },
                    {
                        type: "image-right",
                        title: "The Terrace",
                        titleColor: "#b18f01",
                        alignTitle: "left",
                        content: "A grassy dome atop of pleasant plains and flowers. Inside has a starry wallpaper with a castle design in silhouette.",
                        alignContent: "left",
                        image: "terrace.webp",
                        imageWidth: "250px",
                        caption: "The Terrace Dome",
                    },
                    {
                        type: "horizontal-rule",
                    },
                    {
                        type: "text",
                        title: "The Fountain",
                        titleColor: "#b18f01",
                        alignTitle: "left",
                        content: "A blue and white tiled dome that has gentle running water coming out from its sides. polari describes the dome as very relaxing, as inside is a pool of refreshing water for any Luma to relax.",
                        alignContent: "left",
                    },
                    {
                        type: "image",
                        image: "fountain.webp",
                        caption: "The Fountain Dome",
                        imageHeight: "220px",
                        alignCaption: "left",
                    },
                    {
                        type: "horizontal-rule",
                    },
                    {
                        type: "image-left",
                        title: "The Kitchen",
                        titleColor: "#b18f01",
                        alignTitle: "left",
                        content: "Atop a small spire next to the library is the cosy kitchen. With brick walls and a homely chimney, here is where Rosalina and the Lumas indulge on Starbits and other pleasantries.",
                        alignContent: "left",
                        image: "kitchen.webp",
                        imageWidth: "250px",
                        caption: "The Kitchen Dome",
                    },

                ],
                right: [
                    {
                        type: "text",
                        title: "The Bedroom",
                        titleColor: "#b18f01",
                        alignTitle: "left",
                        content: "A purple dome draped in large starry curtains. Presumed to be Rosalina's bedroom, there is a large canopy bed that is decorated with many stars.",
                        alignContent: "left",
                    },
                    {
                        type: "horizontal-rule",
                    },
                    {
                        type: "image-right",
                        title: "The Engine Room",
                        titleColor: "#b18f01",
                        alignTitle: "left",
                        content: "A mechanical wonder atop of the Comet Observatory. Within are many purple and blue pipes from a steel mesh floor, where a lone Gearmo tends to the machinery.",
                        alignContent: "left",
                        image: "engine.webp",
                        imageWidth: "250px",
                        caption: "The Engine Room",
                    },
                    {
                        type: "horizontal-rule",
                    },
                    {
                        type: "text",
                        title: "The Garden",
                        titleColor: "#b18f01",
                        alignTitle: "left",
                        content: "A gorgeous secret dome decorated with pink pearl and a tiara atop. Inside, is an expansive green garden, lush with many flowers and rocks that protrude from the ground. The most peaceful location in the whole observatory.",
                        alignContent: "left",
                    },
                    {
                        type: "image",
                        image: "garden.webp",
                        caption: "The Garden",
                        imageHeight: "220px",
                        alignCaption: "left",
                    },
                    {
                        type: "horizontal-rule",
                    },
                    {
                        type: "text",
                        title: "The Garage",
                        titleColor: "#b18f01",
                        alignTitle: "left",
                        content: "A small octagonal docking bay found just beyond the Terrace Dome. Here is where the Toad Brigade lands and recieves repairs in their Starshroom - a mushroom shaped spaceship!",
                        alignContent: "left",
                    },
                    {
                        type: "image",
                        image: "garage.webp",
                        caption: "The Garage with the Starshroom",
                        imageHeight: "220px",
                        alignCaption: "left",
                    },
                    {
                        type: "horizontal-rule",
                    },
                    {
                        type: "image-right",
                        title: "The Library",
                        titleColor: "#b18f01",
                        alignTitle: "left",
                        content: "A cosy section of the observatory, with a roaring fire amongst a vast collection of books. A large snug carpet extends before a gentle rocking chair, and is where all the Lumas gather to listen to stories told by their mother.",
                        alignContent: "left",
                        image: "library.png",
                        imageWidth: "250px",
                        caption: "Rosalina reading to the Lumas in the Library",
                    },
                    {
                        type: "spacer",
                        height: "3rem"
                    },
                    {
                        type: "image-bottom",
                        image: "bottom.png",
                        height: "150px"
                    }
                ]
            },
        }

        eventBus.emit("waypoint:click", waypoint);
    }

    setupWaypoints(): void {
        this.mapContainer.addEventListener('mousemove', (event: MouseEvent) => {
            if (!this.showWaypoints) return;
            const rect = this.renderer.domElement.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const activeWaypoints = this.waypoints.children.filter((wp) => (wp as WaypointSprite).active);
            activeWaypoints.push(this.earthCollision);
            activeWaypoints.push(this.moonCollision);
            activeWaypoints.push(this.cometObservatoryCollision);
            const intersects = this.raycaster.intersectObjects(activeWaypoints);
            if (intersects.length > 0) {
                if (intersects[0].object !== this.earthCollision) {
                    this.mapContainer.style.cursor = 'pointer';
                    return;
                }
            } 
            this.mapContainer.style.cursor = 'default';
        });

        this.mapContainer.addEventListener('pointerdown', (event: PointerEvent) => {
            const rect = this.renderer.domElement.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersectsEarth = this.raycaster.intersectObject(this.earthCollision);
            if (intersectsEarth.length > 0) {
                const point = intersectsEarth[0].point;
                const lat = 90 - (Math.acos(point.y / point.length()) * 180 / Math.PI);
                const lng = ((Math.atan2(point.z, point.x) * 180 / Math.PI) + 180) % 360;
                eventBus.emit("map:mousemove", {
                    lat: lat,
                    lng: lng,
                });
            }
        });

        const img = this.displacement.image as HTMLImageElement;
        this.displacementCanvas = document.createElement('canvas');
        this.displacementCanvas.width = img.width;
        this.displacementCanvas.height = img.height;
        const ctx = this.displacementCanvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) throw new Error('Unable to create 2D canvas context for displacement map');
        this.displacementCtx = ctx;
        this.displacementCtx.drawImage(img, 0, 0);
    }

    getDisplacementValue(direction: THREE.Vector3) {
        const u = 0.5 - (Math.atan2(direction.z, direction.x) / (2 * Math.PI));
        const v = 0.5 - (Math.asin(direction.y) / Math.PI);

        const ix = Math.min(Math.floor(u * this.displacementCanvas.width), this.displacementCanvas.width - 1);
        const iy = Math.min(Math.floor(v * this.displacementCanvas.height), this.displacementCanvas.height - 1);

        const pixelData = this.displacementCtx.getImageData(ix, iy, 1, 1).data;

        return pixelData[0] / 255;
    }

    setMarkerScale(marker: WaypointSprite) {
        const zoom = this.getZoom();
        const scale = this.minWaypointScale + (this.maxWaypointScale - this.minWaypointScale)*zoom
        marker.scale.set(scale*marker.icon.iconSize[0], scale*marker.icon.iconSize[1], scale);
    }

    addMarker(waypoint: Waypoint, icon: IconIdentifier) {
        const [lat, lng] = waypoint.coords;
        
        const phi = (lat * Math.PI) / 180;
        const theta = (lng * Math.PI) / 180 + Math.PI / 2;

        const x = - Math.cos(phi) * Math.sin(theta);
        const y = Math.sin(phi);
        const z = Math.cos(phi) * Math.cos(theta);

        const direction = new THREE.Vector3(x, y, z).normalize();
        
        const displacement = this.getDisplacementValue(direction);
        const height = 1 + this.displacementScale * displacement;
        const sphereProjection = new THREE.Object3D();
        sphereProjection.position.set(x * height, y * height, z * height);
        this.earth.add(sphereProjection);

        const iconImage = this.textureLoader.load(getPortableURL(icon.iconPath));
        const iconMaterial = new THREE.SpriteMaterial({map: iconImage});
        const marker = new WaypointSprite(waypoint, icon, sphereProjection, iconMaterial, false);
        
        this.setMarkerScale(marker);
        marker.center.set(0.5, 0);

        this.waypoints.add(marker);
    }

    intersectsEarth(lineSegment: THREE.Line3, origin: THREE.Vector3, radius: number): boolean {
        lineSegment.closestPointToPoint(origin, true, this.closestPoint);
        const distanceSq = this.closestPoint.distanceToSquared(origin);
        const radiusSq = radius * radius;
        return distanceSq <= radiusSq;
    }

    renderMarker(marker: WaypointSprite) {
        marker.sphereProjection.getWorldPosition(this.earthPos);
        this.P.copy(this.earthPos);
        this.ray.copy(this.P).sub(this.camera.position).normalize();
        this.P_prime.copy(this.P).addScaledVector(this.ray, -0.1);

        marker.position.copy(this.P_prime);

        const angle = this.camera.position.angleTo(this.earthPos.clone().normalize());
        if (angle * (180 / Math.PI) > 70) {
            marker.deactivate();
            return;
        }

        const lineSegment = new THREE.Line3(this.P, this.P_prime);
        if (this.intersectsEarth(lineSegment, this.origin, 0.99)) {
            marker.deactivate();
            return;
        }
        
        const moonPos = this.moon.getWorldPosition(new THREE.Vector3());
        if (this.intersectsEarth(lineSegment, moonPos, 0.68/2)) {
            marker.deactivate();
            return;
        }

        marker.activate();
    }

    addPopup(waypoint: PopupWaypoint) {
        const popup = new PopupComponent(waypoint.content, waypoint.path);
                
        const popupContainer = document.createElement('div');
        popupContainer.classList = 'popup-container';
        ['mousedown', 'mouseup', 'click'].forEach(eventName => {
            popupContainer.addEventListener(eventName, (event) => {
                event.stopPropagation();
            });
        });
        popupContainer.style.userSelect = 'text';
        const leafletPopupWrapper = document.createElement('div');
        leafletPopupWrapper.classList = 'leaflet-popup-content-wrapper'
        leafletPopupWrapper.style.pointerEvents = 'auto';
        const leafletPopup = document.createElement('div');
        leafletPopup.classList = 'leaflet-popup-content';
        leafletPopup.appendChild(popup.render());
        leafletPopupWrapper.appendChild(leafletPopup);
        popupContainer.appendChild(leafletPopupWrapper);
        
        this.popupContainer = new CSS2DObject(popupContainer);
        this.popupContainer.position.set(0, 0, 0);
        this.popupContainer.center.set(0.5, 1);
        this.scene.add(this.popupContainer);
    }

    removePopup() {
        if (this.popupContainer) this.scene.remove(this.popupContainer)
        this.activeMarker = null;
    }

    toggleRings(visible: boolean): void {
        this.earthRing.visible = visible;
        this.moonRing.visible = visible;
        this.cometObservatoryRing.visible = visible;
    }

    animate() {

        this.controls.update(); 

        if (!this.earthWaypointActive) 
            this.earth.rotation.y += 0.0002;

        this.sunPivot.rotation.y -= 0.00005;
        this.scene.backgroundRotation.y -= 0.00005;

        if (!this.moonWaypointActive)
            this.moonPivot.rotation.y += 0.0005;
        this.moon.rotation.y += 0.001;

        if (!this.cometObservatoryWaypointActive)
            this.cometObservatoryPivot.rotation.y += 0.0005;
        this.cometObservatory.rotation.y += 0.001;

        this.clouds.rotation.y += 0.001;

        this.waypoints.children.forEach(wp => {
            this.renderMarker(wp as WaypointSprite);
        });

        if (this.activeMarker) {
            if (this.activeMarker.active && this.activeMarker.waypoint.displayType === "popup") {
                this.popupContainer.position.copy(this.activeMarker.position);
                const t = this.popupContainer.element.getElementsByClassName('leaflet-popup-content')[0] as HTMLElement;
                const offset = -44.76 + -3.05/((this.getZoom() + 0.15)**2)
                t.style.translate = `${0}px ${offset}px`;

            } else {
                this.removePopup();
            }
        } else {
            this.removePopup();
        }

        this.waypoints.children.forEach(wp => {
            this.setMarkerScale(wp as WaypointSprite);
        })

        this.renderer.render(this.scene, this.camera);
        this.htmlRenderer.render(this.scene, this.camera);

        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    getZoom(): number {
        if (!this.controls) return 0;
        return (this.controls.getDistance() - this.controls.minDistance) / (this.controls.maxDistance - this.controls.minDistance);
    }

    getCenter(): { lat: number, lng: number } {
        return { lat: 0, lng: 0 };
    }

    destroy(): void {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
        }

        deepDispose(this.scene);

        this.scene.clear();
        this.renderer.dispose();

        if (this.renderer.domElement && this.renderer.domElement.parentNode) {
            this.renderer.domElement.remove();
        }
        if (this.htmlRenderer.domElement && this.htmlRenderer.domElement.parentNode) {
            this.htmlRenderer.domElement.remove();
        }
        
        this.mapContainer.innerHTML = '';
    }
}