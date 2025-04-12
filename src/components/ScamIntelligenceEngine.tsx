
import { useState } from "react";
import { Shield, AlertTriangle, X, Check, Upload, Link, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

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
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = () => {
    // Normally this would call an API with OpenAI integration
    // For now we'll simulate it with a timeout
    setIsLoading(true);

    setTimeout(() => {
      // Mock different results based on input for demonstration
      let mockResult: AnalysisResult;
      
      if (inputValue.toLowerCase().includes("bitcoin") || inputValue.toLowerCase().includes("urgent")) {
        mockResult = {
          riskLevel: "dangerous",
          score: 95,
          reasons: [
            "Contains urgent action language",
            "Mentions cryptocurrency transfers",
            "Requests sensitive information",
          ],
          advice: "This is a common cryptocurrency scam. Do not respond or click any links. Block the sender immediately.",
        };
      } else if (inputValue.toLowerCase().includes("prize") || inputValue.toLowerCase().includes("won")) {
        mockResult = {
          riskLevel: "suspicious",
          score: 65,
          reasons: [
            "Offers prize without entering contest",
            "Contains questionable contact information",
          ],
          advice: "This message has several red flags for a potential prize scam. Verify through official channels before responding.",
        };
      } else {
        mockResult = {
          riskLevel: "safe",
          score: 10,
          reasons: [
            "No urgent language detected",
            "No suspicious links found",
            "No requests for personal information",
          ],
          advice: "This message appears to be safe, but always stay vigilant with unexpected communications.",
        };
      }

      setResult(mockResult);
      setIsLoading(false);
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
                    <Button className="flex-1 bg-pistachio hover:bg-pistachio-dark text-black">
                      Report to authorities
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <Tabs 
                    defaultValue="text" 
                    className="w-full"
                    onValueChange={(value) => setInputType(value as InputType)}
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
