
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Instagram, MessageSquare, AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";

type PlatformType = "instagram" | "telegram" | "whatsapp" | "tiktok";
type TrustLevel = "trusted" | "suspicious" | "scam" | null;

interface ProfileAnalysisResult {
  username: string;
  platform: PlatformType;
  trustLevel: TrustLevel;
  score: number;
  accountAge: string;
  followers: number;
  redFlags: string[];
  recommendation: string;
}

const SocialMediaProtection = () => {
  const [platform, setPlatform] = useState<PlatformType>("instagram");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ProfileAnalysisResult | null>(null);

  const handleAnalyze = () => {
    if (!username) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate mock result
      const suspicious = username.includes("official") || username.includes("support") || username.includes("verify");
      const scam = username.includes("winner") || username.includes("prize") || username.includes("giveaway");
      
      let mockResult: ProfileAnalysisResult;
      
      if (scam) {
        mockResult = {
          username,
          platform,
          trustLevel: "scam",
          score: 95,
          accountAge: "2 days",
          followers: 34,
          redFlags: [
            "Account created very recently",
            "Suspicious follower patterns",
            "Uses language associated with scams",
            "Profile claims to represent an official entity",
            "Multiple reports from other users"
          ],
          recommendation: "This profile has strong indicators of being a scam account. Block and report immediately."
        };
      } else if (suspicious) {
        mockResult = {
          username,
          platform,
          trustLevel: "suspicious",
          score: 65,
          accountAge: "3 months",
          followers: 742,
          redFlags: [
            "Relatively new account",
            "Some suspicious activity patterns",
            "Uses keywords often found in misleading accounts"
          ],
          recommendation: "Exercise caution when interacting with this account. Verify through official channels before sharing any personal information."
        };
      } else {
        mockResult = {
          username,
          platform,
          trustLevel: "trusted",
          score: 15,
          accountAge: "3+ years",
          followers: 12600,
          redFlags: [],
          recommendation: "This account appears legitimate based on our analysis. Always remain vigilant when interacting online."
        };
      }
      
      setResult(mockResult);
      setIsLoading(false);
    }, 1500);
  };

  const getTrustColor = (level: TrustLevel) => {
    switch (level) {
      case "trusted": return "text-success border-success bg-success/10";
      case "suspicious": return "text-warning border-warning bg-warning/10";
      case "scam": return "text-destructive border-destructive bg-destructive/10";
      default: return "";
    }
  };

  const getTrustIcon = (level: TrustLevel) => {
    switch (level) {
      case "trusted": return <CheckCircle className="h-5 w-5 text-success" />;
      case "suspicious": return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "scam": return <ShieldAlert className="h-5 w-5 text-destructive" />;
      default: return null;
    }
  };

  const getPlatformIcon = (platform: PlatformType) => {
    switch (platform) {
      case "instagram": return Instagram;
      case "telegram": 
      case "whatsapp": 
      case "tiktok": 
      default: return MessageSquare;
    }
  };

  const PlatformIcon = getPlatformIcon(platform);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Social Media Protection</h1>
          <p className="text-muted-foreground mb-8">
            Identify fake profiles and potential scam accounts across popular social media platforms.
          </p>
          
          {!result ? (
            <Card>
              <CardHeader>
                <CardTitle>Scan Social Media Profile</CardTitle>
                <CardDescription>
                  Enter profile details to check for scam indicators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="instagram" onValueChange={(value) => setPlatform(value as PlatformType)}>
                  <TabsList className="grid grid-cols-4">
                    <TabsTrigger value="instagram">Instagram</TabsTrigger>
                    <TabsTrigger value="telegram">Telegram</TabsTrigger>
                    <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
                    <TabsTrigger value="tiktok">TikTok</TabsTrigger>
                  </TabsList>
                  
                  <div className="mt-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Username or Profile Link</label>
                        <Input
                          placeholder={`Enter ${platform} username...`}
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                      
                      <Button
                        onClick={handleAnalyze}
                        disabled={!username || isLoading}
                        className="w-full bg-pistachio hover:bg-pistachio-dark text-black"
                      >
                        {isLoading ? (
                          <>
                            <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                            Analyzing...
                          </>
                        ) : "Analyze Profile"}
                      </Button>
                    </div>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg">
              <CardHeader>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getTrustColor(result.trustLevel)}`}>
                  {getTrustIcon(result.trustLevel)}
                  <span className="font-medium capitalize">{result.trustLevel}</span>
                  <span className="text-sm">({result.score}% risk)</span>
                </div>
                <CardTitle className="mt-4">Profile Analysis Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-secondary h-16 w-16 flex items-center justify-center">
                    <PlatformIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-lg">@{result.username}</p>
                    <p className="text-muted-foreground capitalize">{result.platform}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Account Age</p>
                    <p className="text-lg">{result.accountAge}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Followers</p>
                    <p className="text-lg">{result.followers.toLocaleString()}</p>
                  </div>
                </div>
                
                {result.redFlags.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Red Flags Detected</h3>
                    <ul className="space-y-2">
                      {result.redFlags.map((flag, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1 text-xs bg-secondary rounded-full p-0.5 text-muted-foreground">
                            {i + 1}
                          </span>
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className={`p-4 rounded-lg border ${getTrustColor(result.trustLevel)}`}>
                  <h3 className="font-medium mb-2">Recommendation</h3>
                  <p>{result.recommendation}</p>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setResult(null);
                      setUsername("");
                    }}
                  >
                    Scan Another Profile
                  </Button>
                  <Button
                    className="flex-1 bg-pistachio hover:bg-pistachio-dark text-black"
                    onClick={() => {
                      // In a real app, this would report the profile
                      alert(`Profile ${result.username} has been reported!`);
                    }}
                  >
                    {result.trustLevel === "scam" ? "Report Scam" : "Save Report"}
                  </Button>
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

export default SocialMediaProtection;
