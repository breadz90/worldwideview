import { useEffect } from "react";
import type { Viewer as CesiumViewer, Entity as CesiumEntity } from "cesium";
import { Cartesian3 } from "cesium";

export function useSelectionAnchor(
    viewer: CesiumViewer | null,
    isReady: boolean,
    selectedEntity: any,
    selectionEntityRef: React.MutableRefObject<CesiumEntity | null>
) {
    // Initialization of Selection Entity
    useEffect(() => {
        if (!viewer || viewer.isDestroyed() || !isReady) return;

        let entity: CesiumEntity | null = null;
        try {
            // Create a hidden entity for camera tracking/flying
            if (!viewer.entities) {
                console.warn("[GlobeView] Viewer entities collection not available during selection anchor init");
                return;
            }

            entity = viewer.entities.add({
                id: "__wwv_selection_anchor",
                point: {
                    pixelSize: 0,
                }
            });
            selectionEntityRef.current = entity;
        } catch (error) {
            console.warn("[GlobeView] Error accessing viewer entities:", error);
            return;
        }

        return () => {
            try {
                if (viewer && !viewer.isDestroyed() && viewer.entities && entity) {
                    viewer.entities.remove(entity);
                }
            } catch (error) {
                // Ignore cleanup errors if viewer is partially destroyed
            }
        };
    }, [viewer, isReady, selectionEntityRef]);

    // Update Selection Entity Position
    useEffect(() => {
        const selectionEntity = selectionEntityRef.current;
        if (!selectionEntity || !selectedEntity) return;

        selectionEntity.position = Cartesian3.fromDegrees(
            selectedEntity.longitude,
            selectedEntity.latitude,
            selectedEntity.altitude || 0
        ) as any;
    }, [selectedEntity, selectionEntityRef]);
}
