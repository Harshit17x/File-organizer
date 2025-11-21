import { Settings } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <div className="p-6 rounded-full bg-white/5 text-gray-400">
                <Settings size={48} />
            </div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-gray-400">App settings and preferences.</p>
        </div>
    );
}
