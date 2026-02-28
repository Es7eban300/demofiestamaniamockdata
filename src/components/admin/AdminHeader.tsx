import { Bell, User } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-10 h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-3">
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-pink-500" />
        </button>
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <User className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
