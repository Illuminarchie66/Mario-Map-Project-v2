import { z } from "zod";

import { PamphletContentSchema, DocContentSchema } from "../../ui/components/Content";
import { PopupContentSchema } from "../../ui/components/Popup";

/*
This is the configuration for a waypoint, describing the details it needs to be rendered with specific content and display type. 
We use zod to validate the data and ensure it is as expected.
*/

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

// waypoint factory to create a waypoint from data, validating it against the schema
export const Waypoint = {
    create(data: unknown): Waypoint {
        const res = WaypointSchema.safeParse(data);
        if (!res.success) {
            throw new Error(`Invalid waypoint data: ${res.error.message}`);
        }
        return res.data;
    }
}