import { useEffect } from "react";
import { useStore } from "@/core/state/store";
import { FilterSection } from "@/components/panels/FilterPanel";
import { Info } from "lucide-react";

import { IntelTab } from "./IntelTab";
import { CacheTab } from "./CacheTab";
import { OverlayTab } from "./OverlayTab";
import { sectionHeaderStyle } from "./sharedStyles";

export function DataConfigPanel() {
    const configPanelOpen = useStore((s) => s.configPanelOpen);
    const selectedEntity = useStore((s) => s.selectedEntity);
    const activeTab = useStore((s) => s.activeConfigTab);
    const setActiveTab = useStore((s) => s.setActiveConfigTab);

    // Auto-switch to Intel tab when an entity is selected
    useEffect(() => {
        if (selectedEntity && activeTab !== "intel") {
            setActiveTab("intel");
        }
    }, [selectedEntity, activeTab, setActiveTab]);

    return (
        <aside
            className={`sidebar sidebar--right glass-panel ${configPanelOpen ? "" : "sidebar--closed"}`}
            style={{ width: 320, padding: "var(--space-xl)", zIndex: 101, borderLeft: "var(--glass-border)" }}
        >
            <div className="sidebar__title" style={{ marginBottom: "var(--space-md)", color: "var(--text-primary)", fontSize: "14px", fontWeight: 600 }}>
                Data Configuration
            </div>

            <div className="panel-tabs">
                <button
                    className={`panel-tab ${activeTab === "intel" ? "panel-tab--active" : ""}`}
                    onClick={() => setActiveTab("intel")}
                >
                    <Info size={12} style={{ marginRight: 4 }} />
                    Intel
                </button>
                <button
                    className={`panel-tab ${activeTab === "filters" ? "panel-tab--active" : ""}`}
                    onClick={() => setActiveTab("filters")}
                >
                    Filters
                </button>
                <button
                    className={`panel-tab ${activeTab === "cache" ? "panel-tab--active" : ""}`}
                    onClick={() => setActiveTab("cache")}
                >
                    Cache & Limits
                </button>
                <button
                    className={`panel-tab ${activeTab === "overlay" ? "panel-tab--active" : ""}`}
                    onClick={() => setActiveTab("overlay")}
                >
                    Config & Overlay
                </button>
            </div>

            {activeTab === "intel" && (
                <div style={{ marginBottom: "var(--space-lg)" }}>
                    <div style={sectionHeaderStyle}>Intelligence</div>
                    <IntelTab />
                </div>
            )}

            {activeTab === "filters" && (
                <div style={{ marginBottom: "var(--space-lg)" }}>
                    <div style={sectionHeaderStyle}>Entity Filters</div>
                    <FilterSection />
                </div>
            )}

            {activeTab === "cache" && <CacheTab />}
            {activeTab === "overlay" && <OverlayTab />}
        </aside>
    );
}
