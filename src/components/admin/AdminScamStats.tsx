
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Link, Mail, FileText, ExternalLink } from "lucide-react";

export function AdminScamStats() {
  // Mock scam report data - in a real app, this would come from a database
  const recentScams = [
    { 
      id: "SC-7293", 
      type: "phishing", 
      source: "email", 
      target: "banking", 
      reportedBy: "alex@example.com",
      reportedAt: "Apr 12, 2024, 15:42",
      severity: "high"
    },
    { 
      id: "SC-7292", 
      type: "fake website", 
      source: "link", 
      target: "ecommerce", 
      reportedBy: "jamie@example.com",
      reportedAt: "Apr 12, 2024, 14:18",
      severity: "medium"
    },
    { 
      id: "SC-7291", 
      type: "malware", 
      source: "website", 
      target: "system access", 
      reportedBy: "taylor@example.com",
      reportedAt: "Apr 11, 2024, 22:07",
      severity: "critical"
    },
    { 
      id: "SC-7290", 
      type: "impersonation", 
      source: "social media", 
      target: "personal", 
      reportedBy: "casey@example.com",
      reportedAt: "Apr 11, 2024, 16:35",
      severity: "low"
    },
    { 
      id: "SC-7289", 
      type: "phishing", 
      source: "email", 
      target: "corporate", 
      reportedBy: "jordan@example.com",
      reportedAt: "Apr 11, 2024, 10:22",
      severity: "high"
    },
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-500">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-500">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "email":
        return <Mail className="h-4 w-4 text-blue-500" />;
      case "link":
        return <Link className="h-4 w-4 text-green-500" />;
      case "website":
        return <ExternalLink className="h-4 w-4 text-purple-500" />;
      case "social media":
        return <FileText className="h-4 w-4 text-pink-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Scam Reports</h2>
        <p className="text-muted-foreground">
          Overview of detected and reported scams across the platform
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,481</div>
            <p className="text-xs text-muted-foreground">
              +43 from yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Threats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <div className="text-xs text-red-500">
              +3 new in last 24 hours
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Detection Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.6%</div>
            <p className="text-xs text-muted-foreground">
              +2.3% from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Common</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Phishing</div>
            <p className="text-xs text-muted-foreground">
              62% of all reports
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Scam Reports</CardTitle>
          <CardDescription>
            The latest threats detected and reported by users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentScams.map((scam) => (
                <TableRow key={scam.id}>
                  <TableCell className="font-medium">{scam.id}</TableCell>
                  <TableCell className="capitalize">{scam.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getSourceIcon(scam.source)}
                      <span className="capitalize">{scam.source}</span>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{scam.target}</TableCell>
                  <TableCell>{scam.reportedBy}</TableCell>
                  <TableCell>{scam.reportedAt}</TableCell>
                  <TableCell>{getSeverityBadge(scam.severity)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-4 flex justify-center">
            <Button variant="outline">View All Reports</Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Scam Types Distribution</CardTitle>
            <CardDescription>Breakdown of scam categories</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[250px]">
            {/* In a real app, this would be a chart component */}
            <div className="flex gap-2 h-full items-end">
              {["Phishing", "Fake Site", "Malware", "Impersonation", "Ransomware"].map((type, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className="bg-pistachio rounded-md w-12" 
                    style={{ 
                      height: `${i === 0 ? 150 : i === 1 ? 120 : i === 2 ? 90 : i === 3 ? 60 : 30}px`,
                      opacity: 0.8 - (i * 0.1)
                    }}
                  />
                  <span className="text-xs mt-2 text-center">{type}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Geographical Distribution</CardTitle>
            <CardDescription>Top regions affected by scams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium flex-1">United States</span>
                  <span className="text-sm text-muted-foreground">32%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-pistachio h-2.5 rounded-full" style={{ width: "32%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium flex-1">United Kingdom</span>
                  <span className="text-sm text-muted-foreground">18%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-pistachio h-2.5 rounded-full" style={{ width: "18%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium flex-1">Canada</span>
                  <span className="text-sm text-muted-foreground">14%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-pistachio h-2.5 rounded-full" style={{ width: "14%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium flex-1">Australia</span>
                  <span className="text-sm text-muted-foreground">11%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-pistachio h-2.5 rounded-full" style={{ width: "11%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium flex-1">Germany</span>
                  <span className="text-sm text-muted-foreground">9%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-pistachio h-2.5 rounded-full" style={{ width: "9%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
