import * as L from 'leaflet';
import { getPortableURL } from '../../core/portableURL';

export interface IconIdentifier {
    iconPath: string;
    iconSize: [number, number];
    iconAnchor?: [number, number];

    shadowPath?: string;
    shadowSize?: [number, number];
    shadowAnchor?: [number, number];

    popupAnchor?: [number, number];
    
    static?: boolean;
    staticScale?: number;
}

class IconRegistry {
    private readonly defaultIcons: Record<string, IconIdentifier> = {
        "default": {
            //iconPath: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            iconPath: '/assets/core/images/marker.png',
            iconSize: [25, 41],
            iconAnchor: [12.5, 41],
            
            shadowPath: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            shadowSize: [41, 41],
            
            popupAnchor: [1.5, -34],
        },
    }

    private readonly toadTownIcons: Record<string, IconIdentifier> = {
        "mushroom": {
            iconPath: '/data/maps/toad-town/assets/icons/red-icon.png',
            shadowPath: '/data/maps/toad-town/assets/icons/marker-shadow.png',
            iconSize: [53.6, 86.4], 
            shadowSize: [75, 80], 
            iconAnchor: [26.8, 86.4], 
            shadowAnchor: [22, 81],
            popupAnchor: [1.5, -56]
        },

        "flower": {
            iconPath: '/data/maps/toad-town/assets/icons/flower-icon.png',
            shadowPath: '/data/maps/toad-town/assets/icons/marker-shadow.png',
            iconSize: [53.6, 86.4], 
            shadowSize: [75, 80], 
            iconAnchor: [26.8, 86.4], 
            shadowAnchor: [22, 81],
            popupAnchor: [1.5, -56]
        },

        "golf": {
            iconPath: '/data/maps/toad-town/assets/icons/golf-icon.png',
            shadowPath: '/data/maps/toad-town/assets/icons/marker-shadow.png',
            iconSize: [53.6, 86.4], 
            shadowSize: [75, 80], 
            iconAnchor: [26.8, 86.4], 
            shadowAnchor: [22, 81],
            popupAnchor: [1.5, -56]
        },

        mario: {
            iconPath: '/data/maps/toad-town/assets/icons/mario-icon.png',
            shadowPath: '/data/maps/toad-town/assets/icons/marker-shadow.png',
            iconSize: [53.6, 86.4], 
            shadowSize: [75, 80], 
            iconAnchor: [26.8, 86.4], 
            shadowAnchor: [22, 81],
            popupAnchor: [1.5, -56]
        },
        peach: {
            iconPath: '/data/maps/toad-town/assets/icons/peach-icon.png',
            shadowPath: '/data/maps/toad-town/assets/icons/marker-shadow.png',
            iconSize: [53.6, 86.4], 
            shadowSize: [75, 80], 
            iconAnchor: [26.8, 86.4], 
            shadowAnchor: [22, 81],
            popupAnchor: [1.5, -56]
        },
        pipe: {
            iconPath: '/data/maps/toad-town/assets/icons/pipe-icon.png',
            shadowPath: '/data/maps/toad-town/assets/icons/marker-shadow.png',
            iconSize: [53.6, 86.4], 
            shadowSize: [75, 80], 
            iconAnchor: [26.8, 86.4], 
            shadowAnchor: [22, 81],
            popupAnchor: [1.5, -56]
        },
        star: {
            iconPath: '/data/maps/toad-town/assets/icons/star-icon.png',
            shadowPath: '/data/maps/toad-town/assets/icons/marker-shadow.png',
            iconSize: [53.6, 86.4], 
            shadowSize: [75, 80], 
            iconAnchor: [26.8, 86.4], 
            shadowAnchor: [22, 81],
            popupAnchor: [1.5, -56]
        },
        tennis: {
            iconPath: '/data/maps/toad-town/assets/icons/tennis-icon.png',
            shadowPath: '/data/maps/toad-town/assets/icons/marker-shadow.png',
            iconSize: [53.6, 86.4], 
            shadowSize: [75, 80], 
            iconAnchor: [26.8, 86.4], 
            shadowAnchor: [22, 81],
            popupAnchor: [1.5, -56]
        },
        vehicle: {
            iconPath: '/data/maps/toad-town/assets/icons/vehicle-icon.png',
            shadowPath: '/data/maps/toad-town/assets/icons/marker-shadow.png',
            iconSize: [53.6, 86.4], 
            shadowSize: [75, 80], 
            iconAnchor: [26.8, 86.4], 
            shadowAnchor: [22, 81],
            popupAnchor: [1.5, -56]
        },
    }

