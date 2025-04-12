
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Copy, Download, Send, Upload, X, CheckCircle, Instagram, AlertTriangle } from "lucide-react";

type ReportDestination = 
  "email" | "instagram" | "facebook" | "tiktok" | 
  "whatsapp" | "police" | "ftc" | "interpol" | 
  "discord" | "paypal";

interface ScamReportData {
  content: string;
  imageUrl?: string | null;
  destination: ReportDestination;
  email?: string;
}

const ScamReport = () => {
  const [scamContent, setScamContent] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [destination, setDestination] = useState<ReportDestination>("email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateReport = () => {
    if (!scamContent && !imagePreview) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setReportGenerated(true);
    }, 2000);
  };

  const handleSendReport = () => {
    // Simulate sending the report
    alert(`Report sent to ${destination}!`);
  };

  const handleDownloadReport = () => {
    // Simulate downloading the report
    alert("Report downloaded!");
  };

  const handleCopyReport = () => {
    // Simulate copying the report content
    navigator.clipboard.writeText(
      `SCAM REPORT\n\nContent: ${scamContent}\nDate: ${new Date().toLocaleDateString()}`
    );
    alert("Report copied to clipboard!");
  };

  const getDestinationLabel = (dest: ReportDestination) => {
    switch (dest) {
      case "email": return "Email";
      case "instagram": return "Instagram";
      case "facebook": return "Facebook";
      case "tiktok": return "TikTok";
      case "whatsapp": return "WhatsApp";
      case "police": return "Local Police";
      case "ftc": return "FTC";
      case "interpol": return "Interpol";
      case "discord": return "Discord";
      case "paypal": return "PayPal";
    }
  };

  const getDestinationIcon = (dest: ReportDestination) => {
    switch (dest) {
      case "instagram": return <Instagram className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-full p-2 bg-pistachio/10">
              <FileText className="h-6 w-6 text-pistachio" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Scam Report Generator</h1>
              <p className="text-muted-foreground">
                Create detailed scam reports and send them to the appropriate authorities.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            {!reportGenerated ? (
              <Card>
                <CardHeader>
                  <CardTitle>Generate Scam Report</CardTitle>
                  <CardDescription>
                    Upload a screenshot or paste the suspicious message to create a report
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs defaultValue="text">
                    <TabsList className="grid grid-cols-2 mb-4">
                      <TabsTrigger value="text">Paste Text</TabsTrigger>
                      <TabsTrigger value="image">Upload Screenshot</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="text">
                      <Textarea
                        placeholder="Paste the scam message here..."
                        className="min-h-[150px]"
                        value={scamContent}
                        onChange={(e) => setScamContent(e.target.value)}
                      />
                    </TabsContent>
                    
                    <TabsContent value="image">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Scam screenshot"
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
                      ) : (
                        <div className="border-2 border-dashed border-border rounded-md p-8">
                          <div className="flex flex-col items-center justify-center text-center">
                            <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                            <p className="text-sm font-medium">
                              Upload a screenshot of the scam
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
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Send Report To</label>
                      <Select 
                        value={destination} 
                        onValueChange={(value) => setDestination(value as ReportDestination)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="police">Local Police</SelectItem>
                          <SelectItem value="ftc">FTC</SelectItem>
                          <SelectItem value="interpol">Interpol</SelectItem>
                          <SelectItem value="discord">Discord</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {destination === "email" && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <Input
                          type="email"
                          placeholder="Enter recipient email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                  
                  <Button
                    onClick={handleGenerateReport}
                    disabled={isLoading || (!scamContent && !imagePreview)}
                    className="w-full bg-pistachio hover:bg-pistachio-dark text-black"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                        Generating Report...
                      </>
                    ) : "Generate Report"}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Report Generated</span>
                  </div>
                  <CardTitle className="mt-4">Scam Report Ready</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted p-4 rounded-md border space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-lg">Scam Report Summary</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Content</p>
                      <div className="bg-background p-3 rounded border text-sm">
                        {scamContent || "Image submission (see attached screenshot)"}
                      </div>
                    </div>
                    
                    {imagePreview && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Attached Screenshot</p>
                        <img
                          src={imagePreview}
                          alt="Scam screenshot"
                          className="max-h-[200px] rounded-md"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Report Destination</p>
                      <div className="flex items-center gap-2">
                        {getDestinationIcon(destination)}
                        <span>{getDestinationLabel(destination)}</span>
                        {destination === "email" && email && (
                          <span className="text-muted-foreground">({email})</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">AI Analysis</p>
                      <p className="text-sm">
                        This appears to be a {scamContent.toLowerCase().includes("money") || scamContent.toLowerCase().includes("bank") ? "financial fraud" : "phishing attempt"} targeting users through {scamContent.toLowerCase().includes("click") ? "malicious links" : "social engineering"}.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      className="flex gap-2"
                      onClick={handleCopyReport}
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      className="flex gap-2"
                      onClick={handleDownloadReport}
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      className="flex gap-2 bg-pistachio hover:bg-pistachio-dark text-black"
                      onClick={handleSendReport}
                    >
                      <Send className="h-4 w-4" />
                      Send
                    </Button>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => {
                      setReportGenerated(false);
                      setScamContent("");
                      setImagePreview(null);
                      setDestination("email");
                      setEmail("");
                    }}
                  >
                    Create Another Report
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ScamReport;
