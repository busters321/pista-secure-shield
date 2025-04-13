
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Download, ChevronLeft, ChevronRight, Filter, UserCog } from "lucide-react";

export function AdminUsersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  // Mock user data - in a real app, this would come from a database
  const users = [
    { id: "1", name: "Alex Johnson", email: "alex@example.com", status: "active", role: "user", joined: "Mar 14, 2024" },
    { id: "2", name: "Jamie Smith", email: "jamie@example.com", status: "active", role: "admin", joined: "Jan 5, 2024" },
    { id: "3", name: "Taylor Doe", email: "taylor@example.com", status: "inactive", role: "user", joined: "Apr 2, 2024" },
    { id: "4", name: "Casey Brown", email: "casey@example.com", status: "active", role: "user", joined: "Feb 18, 2024" },
    { id: "5", name: "Jordan Wilson", email: "jordan@example.com", status: "pending", role: "user", joined: "Apr 9, 2024" },
    { id: "6", name: "Riley Davis", email: "riley@example.com", status: "active", role: "user", joined: "Mar 22, 2024" },
    { id: "7", name: "Morgan Lee", email: "morgan@example.com", status: "active", role: "user", joined: "Jan 30, 2024" },
    { id: "8", name: "Quinn Garcia", email: "quinn@example.com", status: "inactive", role: "user", joined: "Apr 5, 2024" },
  ];
  
  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">View and manage registered users</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 self-end">
          <Button variant="outline" size="sm" disabled={selectedUsers.length === 0}>
            <UserCog className="h-4 w-4 mr-2" />
            Manage Selected
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="bg-pistachio hover:bg-pistachio-dark text-black"
          >
            Add User
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300"
                  onChange={() => {
                    if (selectedUsers.length === filteredUsers.length) {
                      setSelectedUsers([]);
                    } else {
                      setSelectedUsers(filteredUsers.map(user => user.id));
                    }
                  }}
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <span className="capitalize">{user.role}</span>
                  </TableCell>
                  <TableCell>{user.joined}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <strong>1</strong> to <strong>{filteredUsers.length}</strong> of{" "}
          <strong>{filteredUsers.length}</strong> results
        </p>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(page => page + 1)}
            disabled={true} // In a real app, this would be based on total pages
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