    private readonly mushroomContinentIcons: Record<string, IconIdentifier> = {
        "aerial-road": {
            iconPath: "/data/maps/mushroom-continent/assets/landmarks/Aerial_RoadSky_Arena.png",
            
            iconSize: [12, 12],
            iconAnchor: [0, 0],
            popupAnchor: [0, -50],
            
            static: true,
            staticScale: 1
        },
        "bean-bean-castle": {
            iconPath: "/data/maps/mushroom-continent/assets/landmarks/Beanbean_Castle.png",

            iconSize: [12, 12],
            iconAnchor: [0, 0],
            popupAnchor: [0, -20],
            
            static: true,
            staticScale: 1
        },
        "bloopers-secret-lair": {
            iconPath: "/data/maps/mushroom-continent/assets/landmarks/Bloopers_Secret_Lair.png",

            iconSize: [12, 12],
            iconAnchor: [0, 0],
            popupAnchor: [0, -20],
            
            static: true,
            staticScale: 1
        },
        "booster-tower": {
            iconPath: "/data/maps/mushroom-continent/assets/landmarks/Booster_Tower.png",

            iconSize: [12, 12],
            iconAnchor: [0, 0],
            popupAnchor: [0, -20],
            
            static: true,
            staticScale: 1
        },
        "forest-maze": {
            iconPath: "/data/maps/mushroom-continent/assets/landmarks/Forest_Maze.png",

            iconSize: [12, 12],
            iconAnchor: [0, 0],
            popupAnchor: [0, -20],
            
            static: true,
            staticScale: 1
        },
        "fuzzy-clifftop": {
            iconPath: "/data/maps/mushroom-continent/assets/landmarks/Fuzzy_Clifftop.png",

            iconSize: [12, 12],
            iconAnchor: [0, 0],
            popupAnchor: [0, -20],
            
            static: true,
            staticScale: 1
        },
        "great-acorn-tree": {
            iconPath: "/data/maps/mushroom-continent/assets/landmarks/Great_Acorn_Tree.png",

            iconSize: [12, 12],
            iconAnchor: [0, 0],
            popupAnchor: [0, -20],
            
            static: true,
            staticScale: 1
        },
        "haunted-shipwreck": {
            iconPath: "/data/maps/mushroom-continent/assets/landmarks/Haunted_Shipwreck.png",

            iconSize: [12, 12],
            iconAnchor: [0, 0],
            popupAnchor: [0, -20],
            
            static: true,
            staticScale: 1
        },
        "ludwigs-clockwork-castle": {
            iconPath: "/data/maps/mushroom-continent/assets/landmarks/Ludwigs_Clockwork_Castle.png",

            iconSize: [12, 12],
            iconAnchor: [0, 0],
            popupAnchor: [0, -20],
            
            static: true,
            staticScale: 1
        },
        "magma-mine": {
            iconPath: "/data/maps/mushroom-continent/assets/landmarks/Magma_Mine.png",

            iconSize: [12, 12],
            iconAnchor: [0, 0],
            popupAnchor: [0, -20],
            
            static: true,
            staticScale: 1
        },
        "marrymore-chapel": {
            iconPath: "/data/maps/mushroom-continent/assets/landmarks/Marrymore_Chapel.png",

            iconSize: [12, 12],
            iconAnchor: [0, 0],
            popupAnchor: [0, -20],
            
            static: true,
            staticScale: 1
        },
        "mole-mines": {
            iconPath: "/data/maps/mushroom-continent/assets/landmarks/Mole_Mines.png",

            iconSize: [12, 12],
            iconAnchor: [0, 0],
            popupAnchor: [0, -20],
            
            static: true,
            staticScale: 1
        },
        "nimbus-castle": {
            iconPath: "/data/maps/mushroom-continent/assets/landmarks/Nimbus_Castle.png",

            iconSize: [12, 12],
            iconAnchor: [0, 0],
            popupAnchor: [0, -20],
            
            static: true,
            staticScale: 1
        },
        "rose-town": {
            iconPath: "/data/maps/mushroom-continent/assets/landmarks/Rose_Town.png",
            
            iconSize: [12, 12],
            iconAnchor: [0, 0],
            popupAnchor: [0, -20],
            
            static: true,
            staticScale: 1
        },
        "rudys-castle": {
            iconPath: "/data/maps/mushroom-continent/assets/landmarks/Rudys_Castle.png",

            iconSize: [12, 12],
            iconAnchor: [0, 0],
            popupAnchor: [0, -20],
            
            static: true,
            staticScale: 1
        },
        "seaside-town": {
            iconPath: "/data/maps/mushroom-continent/assets/landmarks/Seaside_Town.png",

            iconSize: [12, 12],
            iconAnchor: [0, 0],
            popupAnchor: [0, -20],
            
            static: true,
            staticScale: 1
        },
        "sky-high-coaster": {
            iconPath: "/data/maps/mushroom-continent/assets/landmarks/Sky_High_Coaster.png",

            iconSize: [12, 12],
            iconAnchor: [0, 0],
            popupAnchor: [0, -20],
            
            static: true,
            staticScale: 1
        },
        "skyward-stalk": {
            iconPath: "/data/maps/mushroom-continent/assets/landmarks/Skyward_Stalk.png",

            iconSize: [12, 12],
            iconAnchor: [0, 0],
            popupAnchor: [0, -20],
            
            static: true,
            staticScale: 1
        },
        "spikes-sprouting-sands": {
            iconPath: "/data/maps/mushroom-continent/assets/landmarks/Spikes_Sprouting_Sands.png",

            iconSize: [12, 12],
            iconAnchor: [0, 0],
            popupAnchor: [0, -20],
            
            static: true,
            staticScale: 1
        },
        "spinning-star-sky": {
            iconPath: "/data/maps/mushroom-continent/assets/landmarks/Spinning-Star_Sky.png",

            iconSize: [12, 12],
            iconAnchor: [0, 0],
            popupAnchor: [0, -20],
            
            static: true,
            staticScale: 1
        },
        "sunshine-airport": {
            iconPath: "/data/maps/mushroom-continent/assets/landmarks/Sunshine_Airport.png",

            iconSize: [12, 12],
            iconAnchor: [0, 0],
            popupAnchor: [0, -20],
            
            static: true,
            staticScale: 1
        },
        "whimsical-waters": {
            iconPath: "/data/maps/mushroom-continent/assets/landmarks/Whimsical_Waters.png",

            iconSize: [12, 12],
            iconAnchor: [0, 0],
            popupAnchor: [0, -20],
            
            static: true,
            staticScale: 1
        },
        "world-1-4-3d-land": {
            iconPath: "/data/maps/mushroom-continent/assets/landmarks/World_1-4_3D_Land.png",

            iconSize: [12, 12],
            iconAnchor: [0, 0],
            popupAnchor: [0, -20],
            
            static: true,
            staticScale: 1
        },
        "world-3-1-3d-land": {
            iconPath: "/data/maps/mushroom-continent/assets/landmarks/World_3-1_3D_Land.png",

            iconSize: [12, 12],
            iconAnchor: [0, 0],
            popupAnchor: [0, -20],
            
            static: true,
            staticScale: 1
        },
        "yoshi-park": {
            iconPath: "/data/maps/mushroom-continent/assets/landmarks/Yoshi_Park.png",

            iconSize: [12, 12],
            iconAnchor: [0, 0],
            popupAnchor: [0, -20],
            
            static: true,
            staticScale: 1
        }
    };

