import * as L from 'leaflet';
import z from 'zod';
import '../../../css/ui/waypoints.css';
import { Registry } from "../../core/Registry";
import { getPortableURL, loadData } from '../../core/Loader';

const IconIdentifierSchema = z.object({
    id: z.string(),
    iconPath: z.string(),
    iconSize: z.tuple([z.number(), z.number()]),    
    iconAnchor: z.tuple([z.number(), z.number()]).optional(),
    
    shadowPath: z.string().optional(),
    shadowSize: z.tuple([z.number(), z.number()]).optional(),
    shadowAnchor: z.tuple([z.number(), z.number()]).optional(),

    popupAnchor: z.tuple([z.number(), z.number()]).optional(),
    static: z.boolean().optional(),
    staticScale: z.number().optional()
})
export type IconIdentifier = z.infer<typeof IconIdentifierSchema>;

/*
The registry for all maps in the application.
It contains a list of all maps with their ids, and corresponding details of paths, size, anchor, and shadows. Also data on if its static or not.
It is broken down into different groups of icons for different maps, such as Toad Town and Mushroom Continent.
*/
export class IconRegistry extends Registry<IconIdentifier> {
    constructor(icons: IconIdentifier[]) {
        super();
        icons.forEach(icon => {
            this.register(icon.id, icon);
        });
    }

    static async create(): Promise<IconRegistry> {
        const data = await loadData<IconIdentifier[]>("/data/core/icons.json5");
        const icons = data || [];
        return new IconRegistry(icons);
    }

    createIcon(data: IconIdentifier): L.Icon {
        return L.icon({
            iconUrl: getPortableURL(data.iconPath),
            iconSize: data.iconSize,
            iconAnchor: data.iconAnchor,
            shadowUrl: data.shadowPath ? getPortableURL(data.shadowPath) : undefined,
            shadowSize: data.shadowSize,
            shadowAnchor: data.shadowAnchor,
            popupAnchor: data.popupAnchor
        })
    }
}