import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
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
const FORMAL_KEYWORDS = ['dinner', 'date', 'night', 'formal', 'party', 'evening', 'elegant', 'akşam', 'randevu', 'davet', 'ofis', 'office', 'şıklık', 'toplantı', 'iş'];
const CASUAL_KEYWORDS = ['casual', 'coffee', 'weekend', 'walk', 'relax', 'chill', 'kahve', 'hafta sonu', 'yürüyüş', 'rahat'];

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const getTops = () => getItemsByCategory('tops').filter(item => !item.isSponsored);
const getBottoms = () => getItemsByCategory('bottoms').filter(item => !item.isSponsored);

const FORMAL_TOP_IDS = ['top-3', 'top-8', 'top-7'];
const FORMAL_BOTTOM_IDS = ['bottom-2', 'bottom-5', 'bottom-8'];
const CASUAL_TOP_IDS = ['top-1', 'top-9', 'top-11', 'top-2'];
const CASUAL_BOTTOM_IDS = ['bottom-1', 'bottom-3', 'bottom-7'];

function getItemIndex(category: 'tops' | 'bottoms', itemId: string): number {
  const items = getItemsByCategory(category);
  return items.findIndex(item => item.id === itemId);
}

function simulateAIResponse(userText: string): { text: string; outfit?: { top: WardrobeItem; bottom: WardrobeItem; topIndex: number; bottomIndex: number } } {
  const lowerText = userText.toLowerCase();
  
  if (FORMAL_KEYWORDS.some(keyword => lowerText.includes(keyword))) {
    const formalTops = getTops().filter(t => FORMAL_TOP_IDS.includes(t.id));
    const formalBottoms = getBottoms().filter(b => FORMAL_BOTTOM_IDS.includes(b.id));
    
    const top = formalTops.length > 0 ? getRandomItem(formalTops) : getRandomItem(getTops());
    const bottom = formalBottoms.length > 0 ? getRandomItem(formalBottoms) : getRandomItem(getBottoms());
    
    return {
      text: "Özel bir gece için şık ve zarif bir kombin önereyim. ✨",
      outfit: { 
        top, 
        bottom, 
        topIndex: getItemIndex('tops', top.id),
        bottomIndex: getItemIndex('bottoms', bottom.id)
      }
    };
  }
  
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
  
  return {
    text: "Sana yardımcı olmak isterim! Nereye gidiyorsun? (örn: 'Akşam yemeği', 'Kahve', 'Hafta sonu')"
  };
}

const QUICK_CHIPS = [
  { emoji: '📅', label: 'Date Night' },
  { emoji: '💼', label: 'Ofis' },
  { emoji: '☕', label: 'Kahve' },
  { emoji: '☀️', label: 'Haftasonu' },
];

interface AIStylistDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIStylistDrawer({ open, onOpenChange }: AIStylistDrawerProps) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      text: "Merhaba! Ben MIRA, senin kişisel stil danışmanın. 👋\n\nBugün nereye gidiyorsun?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const showQuickChips = messages.length === 1 && messages[0].id === 'welcome';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

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
    }, 1200);
  };

  const handleTryOnAvatar = (outfit: { top: WardrobeItem; bottom: WardrobeItem; topIndex: number; bottomIndex: number }) => {
    const outfitState = {
      tops: outfit.topIndex,
      bottoms: outfit.bottomIndex
    };
    localStorage.setItem(DRESSUP_STORAGE_KEY, JSON.stringify(outfitState));
    onOpenChange(false);
    navigate('/dressup');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[85vh] rounded-t-3xl bg-gradient-to-b from-amber-50 to-[#fdf6ed] border-t-2 border-amber-200 p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="px-4 pt-4 pb-3 border-b border-amber-200/50 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <SheetTitle className="text-left text-amber-900 font-serif">MIRA Stilist</SheetTitle>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-amber-700">Çevrimiçi</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => onOpenChange(false)}
              className="w-8 h-8 rounded-full bg-amber-100 hover:bg-amber-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-amber-700" />
            </button>
          </div>
        </SheetHeader>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
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
                  "max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm",
                  message.role === 'user'
                    ? 'bg-amber-600 text-white rounded-br-md'
                    : 'bg-white text-amber-900 rounded-bl-md border border-amber-200/50'
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                
                {/* Outfit Card */}
                {message.outfit && (
                  <div className="mt-3 bg-amber-50 rounded-xl p-3 border border-amber-200/50">
                    <p className="text-xs font-medium text-amber-700 mb-2">Önerilen Kombin</p>
                    <div className="flex gap-2 mb-3">
                      <div className="flex-1 aspect-square bg-white rounded-lg p-2 flex items-center justify-center border border-amber-100">
                        <img 
                          src={message.outfit.top.src} 
                          alt="Üst" 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="flex-1 aspect-square bg-white rounded-lg p-2 flex items-center justify-center border border-amber-100">
                        <img 
                          src={message.outfit.bottom.src} 
                          alt="Alt" 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleTryOnAvatar(message.outfit!)}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white"
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
              <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 border border-amber-200/50 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="shrink-0 bg-white/80 backdrop-blur-sm border-t border-amber-200/50 px-4 py-3">
          {/* Quick Start Chips */}
          {showQuickChips && (
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => sendMessage(chip.label)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-amber-100 hover:bg-amber-200 border border-amber-200 text-sm font-medium text-amber-800 whitespace-nowrap transition-colors shrink-0"
                >
                  <span>{chip.emoji}</span>
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          )}
          
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Mesaj yaz..."
              className="flex-1 bg-amber-50 border-amber-200 focus-visible:ring-amber-400"
              disabled={isTyping}
            />
            <Button 
              onClick={() => sendMessage(inputValue)}
              size="icon"
              className="bg-amber-600 hover:bg-amber-700 text-white shrink-0"
              disabled={!inputValue.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Floating Action Button Component
interface AIStylistFABProps {
  onClick: () => void;
}

export function AIStylistFAB({ onClick }: AIStylistFABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-4 z-30 w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-lg shadow-amber-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      aria-label="MIRA Stilist'i Aç"
    >
      <Sparkles className="w-6 h-6 text-white" />
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-25" />
    </button>
  );
}
