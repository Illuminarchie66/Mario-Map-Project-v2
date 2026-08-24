import { z } from "zod";

import { PamphletContent, PamphletContentSchema, DocContent, DocContentSchema } from "../../ui/components/Content";
import { PopupContent, PopupContentSchema } from "../../ui/components/Popup";

interface WaypointBase {
    id: string;
    coords: [number, number];
    
    assetPath?: string;
    label?: string;
    icon?: string;
}

const WaypointBaseSchema = z.object({
    id: z.string(),
    coords: z.tuple([z.number(), z.number()]),
    assetPath: z.string().optional(),
    label: z.string().optional(),
    icon: z.string().optional()
});

interface PamphletWaypoint extends WaypointBase {
    displayType: "pamphlet";
    content: PamphletContent;
}

const PamphletWaypointSchema = WaypointBaseSchema.extend({
    displayType: z.literal("pamphlet"),
    content: PamphletContentSchema
});

interface PopupWaypoint extends WaypointBase {
    displayType: "popup";
    content: PopupContent;
}

const PopupWaypointSchema = WaypointBaseSchema.extend({
    displayType: z.literal("popup"),
    content: PopupContentSchema
});

interface DocWaypoint extends WaypointBase {
    displayType: "doc";
    content: DocContent;
}

const DocWaypointSchema = WaypointBaseSchema.extend({
    displayType: z.literal("doc"),
    content: DocContentSchema
});

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