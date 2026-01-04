import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { WardrobeItem, getItemsByCategory } from '@/data/wardrobeData';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  outfit?: {
    top: WardrobeItem;
    bottom: WardrobeItem;
    topIndex: number;
    bottomIndex: number;
  };
}

const DRESSUP_STORAGE_KEY = 'dressup-outfit';

// Keywords for outfit matching
const FORMAL_KEYWORDS = ['dinner', 'date', 'night', 'formal', 'party', 'evening', 'elegant', 'akşam', 'randevu', 'davet'];
const CASUAL_KEYWORDS = ['casual', 'coffee', 'weekend', 'walk', 'relax', 'chill', 'kahve', 'hafta sonu', 'yürüyüş', 'rahat'];

// Helper to get random item from array
const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Get items by category (non-sponsored only)
const getTops = () => getItemsByCategory('tops').filter(item => !item.isSponsored);
const getBottoms = () => getItemsByCategory('bottoms').filter(item => !item.isSponsored);

// Formal items (dark/elegant)
const FORMAL_TOP_IDS = ['top-3', 'top-8', 'top-7']; // blazer, blouse, tank
const FORMAL_BOTTOM_IDS = ['bottom-2', 'bottom-5', 'bottom-8']; // pleated skirt, midi skirt, leather skirt

// Casual items
const CASUAL_TOP_IDS = ['top-1', 'top-9', 'top-11', 'top-2']; // tshirt, hoodie, white tshirt, crop top
const CASUAL_BOTTOM_IDS = ['bottom-1', 'bottom-3', 'bottom-7']; // cargo, leggings, denim skirt

function getItemIndex(category: 'tops' | 'bottoms', itemId: string): number {
  const items = getItemsByCategory(category);
  return items.findIndex(item => item.id === itemId);
}

function simulateAIResponse(userText: string): { text: string; outfit?: { top: WardrobeItem; bottom: WardrobeItem; topIndex: number; bottomIndex: number } } {
  const lowerText = userText.toLowerCase();
  
  // Check for formal keywords
  if (FORMAL_KEYWORDS.some(keyword => lowerText.includes(keyword))) {
    const formalTops = getTops().filter(t => FORMAL_TOP_IDS.includes(t.id));
    const formalBottoms = getBottoms().filter(b => FORMAL_BOTTOM_IDS.includes(b.id));
    
    const top = formalTops.length > 0 ? getRandomItem(formalTops) : getRandomItem(getTops());
    const bottom = formalBottoms.length > 0 ? getRandomItem(formalBottoms) : getRandomItem(getBottoms());
    
    return {
      text: "Özel bir gece için şık ve zarif bir şeyler önereyim. ✨",
      outfit: { 
        top, 
        bottom, 
        topIndex: getItemIndex('tops', top.id),
        bottomIndex: getItemIndex('bottoms', bottom.id)
      }
    };
  }
  
  // Check for casual keywords
  if (CASUAL_KEYWORDS.some(keyword => lowerText.includes(keyword))) {
    const casualTops = getTops().filter(t => CASUAL_TOP_IDS.includes(t.id));
    const casualBottoms = getBottoms().filter(b => CASUAL_BOTTOM_IDS.includes(b.id));
    
    const top = casualTops.length > 0 ? getRandomItem(casualTops) : getRandomItem(getTops());
    const bottom = casualBottoms.length > 0 ? getRandomItem(casualBottoms) : getRandomItem(getBottoms());
    
    return {
      text: "Rahat ve şık bir hafta sonu kombini hazırladım! 🌿",
      outfit: { 
        top, 
        bottom, 
        topIndex: getItemIndex('tops', top.id),
        bottomIndex: getItemIndex('bottoms', bottom.id)
      }
    };
  }
  
  // Default response
  return {
    text: "Sana yardımcı olmak isterim! Nereye gidiyorsun? (örn: 'Akşam yemeği', 'Kahve', 'Hafta sonu')"
  };
}

export default function AIStylist() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      text: "Merhaba! Ben MIRA, senin kişisel stil danışmanın. 👋\n\nBugün nereye gidiyorsun? Sana mükemmel bir kombin önerebilirim."
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: inputValue.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const response = simulateAIResponse(userMessage.text);
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        text: response.text,
        outfit: response.outfit
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleTryOnAvatar = (outfit: { top: WardrobeItem; bottom: WardrobeItem; topIndex: number; bottomIndex: number }) => {
    // Save selected items to localStorage (same format as DressUp)
    const outfitState = {
      tops: outfit.topIndex,
      bottoms: outfit.bottomIndex
    };
    localStorage.setItem(DRESSUP_STORAGE_KEY, JSON.stringify(outfitState));
    // Navigate to the builder
    navigate('/dressup');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-md flex flex-col min-h-screen relative">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border/50 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center">
              <span className="text-lg">✨</span>
            </div>
            <div>
              <h1 className="font-semibold text-foreground">MIRA Stilist</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">Çevrimiçi</span>
              </div>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 pb-40 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3",
                  message.role === 'user'
                    ? 'bg-accent text-accent-foreground rounded-br-md'
                    : 'bg-muted text-foreground rounded-bl-md'
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                
                {/* Outfit Card */}
                {message.outfit && (
                  <div className="mt-3 bg-card rounded-xl p-3 border border-border/50">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Önerilen Kombin</p>
                    <div className="flex gap-2 mb-3">
                      <div className="flex-1 aspect-square bg-background rounded-lg p-2 flex items-center justify-center">
                        <img 
                          src={message.outfit.top.src} 
                          alt="Üst" 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="flex-1 aspect-square bg-background rounded-lg p-2 flex items-center justify-center">
                        <img 
                          src={message.outfit.bottom.src} 
                          alt="Alt" 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleTryOnAvatar(message.outfit!)}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      size="sm"
                    >
                      Avatarda Dene →
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md bg-card/95 backdrop-blur-lg border-t border-border/50 px-4 py-3">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Mesaj yaz..."
              className="flex-1 bg-muted border-0 focus-visible:ring-1 focus-visible:ring-accent"
              disabled={isTyping}
            />
            <Button 
              onClick={handleSend}
              size="icon"
              className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0"
              disabled={!inputValue.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
