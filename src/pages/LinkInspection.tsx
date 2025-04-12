
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, ExternalLink, ShieldAlert, CheckCircle, AlertTriangle } from "lucide-react";

type LinkAnalysisResult = {
  originalUrl: string;
  finalUrl: string;
  redirectCount: number;
  trustRating: 'safe' | 'suspicious' | 'dangerous';
  score: number;
  reasons: string[];
  domainAge?: string;
  ssl?: boolean;
};

const LinkInspection = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LinkAnalysisResult | null>(null);

  const handleAnalyze = () => {
    if (!url) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const isSuspicious = url.includes("bit.ly") || url.includes("goo.gl") || url.includes("tiny");
      const isDangerous = url.includes("free") || url.includes("prize") || url.includes("win");
      
      let mockResult: LinkAnalysisResult;
      
      if (isDangerous) {
        mockResult = {
          originalUrl: url,
          finalUrl: url.replace("bit.ly/", "malicious-site.com/"),
          redirectCount: 3,
          trustRating: 'dangerous',
          score: 85,
          reasons: [
            "Domain registered in the last 24 hours",
            "Multiple suspicious redirects",
            "Contains phishing keywords",
            "Missing SSL certificate"
          ],
          domainAge: "1 day",
          ssl: false
        };
      } else if (isSuspicious) {
        mockResult = {
          originalUrl: url,
          finalUrl: url.replace("bit.ly/", "ad-site.com/"),
          redirectCount: 2,
          trustRating: 'suspicious',
          score: 45,
          reasons: [
            "URL shortener detected",
            "Redirects to different domain",
            "Domain has mixed reputation"
          ],
          domainAge: "3 months",
          ssl: true
        };
      } else {
        mockResult = {
          originalUrl: url,
          finalUrl: url,
          redirectCount: 0,
          trustRating: 'safe',
          score: 15,
          reasons: [
            "Established domain",
            "No suspicious redirects",
            "Valid SSL certificate"
          ],
          domainAge: "5+ years",
          ssl: true
        };
      }
      
      setResult(mockResult);
      setIsLoading(false);
    }, 1500);
  };

  const getRatingColor = (rating: 'safe' | 'suspicious' | 'dangerous') => {
    switch (rating) {
      case 'safe': return "text-success border-success bg-success/10";
      case 'suspicious': return "text-warning border-warning bg-warning/10";
      case 'dangerous': return "text-destructive border-destructive bg-destructive/10";
    }
  };

  const getRatingIcon = (rating: 'safe' | 'suspicious' | 'dangerous') => {
    switch (rating) {
      case 'safe': return <CheckCircle className="h-5 w-5 text-success" />;
      case 'suspicious': return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'dangerous': return <ShieldAlert className="h-5 w-5 text-destructive" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Deep Link Inspection</h1>
          <p className="text-muted-foreground mb-8">
            Analyze URLs to detect redirects, check domain reputation, and identify potentially harmful websites.
          </p>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Check Link Safety</CardTitle>
              <CardDescription>
                Enter any URL to analyze its safety and behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter URL to analyze..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-grow"
                  />
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={!url || isLoading}
                    className="bg-pistachio hover:bg-pistachio-dark text-black"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                        Analyzing...
                      </>
                    ) : "Analyze Link"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {result && (
            <Card className="shadow-lg">
              <CardHeader>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getRatingColor(result.trustRating)}`}>
                  {getRatingIcon(result.trustRating)}
                  <span className="font-medium capitalize">{result.trustRating}</span>
                  <span className="text-sm">({result.score}% risk)</span>
                </div>
                <CardTitle className="mt-4">Link Analysis Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Original URL</p>
                    <div className="p-3 bg-muted rounded-md flex items-center gap-2 text-muted-foreground">
                      <Link className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm break-all">{result.originalUrl}</span>
                    </div>
                  </div>
                  
                  {result.originalUrl !== result.finalUrl && (
                    <div>
                      <p className="text-sm font-medium mb-1">Final Destination</p>
                      <div className="p-3 bg-muted rounded-md flex items-center gap-2 text-muted-foreground">
                        <ExternalLink className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm break-all">{result.finalUrl}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        This link follows {result.redirectCount} redirect(s) before reaching its final destination
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                      <p className="text-sm font-medium mb-2">Domain Age</p>
                      <p>{result.domainAge}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">SSL Security</p>
                      <p>{result.ssl ? "Valid certificate" : "Invalid or missing"}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Risk Factors</p>
                    <ul className="space-y-2">
                      {result.reasons.map((reason, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1 text-xs bg-secondary rounded-full p-0.5 text-muted-foreground">
                            {i + 1}
                          </span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-4 flex gap-3">
                    <Button className="flex-1" variant="outline" onClick={() => setResult(null)}>
                      Check Another Link
                    </Button>
                    <Button 
                      className="flex-1 bg-pistachio hover:bg-pistachio-dark text-black"
                      onClick={() => window.open(`/safe-view?url=${encodeURIComponent(result.originalUrl)}`, "_blank")}
                    >
                      Open in SafeView
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LinkInspection;
