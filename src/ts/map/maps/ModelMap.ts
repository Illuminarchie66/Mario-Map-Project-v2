
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {ModelMapConfig } from "../MapConfig";
import { _Map } from "./Map";
import { Waypoint } from '../Waypoints/Waypoint';
import { IconIdentifier } from '../Waypoints/IconRegistry';
import { eventBus } from '../../core/EventBus';

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

export class ModelMap extends _Map<ModelMapConfig> {
    textureLoader: THREE.TextureLoader;
    gltfLoader: GLTFLoader;
    cubeTextureLoader: THREE.CubeTextureLoader;

    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    animationFrameId: number | null = null;

    ambientLight!: THREE.AmbientLight;
    sunPivot!: THREE.Object3D;
    sun!: THREE.DirectionalLight;

    earth!: THREE.Mesh;
    earthRing!: THREE.Mesh;
    clouds!: THREE.Mesh;

    moonPivot!: THREE.Object3D;
    moon!: THREE.Group;
    moonRing!: THREE.Mesh;

    cometObservatoryPivot!: THREE.Object3D;
    cometObservatory!: THREE.Group;
    cometObservatoryRing!: THREE.Mesh;

    skybox!: THREE.Group;
    
    controls!: OrbitControls;

    waypoints!: THREE.Group;
    showWaypoints: boolean = true;
    raycaster!: THREE.Raycaster;
    mouse!: THREE.Vector2;

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

