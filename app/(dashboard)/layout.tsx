import { Sidebar } from "@/components/layout/Sidebar";
import { KnowledgeStreamBackground } from "@/components/ui/KnowledgeStreamBackground";
import React from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <KnowledgeStreamBackground />
            <Sidebar />

            <main className="flex-1 overflow-y-auto p-8 md:p-12 md:ml-64 relative z-10">
                {/* Top HUD Line */}
                <div className="fixed top-0 left-64 right-0 h-[1px] bg-gradient-to-r from-cyan-500/30 via-transparent to-transparent z-20" />

                {children}
            </main>
        </div>
    );
}
