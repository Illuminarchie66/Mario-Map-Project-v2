import * as L from 'leaflet';

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
    private readonly icons: Record<string, IconIdentifier> = {
        "default": {
            iconPath: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            iconSize: [25, 41],
            iconAnchor: [12.5, 41],
            
            shadowPath: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            shadowSize: [41, 41],
            
            popupAnchor: [1.5, -34],
        }
    };

    getById(id: string): IconIdentifier {
        const icon = this.icons[id];
        if (!icon) 
            throw new Error(`Icon with id "${id}" not found in registry.`);

        return icon;
    }

    createIcon(data: IconIdentifier): L.Icon {
        return L.icon({
            iconUrl: data.iconPath,
            iconSize: data.iconSize,
            iconAnchor: data.iconAnchor,
            shadowUrl: data.shadowPath,
            shadowSize: data.shadowSize,
            shadowAnchor: data.shadowAnchor,
            popupAnchor: data.popupAnchor
        })
    }
}

export const iconRegistry = new IconRegistry();