    private readonly mkwIcons: Record<string, IconIdentifier> = {
        // Mario Kart World Icons
        "acorn-heights": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Acorn_Heights.png",
            
            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "airship-fortress": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Airship_Fortress.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "boo-cinema": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Boo_Cinema.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "bowsers-castle": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Bowsers_Castle.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "cheep-cheep-falls": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Cheep_Cheep_Falls.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "choco-mountain": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Choco_Mountain.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "crown-city": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Crown_City.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "dandelion-depths": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Dandelion_Depths.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "desert-hills": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Desert_Hills.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "dino-dino-jungle": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Dino_Dino_Jungle.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "dk-pass": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_DK_Pass.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "dk-space-port": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_DK_Spaceport.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "dry-bones-burnout": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Dry_Bones_Burnout.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "faraway-oasis": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Faraway_Oasis.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "great-question-block-ruins": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Great_Question_Block_Ruins.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "koopa-troopa-beach": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Koopa_Troopa_Beach.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "mario-bros-circuit": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Mario_Bros_Circuit.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "mario-circuit": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Mario_Circuit.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "moo-moo-meadows": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Moo_Moo_Meadows.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "peach-beach": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Peach_Beach.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "peach-stadium": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Peach_Stadium.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "rainbow-road": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Rainbow_Road.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "salty-salty-speedway": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Salty_Salty_Speedway.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "shy-guy-bazaar": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Shy_Guy_Bazaar.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "sky-high-sundae": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Sky-High_Sundae.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "starview-peak": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Starview_Peak.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "toads-factory": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Toads_Factory.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "wario-shipyard": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Wario_Shipyard.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "wario-stadium": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Wario_Stadium.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        },
        "whistlestop-summit": {
            iconPath: "/data/maps/mario-kart-world/assets/landmarks/MKWorld_Icon_Whistlestop_Summit.png",

            iconSize: [130, 130],
            iconAnchor: [65, 65],
            popupAnchor: [0, -20],
        }
    };

    private readonly icons: Record<string, IconIdentifier> = {
        ...this.defaultIcons,
        ...this.toadTownIcons,
        ...this.mushroomContinentIcons,
        ...this.mkwIcons,
    };

    getById(id?: string): IconIdentifier {
        if (!id || !(id in this.icons)) id = "default";
        const icon = this.icons[id];
        if (!icon) 
            throw new Error(`Icon with id "${id}" not found in registry.`);

        return icon;
    }

    createIcon(data: IconIdentifier): L.Icon {
        const icon = L.icon({
            iconUrl: getPortableURL(data.iconPath),
            iconSize: data.iconSize,
            iconAnchor: data.iconAnchor,
            shadowUrl: data.shadowPath ? getPortableURL(data.shadowPath) : undefined,
            shadowSize: data.shadowSize,
            shadowAnchor: data.shadowAnchor,
            popupAnchor: data.popupAnchor
        })

        return icon;
    }
}

export const iconRegistry = new IconRegistry();