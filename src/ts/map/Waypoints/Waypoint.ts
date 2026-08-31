import { z } from "zod";

import { PamphletContent, PamphletContentSchema, DocContent, DocContentSchema } from "../../ui/components/Content";
import { PopupContent, PopupContentSchema } from "../../ui/components/Popup";

interface WaypointBase {
    id: string;
    coords: [number, number];
    
    path?: string;
    label?: string;
    icon?: string;
}

const WaypointBaseSchema = z.object({
    id: z.string(),
    coords: z.tuple([z.number(), z.number()]),
    path: z.string().optional(),
    label: z.string().optional(),
    icon: z.string().optional(),
    layerId: z.string().optional()
});

const PamphletWaypointSchema = WaypointBaseSchema.extend({
    displayType: z.literal("pamphlet"),
    content: PamphletContentSchema
});

const PopupWaypointSchema = WaypointBaseSchema.extend({
    displayType: z.literal("popup"),
    content: PopupContentSchema,
    markerCoords: z.tuple([z.number(), z.number()]).optional()
});

const DocWaypointSchema = WaypointBaseSchema.extend({
    displayType: z.literal("doc"),
    content: DocContentSchema
});

export type PamphletWaypoint = z.infer<typeof PamphletWaypointSchema>;
export type PopupWaypoint = z.infer<typeof PopupWaypointSchema>;
export type DocWaypoint = z.infer<typeof DocWaypointSchema>;

const WaypointSchema = z.discriminatedUnion("displayType", [
    PamphletWaypointSchema,
    PopupWaypointSchema,
    DocWaypointSchema
]);

export type Waypoint = z.infer<typeof WaypointSchema>;

export const Waypoint = {
    create(data: unknown): Waypoint {
        const res = WaypointSchema.safeParse(data);
        if (!res.success) {
            throw new Error(`Invalid waypoint data: ${res.error.message}`);
        }
        return res.data;
    }
}