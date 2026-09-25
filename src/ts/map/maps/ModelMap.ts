
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {ModelMapConfig } from "../MapConfig";
import { _Map } from "./Map";
import { getPortableURL } from '../../core/portableURL';

export abstract class ModelMap extends _Map<ModelMapConfig> {
    textureLoader: THREE.TextureLoader;
    gltfLoader: GLTFLoader;
    cubeTextureLoader: THREE.CubeTextureLoader;

    scene: THREE.Scene;

    constructor(config: ModelMapConfig) {
        super(config);

        this.textureLoader = new THREE.TextureLoader();
        this.gltfLoader = new GLTFLoader();
        this.cubeTextureLoader = new THREE.CubeTextureLoader();

        this.scene = new THREE.Scene();
    }

    loadTexture(url: string): Promise<THREE.Texture> {
        return new Promise((resolve, reject) => {
            this.textureLoader.load(
                getPortableURL(url),
                texture => resolve(texture),
                undefined,
                error => reject(error)
            );  
        });
    }

    loadGLTF(url: string): Promise<THREE.Group> {
        return new Promise((resolve, reject) => {
            this.gltfLoader.load(
                getPortableURL(url),
                gltf => resolve(gltf.scene),
                undefined,
                error => reject(error)
            );
        });
    }

    loadCubeTexture(urls: string[]): Promise<THREE.CubeTexture> {
        const portableUrls = urls.map(url => getPortableURL(url));
        console.log(portableUrls);
        return new Promise((resolve, reject) => {
            this.cubeTextureLoader.load(
                urls,
                texture => resolve(texture),
                undefined,
                error => reject(error)
            );
        });
    }

    abstract init(): Promise<void>;

    abstract getZoom(): number 

    abstract getCenter(): { lat: number, lng: number }

    abstract setupWaypoints(): void

    abstract addMarker(waypoint: any, icon: any): void

    abstract destroy(): void
}