    constructor(config: ModelMapConfig) {
        super(config);
        this.textureLoader = new THREE.TextureLoader();
        this.gltfLoader = new GLTFLoader();
        this.cubeTextureLoader = new THREE.CubeTextureLoader();

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 3;

        this.renderer = new THREE.WebGLRenderer({ antialias: false });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.mapContainer.appendChild(this.renderer.domElement);

        this.waypoints = new THREE.Group();
        this.scene.add(this.waypoints);
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.render(this.scene, this.camera);
        });

        window.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'r') {
                this.toggleRings(!this.earthRing.visible);
            }

            if (event.key === 'w') {
                this.showWaypoints = !this.showWaypoints;
                this.waypoints.visible = this.showWaypoints;
            }

            if (event.key === 'd') {
                this.debug = !this.debug;
            }
        });

        window.addEventListener('mousedown', (event) => {
            this.mouseStart.set(event.pageX, event.pageY);
        });

        window.addEventListener('mouseup', (event) => {
            this.mouseEnd.set(event.pageX, event.pageY);
            const diffX = Math.abs(this.mouseEnd.x - this.mouseStart.x);
            const diffY = Math.abs(this.mouseEnd.y - this.mouseStart.y);

            if (diffX < this.mouseDelta && diffY < this.mouseDelta) {
                // click 
                if (!this.showWaypoints) {
                    eventBus.emit("map:click", {});
                    return;
                }

                this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
                this.raycaster.setFromCamera(this.mouse, this.camera);
                const activeWaypoints = this.waypoints.children.filter((wp) => (wp as WaypointSprite).active);
                const intersects = this.raycaster.intersectObjects(activeWaypoints);
                if (intersects.length > 0) {
                    const marker = intersects[0].object as WaypointSprite;
                    console.log(marker.waypoint.id);
                    eventBus.emit("waypoint:click", marker.waypoint);
                } else {
                    eventBus.emit("map:click", {});
                }
            } 
        });

        window.addEventListener('wheel', (event: WheelEvent) => {
            eventBus.emit("map:zoom", {zoom: this.getZoom()}) 
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

    loadTexture(url: string): Promise<THREE.Texture> {
        return new Promise((resolve, reject) => {
            this.textureLoader.load(
                url,
                texture => resolve(texture),
                undefined,
                error => reject(error)
            );  
        });
    }

    loadGLTF(url: string): Promise<THREE.Group> {
        return new Promise((resolve, reject) => {
            this.gltfLoader.load(
                url,
                gltf => resolve(gltf.scene),
                undefined,
                error => reject(error)
            );
        });
    }

    loadCubeTexture(urls: string[]): Promise<THREE.CubeTexture> {
        return new Promise((resolve, reject) => {
            this.cubeTextureLoader.load(
                urls,
                texture => resolve(texture),
                undefined,
                error => reject(error)
            );
        });
    }

    async createLights(): Promise<void> {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        this.scene.add(this.ambientLight);

        this.sunPivot = new THREE.Object3D();
        this.scene.add(this.sunPivot);

        this.sun = new THREE.DirectionalLight(0xffffff, 2);
        // sun in skybox right image
        this.sun.position.set(-20, 0, 0);
        this.sunPivot.add(this.sun);
    }

    async createEarth(): Promise<void> {
        const albedo = await this.loadTexture('data/maps/globe-3d/earth/alb.png');
        albedo.colorSpace = THREE.SRGBColorSpace;
        albedo.wrapS = THREE.RepeatWrapping;
        albedo.repeat.x = 1;

        const normal = await this.loadTexture('data/maps/globe-3d/earth/norm.png');
        normal.colorSpace = THREE.NoColorSpace;

        const rough = await this.loadTexture('data/maps/globe-3d/earth/rgh.png');
        rough.colorSpace = THREE.NoColorSpace;

        const emmisive = await this.loadTexture('data/maps/globe-3d/earth/emm.png');
        emmisive.colorSpace = THREE.NoColorSpace;

        const metalness = await this.loadTexture('data/maps/globe-3d/earth/mtl.png');
        metalness.colorSpace = THREE.NoColorSpace;

        const displacement = await this.loadTexture('data/maps/globe-3d/earth/displace.png');
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
        
        this.createAtmosphere(this.earth, 1.025);
        this.createEarthRing();

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

    async createClouds(): Promise<void> {
        const albedo = await this.loadTexture('data/maps/globe-3d/earth/cloud_alb.png');
        const normal = await this.loadTexture('data/maps/globe-3d/earth/cloud_nrm.png');

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
        this.clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
        this.scene.add(this.clouds);
    }

    async createMoon(): Promise<void> {
        this.moon = await this.loadGLTF('data/maps/globe-3d/moon/moon.glb');

        this.moonPivot = new THREE.Object3D();
        this.moonPivot.position.set(0, 0, 0);
        this.moonPivot.rotation.set(0.3, 0, 0);
        this.scene.add(this.moonPivot);

        this.moon.scale.set(0.68, 0.68, 0.68);
        this.moon.position.set(2.336, 0, 0);
        this.moonPivot.add(this.moon);

        // this.moonDebug = new THREE.Mesh(
        //     new THREE.SphereGeometry(0.68/2, 32, 32),
        //     new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
        // );
        // this.moonDebug.position.set(2.336, 0, 0);
        // this.moonPivot.add(this.moonDebug);

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
        this.cometObservatory = await this.loadGLTF('data/maps/globe-3d/comet-observatory.glb');

        this.cometObservatoryPivot = new THREE.Object3D();
        this.cometObservatoryPivot.position.set(0, 0, 0);
        this.cometObservatoryPivot.rotation.set(-0.2, 0.2, 0);
        this.scene.add(this.cometObservatoryPivot);

        this.cometObservatory.scale.set(0.0001, 0.0001, 0.0001);
        this.cometObservatory.position.set(-1.2, 0, 0);
        this.cometObservatory.rotation.set(Math.PI/8, 0, 0);
        this.cometObservatoryPivot.add(this.cometObservatory);

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
            'data/maps/globe-3d/skybox/right.png',
            'data/maps/globe-3d/skybox/left.png',
            'data/maps/globe-3d/skybox/top.png',
            'data/maps/globe-3d/skybox/bottom.png',
            'data/maps/globe-3d/skybox/front.png',
            'data/maps/globe-3d/skybox/back.png',
        ];

        const texture = this.cubeTextureLoader.load(textureUrls);

        texture.colorSpace = THREE.SRGBColorSpace;
        this.scene.background = texture;
    }

    setupWaypoints(): void {
        window.addEventListener('mousemove', (event: MouseEvent) => {
            if (!this.showWaypoints) return;
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const activeWaypoints = this.waypoints.children.filter((wp) => (wp as WaypointSprite).active);
            const intersects = this.raycaster.intersectObjects(activeWaypoints);
            if (intersects.length > 0) {
                this.mapContainer.style.cursor = 'pointer';
            } else {
                this.mapContainer.style.cursor = 'default';
            }
        });

        window.addEventListener('pointerdown', (event: PointerEvent) => {
            const intersectsEarth = this.raycaster.intersectObject(this.earth);
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

        const iconImage = this.textureLoader.load(icon.iconPath);
        const iconMaterial = new THREE.SpriteMaterial({map: iconImage});
        const marker = new WaypointSprite(waypoint, icon, sphereProjection, iconMaterial, false);
        
        this.setMarkerScale(marker);
        marker.center.set(0.5, 0);

        this.waypoints.add(marker);
    }

    intersectsSphere(lineSegment: THREE.Line3, origin: THREE.Vector3, radius: number): boolean {
        const closestPoint = new THREE.Vector3();
        lineSegment.closestPointToPoint(origin, true, closestPoint);
        const distanceSq = closestPoint.distanceToSquared(origin);
        const radiusSq = radius * radius;
        return distanceSq <= radiusSq;
    }

    renderMarker(marker: WaypointSprite) {
        const spherePos = marker.sphereProjection.getWorldPosition(new THREE.Vector3());
        const P = new THREE.Vector3().copy(spherePos);
        const ray = new THREE.Vector3().copy(P).sub(this.camera.position).normalize();
        const P_prime = new THREE.Vector3().copy(P);
        P_prime.addScaledVector(ray, -0.1); 

        marker.position.copy(P_prime);

        const angle = this.camera.position.angleTo(spherePos.clone().normalize());
        if (angle * (180 / Math.PI) > 70) {
            marker.deactivate();
            return;
        }

        const lineSegment = new THREE.Line3(P, P_prime);
        if (this.intersectsSphere(lineSegment, new THREE.Vector3(0, 0, 0), 0.99)) {
            marker.deactivate();
            return;
        }
        
        const moonPos = this.moon.getWorldPosition(new THREE.Vector3());
        if (this.intersectsSphere(lineSegment, moonPos, 0.68/2)) {
            marker.deactivate();
            return;
        }

        marker.activate();
    }

    toggleRings(visible: boolean): void {
        this.earthRing.visible = visible;
        this.moonRing.visible = visible;
        this.cometObservatoryRing.visible = visible;
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

    animate() {

        this.controls.update(); 

        
        this.earth.rotation.y += 0.0002;

        this.sunPivot.rotation.y -= 0.00005;
        this.scene.backgroundRotation.y -= 0.00005;

        this.moonPivot.rotation.y += 0.0005;
        this.moon.rotation.y += 0.001;

        this.cometObservatoryPivot.rotation.y += 0.0005;
        this.cometObservatory.rotation.y += 0.001;

        this.clouds.rotation.y += 0.001;

        this.waypoints.children.forEach(wp => {
            this.renderMarker(wp as WaypointSprite);
        });

        this.renderer.render(this.scene, this.camera);

       this.waypoints.children.forEach(wp => {
            this.setMarkerScale(wp as WaypointSprite);
        })

        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }
 
    getZoom(): number {
        return (this.controls.getDistance() - this.controls.minDistance) / this.controls.maxDistance;;
    }
 
    getCenter(): { lat: number, lng: number } {
        return { lat: 0, lng: 0 };
    }
 
    destroy(): void {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
        }

        this.scene.traverse((object) => {
            if (!(object instanceof THREE.Object3D)) return;

            if ('geometry' in object && object.geometry instanceof THREE.BufferGeometry) {
                object.geometry.dispose();
            }

            if ('material' in object && object.material) {
                const materials = Array.isArray(object.material) ? object.material : [object.material];
            
                for (const material of materials) {
                    for (const key in material) {
                        if (material[key] && material[key] instanceof THREE.Texture) {
                        material[key].dispose();
                        }
                    }
                    material.dispose();
                }
            }
        })

        this.scene.clear();
        this.renderer.dispose();

        if (this.renderer.domElement && this.renderer.domElement.parentNode) {
            this.renderer.domElement.remove();
        }
        
        this.mapContainer.innerHTML = '';

        (this as any).scene = null;
        (this as any).camera = null;
        (this as any).renderer = null;
    }
}

