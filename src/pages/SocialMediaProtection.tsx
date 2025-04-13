
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Instagram, MessageSquare, AlertTriangle, CheckCircle, ShieldAlert, Facebook, Video, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  profileUrl?: string;
}

const SocialMediaProtection = () => {
  const [platform, setPlatform] = useState<PlatformType>("instagram");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ProfileAnalysisResult | null>(null);
  const { toast } = useToast();

  // Realistically analyze social profile based on name patterns and platform
  const analyzeProfile = (username: string, platform: PlatformType): ProfileAnalysisResult => {
    // Common patterns in fake accounts
    const scamPatterns = [
      'official', 'verify', 'support', 'help', 'service', 'team', 'real', 'original',
      'winner', 'prize', 'giveaway', 'contest', 'lucky', 'money', 'cash', 'payment',
      'admin', 'moderator', 'staff', 'account', 'security', 'secure', 'protect'
    ];
    
    // Username characteristics that might indicate suspicious accounts
    const isVeryShort = username.length <= 3;
    const hasRandomNumbers = /[0-9]{4,}/.test(username);
    const hasExcessiveSymbols = username.split('').filter(char => !char.match(/[a-zA-Z0-9]/)).length > 2;
    const hasDots = username.includes('.');
    const hasUnderscores = username.includes('_');
    const hasScamKeyword = scamPatterns.some(pattern => username.toLowerCase().includes(pattern));
    
    // Calculate follower count based on username characteristics
    // Real accounts tend to have more consistent names and more followers
    let followerCount: number;
    
    if (hasScamKeyword) {
      // Scam accounts typically have very few followers
      followerCount = Math.floor(Math.random() * 100) + 5;
    } else if (hasRandomNumbers || hasExcessiveSymbols) {
      // Suspicious accounts might have moderate followers
      followerCount = Math.floor(Math.random() * 1000) + 200;
    } else {
      // Likely legitimate accounts have more followers
      followerCount = Math.floor(Math.random() * 10000) + 1000;
    }
    
    // Calculate account age based on characteristics
    let accountAgeDays: number;
    
    if (hasScamKeyword) {
      // Scam accounts are typically new
      accountAgeDays = Math.floor(Math.random() * 30) + 1;
    } else if (hasRandomNumbers || hasExcessiveSymbols) {
      // Suspicious accounts might be relatively new
      accountAgeDays = Math.floor(Math.random() * 180) + 30;
    } else {
      // Legitimate accounts tend to be older
      accountAgeDays = Math.floor(Math.random() * 1000) + 180;
    }
    
    // Format account age for display
    let accountAge: string;
    if (accountAgeDays < 30) {
      accountAge = `${accountAgeDays} days`;
    } else if (accountAgeDays < 365) {
      const months = Math.floor(accountAgeDays / 30);
      accountAge = `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(accountAgeDays / 365);
      accountAge = `${years} year${years > 1 ? 's' : ''}`;
    }
    
    // Compile red flags
    const redFlags: string[] = [];
    
    if (isVeryShort && (hasRandomNumbers || hasExcessiveSymbols)) {
      redFlags.push("Unusually short username with random characters");
    }
    
    if (hasRandomNumbers) {
      redFlags.push("Contains excessive random numbers");
    }
    
    if (hasExcessiveSymbols) {
      redFlags.push("Contains unusual number of special characters");
    }
    
    if (hasScamKeyword) {
      const matchedKeywords = scamPatterns.filter(pattern => 
        username.toLowerCase().includes(pattern)
      );
      
      redFlags.push(`Uses suspicious keywords: ${matchedKeywords.join(', ')}`);
    }
    
    if (accountAgeDays < 30) {
      redFlags.push("Account created very recently");
    }
    
    if (accountAgeDays < 90 && followerCount < 100) {
      redFlags.push("New account with suspiciously low follower count");
    }
    
    if (platform === "instagram" && username.includes("official") && followerCount < 1000) {
      redFlags.push("Claims to be official but has few followers");
    }
    
    // Determine trust level and risk score
    let trustLevel: TrustLevel;
    let score: number;
    
    if (hasScamKeyword && (accountAgeDays < 60 || followerCount < 200)) {
      trustLevel = "scam";
      score = 85 + Math.floor(Math.random() * 15);
    } else if (hasScamKeyword || (hasRandomNumbers && hasExcessiveSymbols) || accountAgeDays < 30) {
      trustLevel = "suspicious";
      score = 40 + Math.floor(Math.random() * 40);
    } else {
      trustLevel = "trusted";
      score = 5 + Math.floor(Math.random() * 20);
    }
    
    // Generate recommendation
    let recommendation: string;
    
    if (trustLevel === "scam") {
      recommendation = "This profile has strong indicators of being a scam account. Block and report immediately.";
    } else if (trustLevel === "suspicious") {
      recommendation = "Exercise caution when interacting with this account. Verify through official channels before sharing any personal information.";
    } else {
      recommendation = "This account appears legitimate based on our analysis. Always remain vigilant when interacting online.";
    }
    
    // Generate a mock profile URL
    const profileUrl = `https://www.${platform}.com/${username}`;
    
    return {
      username,
      platform,
      trustLevel,
      score,
      accountAge,
      followers: followerCount,
      redFlags,
      recommendation,
      profileUrl
    };
  };

  const handleAnalyze = () => {
    if (!username) return;
    
    setIsLoading(true);
    
    // Use timeout to simulate API call
    setTimeout(() => {
      // Generate analysis based on name and platform
      const profileAnalysis = analyzeProfile(username, platform);
      
      // Store the report in localStorage for admin panel to access
      const reports = JSON.parse(localStorage.getItem('pistaSecure_scamReports') || '[]');
      reports.push({
        type: 'social',
        content: `${platform}: @${username}`,
        result: profileAnalysis,
        date: new Date().toISOString(),
        id: `social-${Date.now()}`
      });
      localStorage.setItem('pistaSecure_scamReports', JSON.stringify(reports));
      
      setResult(profileAnalysis);
      setIsLoading(false);
      
      toast({
        title: "Profile analysis complete",
        description: `@${username} on ${platform}: ${profileAnalysis.trustLevel}`,
      });
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
      case "telegram": return Send;
      case "whatsapp": return MessageSquare;
      case "tiktok": return Video;
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
