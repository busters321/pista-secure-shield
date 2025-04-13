
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { 
  Shield, 
  Users, 
  BarChart3, 
  Settings, 
  Bell, 
  LogOut, 
  Menu,
  X,
  User,
  Link,
  Mail,
  Database,
  Globe,
  AlertTriangle,
  FileText,
  Instagram,
  Key,
  MessageCircle,
  MapPin,
  Settings2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { AdminStats } from "@/components/admin/AdminStats";
import { AdminUsersList } from "@/components/admin/AdminUsersList";
import { AdminScamStats } from "@/components/admin/AdminScamStats";
import { AdminSystemSettings } from "@/components/admin/AdminSystemSettings";
import { AdminUserIPTracker } from "@/components/admin/AdminUserIPTracker";
import { AdminToolsManagement } from "@/components/admin/AdminToolsManagement";

// Define the props interface for AdminToolsManagement
interface AdminToolsManagementProps {
  activeToolTab: string | null;
}

const AdminDashboard = () => {
  const { isAdminAuthenticated, adminLogout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeToolTab, setActiveToolTab] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for notifications
    const interval = setInterval(() => {
      // This would normally check for real notifications
      console.log("Checking for admin notifications...");
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Redirect if not authenticated
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogout = () => {
    adminLogout();
    navigate("/admin");
  };

  const handleToolClick = (tool: string) => {
    setActiveTab("tools");
    setActiveToolTab(tool);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminStats />;
      case "users":
        return <AdminUsersList />;
      case "scams":
        return <AdminScamStats />;
      case "settings":
        return <AdminSystemSettings />;
      case "ip-tracker":
        return <AdminUserIPTracker />;
      case "tools":
        return <AdminToolsManagement activeToolTab={activeToolTab} />;
      default:
        return <AdminStats />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-40 rounded-full shadow-lg md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      
      {/* Sidebar */}
      <div className={`
        bg-white border-r border-gray-200 w-64 fixed h-full transition-all duration-300 ease-in-out z-30
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}>
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-pistachio" />
            <span className="text-xl font-bold">Admin Panel</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4">
          <nav className="space-y-6">
            <div>
              <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Overview</h4>
              <div className="space-y-1">
                <Button
                  variant={activeTab === "dashboard" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("dashboard")}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant={activeTab === "users" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("users")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </Button>
                <Button
                  variant={activeTab === "ip-tracker" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("ip-tracker")}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  IP Tracker
                </Button>
                <Button
                  variant={activeTab === "scams" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("scams")}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Scam Reports
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Tools Management</h4>
              <div className="space-y-1">
                <Button 
                  variant={(activeTab === "tools" && !activeToolTab) ? "secondary" : "ghost"}
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setActiveTab("tools");
                    setActiveToolTab(null);
                  }}
                >
                  <Settings2 className="h-4 w-4 mr-2" />
                  All Tools
                </Button>
                <Button 
                  variant={(activeTab === "tools" && activeToolTab === "scamIntelligence") ? "secondary" : "ghost"} 
                  className="w-full justify-start text-sm"
                  onClick={() => handleToolClick("scamIntelligence")}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Scam Intelligence
                </Button>
                <Button 
                  variant={(activeTab === "tools" && activeToolTab === "linkInspection") ? "secondary" : "ghost"}
                  className="w-full justify-start text-sm"
                  onClick={() => handleToolClick("linkInspection")}
                >
                  <Link className="h-4 w-4 mr-2" />
                  Link Inspection
                </Button>
                <Button 
                  variant={(activeTab === "tools" && activeToolTab === "emailScanner") ? "secondary" : "ghost"}
                  className="w-full justify-start text-sm"
                  onClick={() => handleToolClick("emailScanner")}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Scanner
                </Button>
                <Button 
                  variant={(activeTab === "tools" && activeToolTab === "cyberCopilot") ? "secondary" : "ghost"}
                  className="w-full justify-start text-sm"
                  onClick={() => handleToolClick("cyberCopilot")}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Cyber Copilot
                </Button>
                <Button 
                  variant={(activeTab === "tools" && activeToolTab === "safeView") ? "secondary" : "ghost"}
                  className="w-full justify-start text-sm"
                  onClick={() => handleToolClick("safeView")}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  SafeView Browser
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Admin</h4>
              <div className="space-y-1">
                <Button
                  variant={activeTab === "settings" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "md:ml-64" : ""}`}>
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-20">
          <h1 className="text-xl font-semibold">
            {activeTab === "dashboard" && "Admin Dashboard"}
            {activeTab === "users" && "User Management"}
            {activeTab === "scams" && "Scam Reports"}
            {activeTab === "settings" && "System Settings"}
            {activeTab === "ip-tracker" && "User IP Tracker"}
            {activeTab === "tools" && (
              <>Tools Management {activeToolTab && `- ${activeToolTab.replace(/([A-Z])/g, ' $1').trim()}`}</>
            )}
          </h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </header>
        
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
