
import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, User, Bot, Send, Link, Shield, AlertTriangle, Copy, Check } from "lucide-react";

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

type SuggestionTopic = {
  label: string;
  message: string;
  icon: React.ElementType;
};

const CyberCopilot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your Cyber Copilot. How can I help you with online security today?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions: SuggestionTopic[] = [
    { 
      label: "Check a link", 
      message: "Is this link safe? https://bit.ly/3xR5tZq", 
      icon: Link 
    },
    { 
      label: "Identify a scam", 
      message: "I received an email claiming I won a prize. Is this a scam?", 
      icon: AlertTriangle 
    },
    { 
      label: "Password advice", 
      message: "How can I create stronger passwords?", 
      icon: Shield 
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Generate AI response based on input
    setTimeout(() => {
      let response = "";
      
      const lowerInput = input.toLowerCase();
      
      if (lowerInput.includes("link") || lowerInput.includes("url") || lowerInput.includes("http")) {
        response = "When checking links for safety, I recommend:\n\n1. Don't click on shortened links (bit.ly, tinyurl, etc.) without inspection\n2. Verify the sender is legitimate\n3. Check for misspellings in the domain (like 'faceb00k.com')\n4. Use our Deep Link Inspection tool to analyze it thoroughly\n\nWould you like me to check a specific link for you?";
      } else if (lowerInput.includes("scam") || lowerInput.includes("phishing") || lowerInput.includes("fraud")) {
        response = "Common signs of scams include:\n\n1. Creating urgency or fear ('Act now!')\n2. Promising unrealistic rewards\n3. Requesting personal information\n4. Poor grammar or spelling\n5. Suspicious sender addresses\n\nIf you've encountered a potential scam, you can use our Scam Report Generator to document and report it.";
      } else if (lowerInput.includes("password")) {
        response = "For stronger passwords:\n\n1. Use at least 12 characters\n2. Combine uppercase, lowercase, numbers, and symbols\n3. Avoid common words or phrases\n4. Don't reuse passwords across sites\n5. Consider a password manager\n\nOur Password Risk Checker can help you verify if your credentials have been compromised in any data breaches.";
      } else if (lowerInput.includes("email") || lowerInput.includes("mail")) {
        response = "To protect yourself from email threats:\n\n1. Be wary of unexpected attachments\n2. Verify sender addresses carefully\n3. Don't click suspicious links\n4. Enable two-factor authentication\n5. Use our Email Threat Scanner to analyze suspicious messages\n\nWould you like more specific email security advice?";
      } else {
        response = "I'm here to help with any cybersecurity questions you have. You can ask me about:\n\n- Checking suspicious links or websites\n- Identifying potential scams or phishing attempts\n- Securing your accounts and passwords\n- Safe browsing practices\n- Protecting personal information online\n\nOr you can use any of PistaSecure's specialized tools for more detailed analysis.";
      }
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestion = (message: string) => {
    setInput(message);
  };

  const handleCopyMessage = (id: string) => {
    const message = messages.find(m => m.id === id);
    if (message) {
      navigator.clipboard.writeText(message.content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-full p-2 bg-pistachio/10">
              <MessageCircle className="h-6 w-6 text-pistachio" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Cyber Copilot</h1>
              <p className="text-muted-foreground">
                Your AI security assistant for advice and protection
              </p>
            </div>
          </div>
          
          <Card className="h-[600px] flex flex-col">
            <CardContent className="flex-grow flex flex-col pt-6">
              <div className="flex-grow overflow-auto mb-4">
                <div className="space-y-4">
                  {messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`flex gap-3 max-w-[80%] ${
                          message.sender === 'user' 
                            ? 'flex-row-reverse' 
                            : 'flex-row'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                          message.sender === 'user'
                            ? 'bg-pistachio/20'
                            : 'bg-secondary'
                        }`}>
                          {message.sender === 'user' 
                            ? <User className="h-4 w-4 text-pistachio" /> 
                            : <Bot className="h-4 w-4" />
                          }
                        </div>
                        <div className="relative group">
                          <div
                            className={`p-3 rounded-lg ${
                              message.sender === 'user'
                                ? 'bg-pistachio text-black'
                                : 'bg-secondary'
                            }`}
                          >
                            <div className="whitespace-pre-wrap">{message.content}</div>
                          </div>
                          {message.sender === 'ai' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute -right-10 top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleCopyMessage(message.id)}
                            >
                              {copiedId === message.id ? (
                                <Check className="h-4 w-4 text-success" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-[80%]">
                        <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="p-3 rounded-lg bg-secondary flex items-center">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
                            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              {messages.length === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="flex items-center gap-2 justify-start py-6"
                      onClick={() => handleSuggestion(suggestion.message)}
                    >
                      <div className="rounded-full p-1.5 bg-pistachio/10">
                        <suggestion.icon className="h-4 w-4 text-pistachio" />
                      </div>
                      <span className="text-left">{suggestion.label}</span>
                    </Button>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Type your security question here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={isLoading}
                  className="flex-grow"
                />
                <Button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-pistachio hover:bg-pistachio-dark text-black"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CyberCopilot;
