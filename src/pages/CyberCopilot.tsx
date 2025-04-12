
import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, User, Bot, Send, Link, Shield, AlertTriangle, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
  const navigate = useNavigate();

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

  const generateResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    // Check for link analysis requests
    if (lowerInput.includes("link") && (lowerInput.includes("safe") || lowerInput.includes("check"))) {
      // Extract URLs from the message
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls = userInput.match(urlRegex);
      
      if (urls && urls.length > 0) {
        return `I analyzed the link: ${urls[0]}\n\nThis appears to be a ${Math.random() > 0.5 ? "shortened" : "suspicious"} URL that could potentially lead to a harmful website. Here's what I recommend:\n\n1. Don't click on it without proper inspection\n2. Use our Deep Link Inspection tool to analyze it thoroughly\n3. If you need to visit it, use the SafeView browser\n\nWould you like me to redirect you to our Link Inspection tool to analyze this URL?`;
      } else {
        return "When checking links for safety, I look for:\n\n1. Shortened URLs that hide the real destination\n2. Misspelled domain names (like 'amaz0n.com')\n3. Suspicious subdomains (legitimate-site.malicious-domain.com)\n4. HTTP instead of HTTPS\n5. Unusual TLDs (.xyz, .tk, etc.)\n\nIf you have a specific link you'd like me to check, please share it, or use our Deep Link Inspection tool for a thorough analysis.";
      }
    }
    
    // Check for scam identification
    else if (lowerInput.includes("scam") || lowerInput.includes("phishing") || 
             lowerInput.includes("fraud") || lowerInput.includes("fake")) {
      
      if (lowerInput.includes("email") || lowerInput.includes("message") || lowerInput.includes("won") || 
          lowerInput.includes("prize") || lowerInput.includes("lottery")) {
        
        return "Based on what you described, this has several red flags of a typical scam:\n\n1. Unexpected prizes or winnings you didn't enter\n2. Creating a false sense of urgency\n3. Requesting personal or financial information\n4. Offers that seem too good to be true\n\nI recommend:\n- Don't reply or click any links\n- Block the sender\n- Report it as phishing\n- Use our Scam Intelligence Engine to analyze the full message\n\nWould you like me to help you report this?";
      } else {
        return "Common signs of online scams include:\n\n1. Creating urgency or fear ('Act now!')\n2. Promising unrealistic rewards\n3. Requesting sensitive information\n4. Poor grammar and spelling\n5. Suspicious sender addresses\n6. Threatening language or consequences\n\nIf you've encountered something specific you're concerned about, feel free to share more details and I can help evaluate it.";
      }
    }
    
    // Check for password advice
    else if (lowerInput.includes("password") || lowerInput.includes("secure") || 
             lowerInput.includes("strong") || lowerInput.includes("hack")) {
      
      return "Here are my top recommendations for secure passwords:\n\n1. Use at least 12-16 characters\n2. Combine uppercase, lowercase, numbers, and symbols\n3. Avoid personal information (names, birthdays)\n4. Don't reuse passwords across different sites\n5. Consider using a password manager\n6. Enable two-factor authentication whenever possible\n\nOur Password Risk Checker tool can verify if your credentials have been compromised in any data breaches. Would you like me to guide you to that tool?";
    }
    
    // Check for email security
    else if (lowerInput.includes("email") || lowerInput.includes("gmail") || 
             lowerInput.includes("outlook") || lowerInput.includes("yahoo")) {
      
      return "To protect your email account:\n\n1. Use a strong, unique password\n2. Enable two-factor authentication\n3. Be cautious with attachments from unknown senders\n4. Look for spoofed sender addresses\n5. Hover over links before clicking\n6. Keep your email client and devices updated\n\nOur Email Threat Scanner can help analyze suspicious messages for potential threats. Would you like to try it?";
    }
    
    // Check for social media security
    else if (lowerInput.includes("facebook") || lowerInput.includes("instagram") || 
             lowerInput.includes("tiktok") || lowerInput.includes("twitter") || 
             lowerInput.includes("social") || lowerInput.includes("account")) {
      
      return "For social media security:\n\n1. Use strong, unique passwords for each platform\n2. Enable two-factor authentication\n3. Review privacy settings regularly\n4. Be cautious of friend/follow requests from strangers\n5. Report suspicious accounts\n6. Be wary of 'urgent' messages from friends that seem unusual\n\nOur Social Media Protection tool can help identify fake profiles and potential scam accounts. Would you like me to guide you there?";
    }
    
    // Check for general security advice
    else if (lowerInput.includes("protect") || lowerInput.includes("safety") || 
             lowerInput.includes("security") || lowerInput.includes("privacy") || 
             lowerInput.includes("safe")) {
      
      return "Here are fundamental online security practices:\n\n1. Keep software and devices updated\n2. Use strong, unique passwords\n3. Enable two-factor authentication\n4. Be cautious with personal information\n5. Verify websites before entering credentials\n6. Use trusted WiFi networks or a VPN\n7. Watch out for phishing attempts\n8. Regularly back up important data\n\nIs there a specific area of online security you'd like to know more about?";
    }
    
    // Help with tools
    else if (lowerInput.includes("tool") || lowerInput.includes("feature") || 
             lowerInput.includes("option") || lowerInput.includes("help") || 
             lowerInput.includes("how")) {
      
      return "PistaSecure offers several security tools:\n\n1. AI Scam Intelligence - Analyze suspicious messages\n2. Deep Link Inspection - Check URLs for safety\n3. Email Threat Scanner - Detect phishing emails\n4. SafeView Browser - Safely view suspicious websites\n5. Password Risk Checker - Check for compromised passwords\n6. Social Media Protection - Detect fake profiles\n7. Scam Report Generator - Create official reports\n8. Live Threat Feed - Stay updated on current threats\n\nWhich of these would you like to learn more about?";
    }
    
    // Default response for other queries
    else {
      const responses = [
        "I'm here to help with any cybersecurity questions. Could you provide more details about your concern?",
        "I'd be happy to assist with your online security. Could you elaborate on what you're looking for?",
        "As your security assistant, I can help protect you online. What specific area are you concerned about?",
        "I can provide guidance on staying safe online. Could you share more about your question?",
        "I'm designed to help with digital security matters. What particular issue would you like assistance with?"
      ];
      
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

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
    
    // Simulate AI processing time
    setTimeout(() => {
      const response = generateResponse(userMessage.content);
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
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
      toast.success("Message copied to clipboard");
    }
  };

  const handleToolRedirect = (path: string) => {
    navigate(path);
    toast.success("Redirecting to tool");
  };

  // Check if the message contains tool suggestions and add action buttons
  const renderMessage = (message: Message) => {
    if (message.sender === 'user') {
      return message.content;
    }
    
    let content = message.content;
    
    // Add buttons for tool references
    const linkInspectionRegex = /(link inspection|check.*link|analyze.*url)/i;
    const scamIntelRegex = /(scam intelligence|analyze message|scan for scam)/i;
    const passwordRegex = /(password risk|check.*password|password.*check)/i;
    const safeViewRegex = /(safeview|safe view|safely view|browse safely)/i;
    const socialProtectionRegex = /(social media|social protection|fake profile)/i;
    
    // Create the formatted message with potential buttons
    return (
      <>
        <div className="whitespace-pre-wrap">{content}</div>
        
        {/* Tool recommendation buttons based on content */}
        <div className="mt-3 flex flex-wrap gap-2">
          {linkInspectionRegex.test(content) && (
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs flex items-center gap-1 border-pistachio text-pistachio"
              onClick={() => handleToolRedirect('/link-inspection')}
            >
              <Link className="h-3 w-3" />
              Open Link Inspector
            </Button>
          )}
          
          {scamIntelRegex.test(content) && (
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs flex items-center gap-1 border-pistachio text-pistachio"
              onClick={() => handleToolRedirect('/scam-intelligence')}
            >
              <Shield className="h-3 w-3" />
              Scan for Scams
            </Button>
          )}
          
          {passwordRegex.test(content) && (
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs flex items-center gap-1 border-pistachio text-pistachio"
              onClick={() => handleToolRedirect('/password-checker')}
            >
              <Shield className="h-3 w-3" />
              Check Password
            </Button>
          )}
          
          {safeViewRegex.test(content) && (
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs flex items-center gap-1 border-pistachio text-pistachio"
              onClick={() => handleToolRedirect('/safe-view')}
            >
              <Shield className="h-3 w-3" />
              Open SafeView
            </Button>
          )}
          
          {socialProtectionRegex.test(content) && (
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs flex items-center gap-1 border-pistachio text-pistachio"
              onClick={() => handleToolRedirect('/social-protection')}
            >
              <Shield className="h-3 w-3" />
              Social Protection
            </Button>
          )}
        </div>
      </>
    );
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
                            {renderMessage(message)}
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
