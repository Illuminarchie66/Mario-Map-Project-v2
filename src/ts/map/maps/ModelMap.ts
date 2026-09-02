
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {ModelMapConfig } from "../MapConfig";
import { _Map } from "./Map";

export class ModelMap extends _Map<ModelMapConfig> {
    loader: THREE.TextureLoader;
    gltfLoader: GLTFLoader;

    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    private animationFrameId: number | null = null;

    ambientLight!: THREE.AmbientLight;
    sunPivot!: THREE.Object3D;
    sun!: THREE.DirectionalLight;
    planet!: THREE.Mesh;
    moonPivot!: THREE.Object3D;
    moon!: THREE.Group;
    moonRing!: THREE.Mesh;
    clouds!: THREE.Mesh;
    atmosphere!: THREE.Mesh;
    cometObservatoryPivot!: THREE.Object3D;
    cometObservatory!: THREE.Group;
    cometRing!: THREE.Mesh;
    skybox!: THREE.Group;
    controls!: OrbitControls;

    constructor(config: ModelMapConfig) {
        super(config);
        this.loader = new THREE.TextureLoader();
        this.gltfLoader = new GLTFLoader();

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

        this.createLights();
        this.createPlanet();
        this.createMoon();
        this.createClouds();
        this.createAtmosphere();
        this.createCometObservatory();
        this.createSkybox();
        this.createControls();

        this.animate();

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.render(this.scene, this.camera);
        });
    }

    createLights(): void {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        this.scene.add(this.ambientLight);

        // this.sunPivot = new THREE.Object3D();
        // this.scene.add(this.sunPivot);

        // this.sun = new THREE.DirectionalLight(0xfff7ba, 2);
        // this.sun.position.set(-5, 3, 5);
        // this.sunPivot.add(this.sun);

        this.sun = new THREE.DirectionalLight(0xffffff, 2);
        // sun in skybox right image
        this.sun.position.set(-10, 0, 0);
        this.scene.add(this.sun);
    }

    createPlanet(): void {
        const albedo = this.loader.load('data/maps/globe-3d/earth/alb.png');
        albedo.colorSpace = THREE.SRGBColorSpace;
        albedo.wrapS = THREE.RepeatWrapping;
        albedo.repeat.x = 1;

        const normal = this.loader.load('data/maps/globe-3d/earth/norm.png');
        normal.colorSpace = THREE.NoColorSpace;

        const rough = this.loader.load('data/maps/globe-3d/earth/rgh.png');
        rough.colorSpace = THREE.NoColorSpace;

        const emmisive = this.loader.load('data/maps/globe-3d/earth/emm.png');
        emmisive.colorSpace = THREE.NoColorSpace;

        const metalness = this.loader.load('data/maps/globe-3d/earth/mtl.png');
        metalness.colorSpace = THREE.NoColorSpace;

        const displacement = this.loader.load('data/maps/globe-3d/earth/displace.png');
        displacement.colorSpace = THREE.NoColorSpace;

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
            displacementScale: 0.1,
        });

        material.normalScale.set(-1, -1);

        const geometry = new THREE.SphereGeometry(
            1, 512, 512,     
        );  

        this.planet = new THREE.Mesh(geometry, material);
        this.scene.add(this.planet);
    }

    createClouds(): void {
        const albedo = this.loader.load('data/maps/globe-3d/earth/cloud_alb.png');
        const normal = this.loader.load('data/maps/globe-3d/earth/cloud_nrm.png');

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

    //https://discourse.threejs.org/t/fresnel-shader-or-similar-effect/9997/17
    createAtmosphere(): void {
        const atmosphereMaterial: THREE.ShaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                glowColor: { value: new THREE.Vector3(0.3, 0.6, 1.0) },
                power: { value: 2.0 },
                bias: { value: 0.4 }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;

                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                uniform float power;
                uniform float bias;

                varying vec3 vNormal;
                varying vec3 vPosition;

                void main() {
                    vec3 viewDirection = normalize(cameraPosition - vPosition);
                    float intensity = pow(bias - dot(vNormal, viewDirection), power);
                    vec3 atmosphereColor = glowColor * intensity;

                    gl_FragColor = vec4(atmosphereColor, 1.0);
                }
            `,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true,
        });

        const atmosphereGeometry = new THREE.SphereGeometry(1.035, 64, 64);
        this.atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        this.scene.add(this.atmosphere);
    }

    createMoon(): void {
        this.gltfLoader.load(
            'data/maps/globe-3d/moon/moon.glb',
            (gltf) => {
                this.moonPivot = new THREE.Object3D();
                this.moonPivot.position.set(0, 0, 0);
                this.moonPivot.rotation.set(0.3, 0, 0);
                this.scene.add(this.moonPivot);

                this.moon = gltf.scene;
                this.moon.scale.set(0.68, 0.68, 0.68);
                this.moon.position.set(2.336, 0, 0);
                this.moonPivot.add(this.moon);

                const ringGeometry = new THREE.TorusGeometry(
                    2.336, // torus radius
                    0.005,   // tube radius
                    128, 128,
                    Math.PI * 2 // end angle
                );
                const ringMaterial = new THREE.MeshPhongMaterial({
                    color: 0xb18f01,
                    emissive: new THREE.Color(0xb18f01),
                    side: THREE.DoubleSide,
                });
                this.moonRing = new THREE.Mesh(ringGeometry, ringMaterial);
                this.moonRing.rotation.x = Math.PI / 2; 
                this.moonPivot.add(this.moonRing);
            },
            (xhr) => {},
            (error) => {
                console.error('An error happened while loading the moon model:', error);
            }
        );
    }

    //"Wii - Super Mario Galaxy - Comet Observatory" (https://skfb.ly/puIFF) by Then is Peach is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
    createCometObservatory(): void {
        this.gltfLoader.load(
            'data/maps/globe-3d/comet-observatory.glb', 
            (gltf) => {
                this.cometObservatoryPivot = new THREE.Object3D();
                this.cometObservatoryPivot.position.set(0, 0, 0);
                this.cometObservatoryPivot.rotation.set(-0.2, 0.2, 0);
                this.scene.add(this.cometObservatoryPivot);

                this.cometObservatory = gltf.scene;
                this.cometObservatory.scale.set(0.0001, 0.0001, 0.0001);
                this.cometObservatory.position.set(-1.2, 0, 0);
                this.cometObservatory.rotation.set(Math.PI/8, 0, 0);
                this.cometObservatoryPivot.add(this.cometObservatory);

                const ringGeometry = new THREE.TorusGeometry(
                    1.2, // torus radius
                    0.001,   // tube radius
                    128, 128,
                    Math.PI * 2 // end angle
                );
                const ringMaterial = new THREE.MeshPhongMaterial({
                    color: 0xb18f01,
                    emissive: new THREE.Color(0xb18f01),
                    side: THREE.DoubleSide,
                });
                this.cometRing = new THREE.Mesh(ringGeometry, ringMaterial);
                this.cometRing.rotation.x = Math.PI / 2; 
                this.cometObservatoryPivot.add(this.cometRing);
            },
            (xhr) => {},
            (error) => {
                console.error('An error happened while loading the comet observatory model:', error);
            }
        );
    }

    // https://tools.wwwtyro.net/space-3d/index.html
    createSkybox(): void {
        // 
        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            'data/maps/globe-3d/skybox/right.png',
            'data/maps/globe-3d/skybox/left.png',
            'data/maps/globe-3d/skybox/top.png',
            'data/maps/globe-3d/skybox/bottom.png',
            'data/maps/globe-3d/skybox/front.png',
            'data/maps/globe-3d/skybox/back.png',
        ]);
        texture.colorSpace = THREE.SRGBColorSpace;
        this.scene.background = texture;
    
    }

    createControls(): void {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.controls.enablePan = false;      
        this.controls.minDistance = 2.5;        
        this.controls.maxDistance = 5.0;

        this.controls.rotateSpeed = 0.6;
        this.controls.zoomSpeed = 0.8;
        this.controls.enableDamping = true;
    }

    animate() {

        if (!this.controls || !this.planet || !this.cometObservatoryPivot || !this.cometObservatory || !this.clouds || !this.moonPivot || !this.moon) {
            this.animationFrameId = requestAnimationFrame(() => this.animate());
            return;
        } 
        
        this.controls.update(); 

        //this.sunPivot.rotation.y += 0.01;
        this.planet.rotation.y += 0.0002;

        this.moonPivot.rotation.y += 0.0005;
        this.moon.rotation.y += 0.001;

        this.cometObservatoryPivot.rotation.y += 0.0005;
        this.cometObservatory.rotation.y += 0.001;

        this.clouds.rotation.y += 0.001;

        this.renderer.render(this.scene, this.camera);

        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }
 
    getZoom(): number {
        return 0;
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

