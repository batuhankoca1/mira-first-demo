import { useState, useEffect } from 'react';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  joinedAt: string;
}

const MOCK_USER: MockUser = {
  id: 'demo-user-001',
  name: 'Aylin Demir',
  email: 'aylin@mira.app',
  avatar: null,
  joinedAt: '2024-09-15',
};

const WARDROBE_KEY = 'mira-wardrobe-count';

export function useMockUser() {
  const [user] = useState<MockUser>(MOCK_USER);
  const [wardrobeCount, setWardrobeCount] = useState(0);
  const [outfitCount, setOutfitCount] = useState(0);

  useEffect(() => {
    // Calculate wardrobe count from localStorage or default demo items
    try {
      const savedCount = localStorage.getItem(WARDROBE_KEY);
      if (savedCount) {
        setWardrobeCount(parseInt(savedCount, 10));
      } else {
        // Default demo: 12 items (tops) + 7 items (bottoms)
        setWardrobeCount(19);
      }
      // Demo outfit count
      setOutfitCount(5);
    } catch {
      setWardrobeCount(19);
      setOutfitCount(5);
    }
  }, []);

  return {
    user,
    isLoggedIn: true,
    wardrobeCount,
    outfitCount,
  };
}
