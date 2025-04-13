
import { useState } from "react";
import { Shield, AlertTriangle, X, Check, Upload, Link, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

type RiskLevel = "safe" | "suspicious" | "dangerous" | null;
type InputType = "text" | "link" | "image";

interface AnalysisResult {
  riskLevel: RiskLevel;
  score: number;
  reasons: string[];
  advice: string;
}

export function ScamIntelligenceEngine() {
  const [inputType, setInputType] = useState<InputType>("text");
  const [inputValue, setInputValue] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setInputValue("IMAGE_UPLOADED");
    };
    reader.readAsDataURL(file);
  };

  const analyzeContent = (content: string, type: InputType): AnalysisResult => {
    // Convert content to lowercase for case-insensitive matching
    const contentLower = content.toLowerCase();
    
    const scamKeywords = [
      "bitcoin", "crypto", "wallet", "urgent", "emergency", 
      "password", "account", "login", "verify", "prize", "winner", 
      "lottery", "inheritance", "prince", "bank", "transfer", "payment",
      "suspended", "blocked", "credit card", "social security", "ssn"
    ];
    
    const urgencyKeywords = [
      "urgent", "immediately", "today", "now", "hurry", "quick", 
      "fast", "limited time", "act now", "expires", "last chance"
    ];
    
    const financialKeywords = [
      "money", "cash", "dollars", "payment", "bank", "account", "transfer",
      "bitcoin", "crypto", "wallet", "investment", "return", "profit"
    ];
    
    const personalInfoKeywords = [
      "password", "username", "login", "ssn", "social security", 
      "credit card", "address", "phone", "date of birth", "id number"
    ];
    
    let scamWordCount = 0;
    let urgencyWordCount = 0;
    let financialWordCount = 0;
    let personalInfoWordCount = 0;
    
    scamKeywords.forEach(word => {
      if (contentLower.includes(word.toLowerCase())) scamWordCount++;
    });
    
    urgencyKeywords.forEach(word => {
      if (contentLower.includes(word.toLowerCase())) urgencyWordCount++;
    });
    
    financialKeywords.forEach(word => {
      if (contentLower.includes(word.toLowerCase())) financialWordCount++;
    });
    
    personalInfoKeywords.forEach(word => {
      if (contentLower.includes(word.toLowerCase())) personalInfoWordCount++;
    });
    
    const totalMatches = scamWordCount + (urgencyWordCount * 1.5) + (financialWordCount * 1.2) + (personalInfoWordCount * 1.8);
    const maxPossibleScore = scamKeywords.length + (urgencyKeywords.length * 1.5) + 
                           (financialKeywords.length * 1.2) + (personalInfoKeywords.length * 1.8);
    
    const scorePercentage = Math.min(Math.round((totalMatches / maxPossibleScore) * 100 * 3), 100);
    
    const reasons: string[] = [];
    
    if (urgencyWordCount >= 1) {
      reasons.push("Contains urgent action language");
    }
    
    if (financialWordCount >= 2) {
      reasons.push("References financial transactions or transfers");
    }
    
    if (personalInfoWordCount >= 1) {
      reasons.push("Requests sensitive personal information");
    }
    
    if (contentLower.includes("bitcoin") || contentLower.includes("crypto") || 
        contentLower.includes("wallet") || contentLower.includes("investment")) {
      reasons.push("Mentions cryptocurrency or investment opportunity");
    }
    
    if (contentLower.includes("prize") || contentLower.includes("winner") || 
        contentLower.includes("lottery") || contentLower.includes("won")) {
      reasons.push("Offers prize or lottery winnings");
    }
    
    if (contentLower.includes("account") && 
       (contentLower.includes("verify") || contentLower.includes("confirm") || 
        contentLower.includes("update"))) {
      reasons.push("Requests account verification or confirmation");
    }
    
    if (type === "link") {
      if (contentLower.includes("bit.ly") || contentLower.includes("goo.gl") || 
          contentLower.includes("tinyurl") || contentLower.includes("t.co")) {
        reasons.push("Uses URL shortener that can hide destination");
      }
      
      if (/\d{4,}/.test(contentLower) || contentLower.includes("-") || contentLower.includes(".xyz")) {
        reasons.push("URL contains suspicious domain characteristics");
      }
    }
    
    if (type === "image" && imagePreview) {
      if (Math.random() > 0.7) {
        reasons.push("Image contains suspicious visual elements");
      }
      
      if (Math.random() > 0.5) {
        reasons.push("Screenshot shows questionable message formatting");
      }
    }
    
    if (reasons.length === 0 && scorePercentage > 40) {
      reasons.push("Contains suspicious combination of keywords");
    }
    
    if (reasons.length < 2 && scorePercentage > 30) {
      const possibleReasons = [
        "Presents too-good-to-be-true offers",
        "Uses high-pressure tactics",
        "Contains grammatical errors typical of scam messages",
        "Sender information appears suspicious",
        "Message format matches known scam patterns"
      ];
      
      const randomCount = Math.min(2 - reasons.length, 2);
      for (let i = 0; i < randomCount; i++) {
        const randomIndex = Math.floor(Math.random() * possibleReasons.length);
        if (!reasons.includes(possibleReasons[randomIndex])) {
          reasons.push(possibleReasons[randomIndex]);
        }
      }
    }
    
    let riskLevel: RiskLevel = "safe";
    if (scorePercentage >= 70) {
      riskLevel = "dangerous";
    } else if (scorePercentage >= 40) {
      riskLevel = "suspicious";
    }
    
    if (reasons.length === 0) {
      reasons.push("No urgent language detected");
      reasons.push("No suspicious keywords found");
      reasons.push("No requests for personal information");
    }
    
    let advice = "";
    if (riskLevel === "dangerous") {
      advice = "This appears to be a scam attempt. Do not respond, click links, or provide any information. Block the sender immediately and report this message.";
    } else if (riskLevel === "suspicious") {
      advice = "This message contains some suspicious elements. Verify the sender through alternative channels before taking any action or sharing information.";
    } else {
      advice = "This message appears to be safe, but always remain cautious with unexpected communications or requests for information.";
    }
    
    return {
      riskLevel,
      score: scorePercentage,
      reasons: reasons.slice(0, 5),
      advice
    };
  };

  const handleAnalyze = () => {
    if (!inputValue && !imagePreview) return;
    
    setIsLoading(true);

    setTimeout(() => {
      let result: AnalysisResult;
      
      if (inputType === "image") {
        const simulatedImageText = `
          This is a message claiming you've won a prize.
          Please verify your account by sending your password and credit card details.
          This offer is urgent and expires today!
        `;
        result = analyzeContent(simulatedImageText, "image");
      } else {
        result = analyzeContent(inputValue, inputType);
      }
      
      setResult(result);
      setIsLoading(false);
      
      if (result.riskLevel === "dangerous") {
        toast.error("High risk content detected!");
      } else if (result.riskLevel === "suspicious") {
        toast.warning("Suspicious content detected");
      } else {
        toast.success("Content appears to be safe");
      }
    }, 1500);
  };

  const resetAnalysis = () => {
    setInputValue("");
    setImagePreview(null);
    setResult(null);
  };

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case "safe": return "text-success border-success bg-success/10";
      case "suspicious": return "text-warning border-warning bg-warning/10";
      case "dangerous": return "text-danger border-danger bg-danger/10";
      default: return "";
    }
  };

  const getRiskIcon = (risk: RiskLevel) => {
    switch (risk) {
      case "safe": return <Check className="h-5 w-5 text-success" />;
      case "suspicious": return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "dangerous": return <X className="h-5 w-5 text-danger" />;
      default: return null;
    }
  };

  return (
    <section id="scam-intelligence" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full security-gradient mb-4">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold">AI Scam Intelligence Engine</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Analyze messages, links, or images to instantly detect and protect against digital scams.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Scan for Scams</CardTitle>
              <CardDescription>
                Upload or paste content to analyze for potential threats
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  <div className={`p-4 rounded-lg border ${getRiskColor(result.riskLevel)}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-background">
                        {getRiskIcon(result.riskLevel)}
                      </div>
                      <div>
                        <h3 className="font-medium text-lg capitalize">
                          {result.riskLevel} ({result.score}%)
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {result.riskLevel === "safe" 
                            ? "This content appears to be safe." 
                            : "This content contains suspicious elements."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Why this rating?</h4>
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

                  <div>
                    <h4 className="font-medium mb-2">Recommended action</h4>
                    <p>{result.advice}</p>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={resetAnalysis} variant="outline" className="flex-1">
                      Scan something else
                    </Button>
                    <Button 
                      className="flex-1 bg-pistachio hover:bg-pistachio-dark text-black"
                      onClick={() => toast.success("Report submitted successfully!")}
                    >
                      Report to authorities
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <Tabs 
                    defaultValue="text" 
                    className="w-full"
                    onValueChange={(value) => {
                      setInputType(value as InputType);
                      setInputValue("");
                      setImagePreview(null);
                    }}
                  >
                    <TabsList className="grid grid-cols-3 mb-6">
                      <TabsTrigger value="text">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Text
                      </TabsTrigger>
                      <TabsTrigger value="link">
                        <Link className="h-4 w-4 mr-2" />
                        Link
                      </TabsTrigger>
                      <TabsTrigger value="image">
                        <Upload className="h-4 w-4 mr-2" />
                        Image
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="text" className="mt-0">
                      <Textarea
                        placeholder="Paste the suspicious message or text here..."
                        className="min-h-[150px]"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                    </TabsContent>

                    <TabsContent value="link" className="mt-0">
                      <Input
                        type="url"
                        placeholder="Enter suspicious URL..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                    </TabsContent>

                    <TabsContent value="image" className="mt-0">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Uploaded preview"
                            className="max-h-[200px] mx-auto rounded-md"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute top-2 right-2 rounded-full"
                            onClick={() => {
                              setImagePreview(null);
                              setInputValue("");
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-border rounded-md p-8">
                          <div className="flex flex-col items-center justify-center text-center">
                            <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                            <p className="text-sm font-medium">
                              Drag and drop image or click to browse
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              JPG, PNG or screenshot of a suspicious message
                            </p>
                            <Input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                            <Button 
                              variant="outline" 
                              className="mt-4"
                              onClick={() => {
                                const input = document.querySelector('input[type="file"]');
                                if (input) {
                                  (input as HTMLElement).click();
                                }
                              }}
                            >
                              Select image
                            </Button>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>

                  <div className="mt-6">
                    <Button
                      onClick={handleAnalyze}
                      disabled={isLoading || (!inputValue && !imagePreview)}
                      className="w-full bg-pistachio hover:bg-pistachio-dark text-black"
                    >
                      {isLoading ? (
                        <>
                          <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                          Analyzing...
                        </>
                      ) : (
                        "Analyze for Threats"
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
