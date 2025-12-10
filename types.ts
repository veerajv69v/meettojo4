export type Gender = 'Male' | 'Female' | 'Other';

export interface UserDetails {
  height?: string;
  exercise?: string;
  educationLevel?: string;
  drinking?: string;
  smoking?: string;
  lookingFor?: string;
  kids?: string;
  haveKids?: string;
  starSign?: string;
  politics?: string;
  religion?: string;
  languages?: string[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Gender;
  interestedIn: Gender;
  about: string;
  avatarUrl: string; // Keeps the main avatar easily accessible
  photos: string[]; // Array of up to 6 photos
  age: number;
  isOnline: boolean;
  distance: number; // in miles
  
  // Extended Profile Fields
  work?: string;
  education?: string;
  hometown?: string;
  currentLocation?: string;
  interests: string[];
  details: UserDetails;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text?: string;
  giftId?: string; // If present, it's a gift message
  timestamp: number;
  isRead: boolean;
}

export interface ChatConversation {
  id: string;
  partnerId: string;
  lastMessage: string;
  unreadCount: number;
  timestamp: number;
  messages: ChatMessage[];
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
}

export interface Gift {
  id: string;
  name: string;
  icon: string; // Emoji or Lucide icon name
  cost: number;
}

export type AppView = 'AUTH' | 'DISCOVER' | 'PEOPLE' | 'LIKED_YOU' | 'CHAT' | 'PROFILE';