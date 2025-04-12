
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Shield, AlertTriangle, Lock } from "lucide-react";

const SafeViewBrowser = () => {
  const location = useLocation();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBrowsing, setIsBrowsing] = useState(false);
  const [protection, setProtection] = useState({
    javascriptBlocked: true,
    trackingBlocked: true,
    cookiesBlocked: true,
    proxyEnabled: true
  });

  // Extract URL from query params if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlParam = params.get("url");
    if (urlParam) {
      setUrl(urlParam);
    }
  }, [location]);

  const handleLaunch = () => {
    if (!url) return;
    
    setIsLoading(true);
    
    // Simulate loading the sandbox environment
    setTimeout(() => {
      setIsLoading(false);
      setIsBrowsing(true);
    }, 2000);
  };

  const toggleProtection = (key: keyof typeof protection) => {
    setProtection(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-full p-2 bg-pistachio/10">
              <Globe className="h-6 w-6 text-pistachio" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">SafeView Browser</h1>
              <p className="text-muted-foreground">
                Browse suspicious websites safely in an isolated sandbox environment
              </p>
            </div>
          </div>
          
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <CardTitle>SafeView Browser</CardTitle>
              <CardDescription>
                Enter the URL you want to visit in our protected environment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter URL to browse safely..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-grow"
                  />
                  <Button 
                    onClick={handleLaunch}
                    disabled={!url || isLoading}
                    className="bg-pistachio hover:bg-pistachio-dark text-black"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                        Loading...
                      </>
                    ) : "Launch SafeView"}
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { 
                      key: 'javascriptBlocked' as const, 
                      label: 'Block JavaScript', 
                      icon: Shield 
                    },
                    { 
                      key: 'trackingBlocked' as const, 
                      label: 'Block Trackers', 
                      icon: AlertTriangle 
                    },
                    { 
                      key: 'cookiesBlocked' as const, 
                      label: 'Block Cookies', 
                      icon: Shield 
                    },
                    { 
                      key: 'proxyEnabled' as const, 
                      label: 'Enable Proxy', 
                      icon: Lock 
                    }
                  ].map((item) => (
                    <Button
                      key={item.key}
                      type="button"
                      variant={protection[item.key] ? "default" : "outline"}
                      className={`flex items-center justify-center gap-2 ${
                        protection[item.key] ? "bg-pistachio hover:bg-pistachio-dark text-black" : ""
                      }`}
                      onClick={() => toggleProtection(item.key)}
                    >
                      <item.icon className={`h-4 w-4 ${protection[item.key] ? "" : "text-muted-foreground"}`} />
                      <span className="text-xs md:text-sm">{item.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {isBrowsing && (
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 z-10 bg-black/5 backdrop-blur-[1px]"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-black/80 text-white px-4 py-2 rounded-md flex items-center gap-2">
                  <Shield className="h-5 w-5 text-pistachio" />
                  <span>Viewing in protected sandbox mode</span>
                </div>
                
                <div className="bg-white p-4 rounded-md border min-h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-lg font-medium">Sandbox Active</p>
                    <p className="text-muted-foreground">
                      In a real implementation, this would show the website in an iframe or WebView with security protections.
                    </p>
                    <p className="mt-2 text-sm">
                      Currently browsing: <span className="font-mono bg-muted p-1 rounded">{url}</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-md border border-border">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-pistachio" />
                  Security Report
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">JavaScript Blocked:</span> {protection.javascriptBlocked ? '12 potentially harmful scripts' : 'Disabled'}
                  </p>
                  <p>
                    <span className="font-medium">Trackers Blocked:</span> {protection.trackingBlocked ? '8 tracking attempts' : 'Disabled'}
                  </p>
                  <p>
                    <span className="font-medium">Cookies Blocked:</span> {protection.cookiesBlocked ? '15 cookies' : 'Disabled'}
                  </p>
                  <p>
                    <span className="font-medium">IP Protection:</span> {protection.proxyEnabled ? 'Active via proxy' : 'Disabled'}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsBrowsing(false)}
                >
                  Close SafeView
                </Button>
                <Button
                  className="bg-pistachio hover:bg-pistachio-dark text-black"
                  onClick={() => {
                    // In a real app this would generate a report
                    alert("Site analysis report generated!");
                  }}
                >
                  Generate Security Report
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SafeViewBrowser;
