
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Download, MapPin, Activity, Clock } from "lucide-react";

export function AdminUserIPTracker() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock IP data - in a real app, this would come from a database
  const userIPs = [
    { 
      id: "1", 
      email: "alex@example.com", 
      ip: "192.168.1.45", 
      location: "New York, USA", 
      lastLogin: "2025-04-13 08:23:12", 
      status: "online",
      device: "Chrome / macOS",
      loginCount: 12
    },
    { 
      id: "2", 
      email: "jamie@example.com", 
      ip: "172.16.0.12", 
      location: "London, UK", 
      lastLogin: "2025-04-12 14:15:09", 
      status: "offline",
      device: "Firefox / Windows",
      loginCount: 8
    },
    { 
      id: "3", 
      email: "taylor@example.com", 
      ip: "10.0.0.5", 
      location: "Sydney, Australia", 
      lastLogin: "2025-04-13 01:42:37", 
      status: "offline",
      device: "Safari / iOS",
      loginCount: 3
    },
    { 
      id: "4", 
      email: "morgan@example.com", 
      ip: "192.168.2.123", 
      location: "Toronto, Canada", 
      lastLogin: "2025-04-11 22:18:54", 
      status: "offline",
      device: "Edge / Windows",
      loginCount: 5
    },
    { 
      id: "5", 
      email: "riley@example.com", 
      ip: "172.16.10.45", 
      location: "Berlin, Germany", 
      lastLogin: "2025-04-13 06:33:21", 
      status: "online",
      device: "Chrome / Android",
      loginCount: 7
    }
  ];
  
  // Add any locally logged in user with their IP
  const storedEmail = localStorage.getItem("pistaSecure_userEmail");
  const storedIP = localStorage.getItem("pistaSecure_userIP");
  const storedLastLogin = localStorage.getItem("pistaSecure_lastLogin");
  
  // Filter users based on search term
  const filteredUsers = userIPs.filter(
    (user) => 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.ip.includes(searchTerm) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-500">Online</Badge>;
      case "offline":
        return <Badge variant="outline">Offline</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User IP Tracker</h2>
          <p className="text-muted-foreground">Monitor and track user login locations and activities</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export IP Data
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Sessions</CardTitle>
            <CardDescription>Current online users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-pistachio">
              2
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Unique IPs</CardTitle>
            <CardDescription>Distinct IP addresses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              5
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Countries</CardTitle>
            <CardDescription>Geographic spread</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              4
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by email, IP or location..."
          className="pl-8 w-full sm:w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Login Count</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {storedEmail && storedIP && (
              <TableRow className="bg-muted/20">
                <TableCell className="font-medium">{storedEmail} <Badge variant="outline" className="ml-2">You</Badge></TableCell>
                <TableCell>{storedIP}</TableCell>
                <TableCell className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  Current Location
                </TableCell>
                <TableCell>Current Browser</TableCell>
                <TableCell className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  {new Date(storedLastLogin || "").toLocaleString()}
                </TableCell>
                <TableCell>1</TableCell>
                <TableCell>{getStatusBadge("online")}</TableCell>
              </TableRow>
            )}
            
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No user IPs found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.ip}</TableCell>
                  <TableCell className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    {user.location}
                  </TableCell>
                  <TableCell>{user.device}</TableCell>
                  <TableCell className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    {user.lastLogin}
                  </TableCell>
                  <TableCell>{user.loginCount}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
