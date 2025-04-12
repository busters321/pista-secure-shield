
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mail, AlertTriangle, CheckCircle, ShieldAlert, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";

type EmailAnalysisResult = {
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
  score: number;
  issues: {
    category: string;
    problems: string[];
    severity: 'low' | 'medium' | 'high'; 
  }[];
  recommendations: string[];
};

const EmailScanner = () => {
  const [emailContent, setEmailContent] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EmailAnalysisResult | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleScan = () => {
    if (!emailContent && !imagePreview) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const lowerContent = emailContent.toLowerCase();
      const hasPhishingTerms = 
        lowerContent.includes("urgent") || 
        lowerContent.includes("account") || 
        lowerContent.includes("verify") ||
        lowerContent.includes("password") ||
        lowerContent.includes("click here");
      
      const hasSpoofedSender = 
        lowerContent.includes("paypal") || 
        lowerContent.includes("amazon") ||
        lowerContent.includes("bank") ||
        lowerContent.includes("microsoft");
      
      let mockResult: EmailAnalysisResult;
      
      if (hasPhishingTerms && hasSpoofedSender) {
        mockResult = {
          riskLevel: 'dangerous',
          score: 92,
          issues: [
            {
              category: "Sender Authentication",
              problems: [
                "Spoofed sender address",
                "Mismatched reply-to address",
                "Invalid DMARC record"
              ],
              severity: 'high'
            },
            {
              category: "Content Analysis",
              problems: [
                "Contains urgent action language",
                "Requests sensitive information",
                "Contains suspicious links"
              ],
              severity: 'high'
            },
            {
              category: "Technical Inspection",
              problems: [
                "Mismatched link URLs",
                "Hidden redirect code"
              ],
              severity: 'medium'
            }
          ],
          recommendations: [
            "Do not click any links in this email",
            "Do not download any attachments",
            "Report this email as phishing to your provider",
            "Block the sender"
          ]
        };
      } else if (hasPhishingTerms || hasSpoofedSender) {
        mockResult = {
          riskLevel: 'suspicious',
          score: 65,
          issues: [
            {
              category: "Sender Authentication",
              problems: [
                "Unusual sender domain",
                "Recent domain registration"
              ],
              severity: 'medium'
            },
            {
              category: "Content Analysis",
              problems: [
                "Contains some concerning language",
                "Links to external websites"
              ],
              severity: 'medium'
            },
            {
              category: "Technical Inspection",
              problems: [
                "No major technical issues found"
              ],
              severity: 'low'
            }
          ],
          recommendations: [
            "Exercise caution with this email",
            "Verify the sender through other channels before taking action",
            "Do not share sensitive information"
          ]
        };
      } else {
        mockResult = {
          riskLevel: 'safe',
          score: 12,
          issues: [
            {
              category: "Sender Authentication",
              problems: [
                "No authentication issues detected"
              ],
              severity: 'low'
            },
            {
              category: "Content Analysis",
              problems: [
                "No suspicious content detected"
              ],
              severity: 'low'
            },
            {
              category: "Technical Inspection",
              problems: [
                "All links appear legitimate",
                "No hidden code detected"
              ],
              severity: 'low'
            }
          ],
          recommendations: [
            "This email appears to be safe",
            "Always remain vigilant with unexpected communications"
          ]
        };
      }
      
      setResult(mockResult);
      setIsLoading(false);
    }, 1500);
  };

  const getRatingColor = (risk: 'safe' | 'suspicious' | 'dangerous') => {
    switch (risk) {
      case 'safe': return "text-success border-success bg-success/10";
      case 'suspicious': return "text-warning border-warning bg-warning/10";
      case 'dangerous': return "text-destructive border-destructive bg-destructive/10";
    }
  };

  const getRatingIcon = (risk: 'safe' | 'suspicious' | 'dangerous') => {
    switch (risk) {
      case 'safe': return <CheckCircle className="h-5 w-5 text-success" />;
      case 'suspicious': return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'dangerous': return <ShieldAlert className="h-5 w-5 text-destructive" />;
    }
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low': return "bg-success/10 text-success";
      case 'medium': return "bg-warning/10 text-warning";
      case 'high': return "bg-destructive/10 text-destructive";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Email Threat Scanner</h1>
          <p className="text-muted-foreground mb-8">
            Analyze emails for phishing attempts, spoofing, and other security threats.
          </p>
          
          {!result ? (
            <Card>
              <CardHeader>
                <CardTitle>Scan Email</CardTitle>
                <CardDescription>
                  Paste the email content or upload a screenshot to analyze
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {!imagePreview ? (
                    <>
                      <Textarea
                        placeholder="Paste the email content here..."
                        className="min-h-[200px]"
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                      />
                      
                      <div className="flex items-center">
                        <div className="flex-grow border-t border-border"></div>
                        <span className="px-4 text-sm text-muted-foreground">or</span>
                        <div className="flex-grow border-t border-border"></div>
                      </div>
                      
                      <div className="border-2 border-dashed border-border rounded-md p-8">
                        <div className="flex flex-col items-center justify-center text-center">
                          <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                          <p className="text-sm font-medium">
                            Upload a screenshot of the email
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            JPG, PNG or screenshot of the suspicious email
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
                    </>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Email screenshot"
                        className="max-h-[300px] mx-auto rounded-md"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full"
                        onClick={() => setImagePreview(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={handleScan}
                  disabled={isLoading || (!emailContent && !imagePreview)}
                  className="w-full bg-pistachio hover:bg-pistachio-dark text-black"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                      Scanning...
                    </>
                  ) : "Scan Email"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg">
              <CardHeader>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getRatingColor(result.riskLevel)}`}>
                  {getRatingIcon(result.riskLevel)}
                  <span className="font-medium capitalize">{result.riskLevel}</span>
                  <span className="text-sm">({result.score}% risk)</span>
                </div>
                <CardTitle className="mt-4">Email Analysis Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {result.issues.map((issue, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{issue.category}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </span>
                    </div>
                    <ul className="space-y-1 text-sm">
                      {issue.problems.map((problem, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1 flex-shrink-0 text-xs bg-secondary w-4 h-4 flex items-center justify-center rounded-full text-muted-foreground">
                            {i + 1}
                          </span>
                          <span>{problem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                
                <div className="border-t border-border pt-4 space-y-2">
                  <h3 className="font-medium">Recommendations</h3>
                  <ul className="space-y-2 text-sm">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Mail className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setResult(null);
                      setEmailContent("");
                      setImagePreview(null);
                    }}
                  >
                    Scan Another Email
                  </Button>
                  <Button 
                    className="flex-1 bg-pistachio hover:bg-pistachio-dark text-black"
                    onClick={() => {
                      // In a real app, this would report the email
                      alert("Email reported as phishing!");
                    }}
                  >
                    Report as Phishing
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

export default EmailScanner;
