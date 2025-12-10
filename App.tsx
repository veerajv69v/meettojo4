import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, User, Users, Star, Coins, Send, ArrowLeft, Plus, Wallet, Lock, Sparkles, X, Edit2, MapPin, Briefcase, GraduationCap, Home, ChevronRight, Camera, Check, AlertCircle, Eye, Trash2, Ruler, Wine, Cigarette, Baby, Search, Loader, Globe, Book } from 'lucide-react';
import { Button } from './components/Button';
import { GIFTS, MOCK_USERS, PROFILE_OPTIONS, AVAILABLE_INTERESTS } from './constants';
import { AppView, ChatConversation, Gender, User as UserType, WalletTransaction, UserDetails } from './types';

// --- Logic Helpers ---

const calculateProfileCompletion = (user: UserType): number => {
  let score = 0;

  // 1. Photos (30%)
  const photoCount = user.photos ? user.photos.length : 0;
  score += Math.min(photoCount, 6) * 5;

  // 2. Basic Info (30%)
  if (user.about) score += 5;
  if (user.age) score += 5;
  if (user.gender) score += 5;
  if (user.currentLocation) score += 5;
  if (user.work) score += 5;
  if (user.education) score += 5;

  // 3. Interests (20%)
  const interestCount = user.interests ? user.interests.length : 0;
  score += Math.min(interestCount, 5) * 4;

  // 4. More About You (20%)
  const details = user.details || {};
  const detailFields = [
    'height', 'exercise', 'drinking', 'smoking', 'lookingFor', 
    'kids', 'starSign', 'politics', 'religion', 'languages'
  ];
  
  let detailsCount = 0;
  detailFields.forEach(field => {
    const val = details[field as keyof UserDetails];
    if (Array.isArray(val) ? val.length > 0 : !!val) {
      detailsCount++;
    }
  });
  score += Math.min(detailsCount, 10) * 2;

  return Math.min(Math.round(score), 100);
};

// --- Reusable Components ---

interface BottomSheetProps {
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  actions 
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[100] flex items-end bg-black/50 animate-fade-in">
      <div 
        className="w-full bg-white rounded-t-3xl max-h-[90vh] flex flex-col animate-slide-up shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={20} className="text-gray-500" />
          </button>
          <h3 className="font-bold text-lg text-gray-900">{title}</h3>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
        <div className="overflow-y-auto p-4 flex-1">
          {children}
        </div>
        {actions && (
          <div className="p-4 border-t border-gray-100">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Sub Views ---

// 1. Auth View
const AuthView = ({ onLogin }: { onLogin: (user: Partial<UserType>) => void }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'Male' as Gender,
    interestedIn: 'Female' as Gender,
    about: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ 
      ...formData, 
      id: 'me', 
      age: 25, 
      avatarUrl: 'https://picsum.photos/400/400',
      photos: ['https://picsum.photos/400/400'],
      isOnline: true,
      distance: 0,
      interests: [],
      details: {}
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-white overflow-y-auto no-scrollbar">
      <div className="w-20 h-20 bg-rose-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-rose-500/20 transform rotate-3">
        <Heart className="w-10 h-10 text-white fill-white" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Meettojo</h1>
      <p className="text-gray-500 mb-8 text-center">Find your perfect match today.</p>

      <form onSubmit={handleSubmit} className="w-full space-y-4 max-w-sm">
        {isSignUp && (
          <div className="flex gap-2">
            <input 
              required
              placeholder="First Name" 
              className="w-1/2 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-rose-500"
              value={formData.firstName}
              onChange={e => setFormData({...formData, firstName: e.target.value})}
            />
            <input 
              required
              placeholder="Last Name" 
              className="w-1/2 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-rose-500"
              value={formData.lastName}
              onChange={e => setFormData({...formData, lastName: e.target.value})}
            />
          </div>
        )}
        
        <input 
          required type="email"
          placeholder="Email Address" 
          className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-rose-500"
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
        />

        <input 
          required type="password"
          placeholder="Password" 
          className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-rose-500"
        />

        {isSignUp && (
          <>
            <input 
              placeholder="Phone Number" 
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-rose-500"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
            <div className="flex gap-2 items-center text-sm text-gray-600">
              <span>I am a:</span>
              <select 
                className="bg-gray-50 p-2 rounded-lg border"
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value as Gender})}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <span>Interested in:</span>
              <select 
                className="bg-gray-50 p-2 rounded-lg border"
                value={formData.interestedIn}
                onChange={e => setFormData({...formData, interestedIn: e.target.value as Gender})}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </>
        )}

        <Button type="submit" fullWidth className="mt-4">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-gray-500">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <button 
          onClick={() => setIsSignUp(!isSignUp)} 
          className="text-rose-500 font-semibold hover:underline"
        >
          {isSignUp ? 'Log in' : 'Sign up'}
        </button>
      </p>
    </div>
  );
};

// 2. Discover View
const DiscoverView = ({ users, onSwipe, completionScore, onGoToProfile }: { 
  users: UserType[], 
  onSwipe: (id: string, dir: 'left' | 'right' | 'up') => void,
  completionScore: number,
  onGoToProfile: () => void
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState<string | null>(null);

  const currentUser = users[currentIndex];

  if (completionScore < 40) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gray-50">
        <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mb-6 relative">
          <Sparkles className="text-rose-500 w-10 h-10" />
          <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md">
            <Lock size={20} className="text-gray-500" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Unlock Discovery</h3>
        <p className="text-gray-500 mb-8 max-w-xs">
          Your profile is only {completionScore}% complete. Reach 40% to start matching with people nearby!
        </p>
        <div className="w-full max-w-[200px] h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
          <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: `${completionScore}%` }} />
        </div>
        <Button onClick={onGoToProfile} fullWidth>Complete Profile</Button>
      </div>
    );
  }
  
  const handleSwipe = (dir: 'left' | 'right' | 'up') => {
    setLastDirection(dir);
    setTimeout(() => {
      onSwipe(currentUser.id, dir);
      setCurrentIndex(prev => prev + 1);
      setLastDirection(null);
    }, 200);
  };

  if (currentIndex >= users.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Users className="text-gray-400 w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">No more profiles</h3>
        <p className="text-gray-500 mt-2">Check back later for more people nearby.</p>
        <Button onClick={() => setCurrentIndex(0)} className="mt-6" variant="outline">Start Over</Button>
      </div>
    );
  }

  const getCardStyle = () => {
    if (lastDirection === 'left') return 'transform -translate-x-full rotate-[-20deg] opacity-0';
    if (lastDirection === 'right') return 'transform translate-x-full rotate-[20deg] opacity-0';
    if (lastDirection === 'up') return 'transform -translate-y-full opacity-0';
    return '';
  };

  return (
    <div className="h-full relative p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-2xl font-bold text-gray-900">Discover</h2>
        <div className="flex items-center text-gray-500 gap-1 text-sm">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          San Francisco, CA
        </div>
      </div>
      <div className="flex-1 relative">
        <div className={`absolute inset-0 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transition-all duration-500 ease-out ${getCardStyle()}`}>
          <div className="h-3/4 w-full relative">
            <img src={currentUser.avatarUrl} alt={currentUser.firstName} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-3xl font-bold">{currentUser.firstName}, {currentUser.age}</h3>
              <p className="text-white/90 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span> 
                Online • {currentUser.distance} miles away
              </p>
            </div>
          </div>
          <div className="h-1/4 p-4 bg-white flex flex-col justify-between">
            <div>
               <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">About</h4>
               <p className="text-gray-700 line-clamp-2">{currentUser.about}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="h-24 flex items-center justify-center gap-6 mt-4">
        <button onClick={() => handleSwipe('left')} className="w-14 h-14 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-red-500 hover:bg-red-50 hover:scale-110 transition-all"><X size={28} /></button>
        <button onClick={() => handleSwipe('up')} className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-blue-500 hover:bg-blue-50 hover:scale-110 transition-all"><Star size={20} fill="currentColor" className="opacity-50" /></button>
        <button onClick={() => handleSwipe('right')} className="w-14 h-14 rounded-full bg-rose-500 shadow-lg shadow-rose-500/30 flex items-center justify-center text-white hover:bg-rose-600 hover:scale-110 transition-all"><Heart size={28} fill="currentColor" /></button>
      </div>
    </div>
  );
};

// 3. People, 4. Liked, 5. Chat (Standard)

// ... [Existing PeopleView, LikedYouView, ChatView implementations preserved but collapsed for brevity] ...
// Assuming they are unchanged for this specific prompt response, I'll render them as before.

const PeopleView = ({ users, onSelect }: { users: UserType[], onSelect: (u: UserType) => void }) => {
  return (
    <div className="h-full p-4 overflow-y-auto no-scrollbar">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Nearby People</h2>
      <div className="grid grid-cols-2 gap-4">
        {users.map(user => (
          <div key={user.id} onClick={() => onSelect(user)} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow">
            <div className="h-40 relative">
              <img src={user.avatarUrl} alt={user.firstName} className="w-full h-full object-cover" />
              {user.isOnline && <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
            </div>
            <div className="p-3">
              <h3 className="font-bold text-gray-900">{user.firstName}, {user.age}</h3>
              <p className="text-xs text-gray-500 truncate">{user.about}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LikedYouView = ({ users, unlockedIds, onUnlock, walletBalance }: { users: UserType[], unlockedIds: string[], onUnlock: (id: string) => void, walletBalance: number }) => {
  return (
    <div className="h-full p-4 overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Liked You</h2>
        <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full text-yellow-700 text-sm font-semibold"><Coins size={14} /> {walletBalance}</div>
      </div>
      <div className="space-y-4">
        {users.map(user => {
          const isUnlocked = unlockedIds.includes(user.id);
          return (
            <div key={user.id} className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-50">
              <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <img src={user.avatarUrl} className={`w-full h-full object-cover ${!isUnlocked ? 'filter blur-md scale-110' : ''}`} alt="Hidden" />
                {!isUnlocked && <div className="absolute inset-0 flex items-center justify-center bg-black/20"><Lock className="text-white w-6 h-6" /></div>}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{isUnlocked ? `${user.firstName}, ${user.age}` : 'Someone nearby'}</h3>
                <p className="text-sm text-gray-500">{isUnlocked ? 'Liked your profile just now' : 'Unlock to see who likes you'}</p>
              </div>
              {!isUnlocked && <Button className="px-4 py-2 text-xs" onClick={() => onUnlock(user.id)}><Coins size={12} className="mr-1" /> 50</Button>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ChatView = ({ chats, onSelectChat, activeChatId, onBack, messages, onSendMessage, onSendGift, currentUserId, walletBalance }: any) => {
  const [inputText, setInputText] = useState('');
  const [showGiftModal, setShowGiftModal] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  if (activeChatId) {
    const activeConversation = chats.find((c: any) => c.id === activeChatId);
    const partner = MOCK_USERS.find(u => u.id === activeConversation.partnerId);
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex items-center gap-3 p-4 border-b border-gray-100 shadow-sm z-10">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={24} className="text-gray-600" /></button>
          <div className="relative">
            <img src={partner?.avatarUrl} className="w-10 h-10 rounded-full object-cover" />
            {partner?.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{partner?.firstName}</h3>
            <span className="text-xs text-gray-500">{partner?.isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg: any) => {
            const isMe = msg.senderId === currentUserId;
            const gift = msg.giftId ? GIFTS.find(g => g.id === msg.giftId) : null;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl p-3 ${isMe ? 'bg-rose-500 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}`}>
                  {gift ? (
                    <div className="flex flex-col items-center p-2 min-w-[120px]">
                       <div className="text-5xl animate-bounce mb-2">{gift.icon}</div>
                       <p className="font-bold text-sm">{isMe ? 'You sent a gift!' : 'Sent you a gift!'}</p>
                       <span className="text-xs opacity-80">{gift.name}</span>
                    </div>
                  ) : (<p>{msg.text}</p>)}
                  <span className={`text-[10px] block mt-1 text-right ${isMe ? 'text-rose-100' : 'text-gray-400'}`}>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-3 border-t border-gray-100 bg-white flex items-center gap-2">
          <button onClick={() => setShowGiftModal(true)} className="p-3 bg-rose-50 text-rose-500 rounded-full hover:bg-rose-100 transition-colors"><Sparkles size={20} /></button>
          <input value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && inputText && (onSendMessage(inputText), setInputText(''))} placeholder="Type a message..." className="flex-1 bg-gray-100 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20" />
          <button disabled={!inputText} onClick={() => { onSendMessage(inputText); setInputText(''); }} className="p-3 bg-rose-500 text-white rounded-full disabled:opacity-50 hover:bg-rose-600 transition-colors"><Send size={20} /></button>
        </div>
        {showGiftModal && (
          <div className="absolute inset-0 bg-black/50 z-50 flex items-end">
            <div className="bg-white w-full rounded-t-3xl p-6 animate-slide-up">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Send a Gift</h3>
                <div className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full font-bold text-sm"><Coins size={14} /> {walletBalance}</div>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {GIFTS.map(gift => (
                  <button key={gift.id} onClick={() => { onSendGift(gift); setShowGiftModal(false); }} disabled={walletBalance < gift.cost} className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-gray-50 active:scale-95 transition-transform disabled:opacity-40">
                    <div className="text-4xl">{gift.icon}</div>
                    <span className="text-xs font-semibold">{gift.name}</span>
                    <span className="text-xs text-yellow-600 font-bold flex items-center"><Coins size={10} className="mr-1" /> {gift.cost}</span>
                  </button>
                ))}
              </div>
              <Button variant="secondary" fullWidth onClick={() => setShowGiftModal(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="h-full p-4 overflow-y-auto no-scrollbar">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Messages</h2>
      <div className="space-y-4">
        {chats.map((chat: any) => {
          const partner = MOCK_USERS.find(u => u.id === chat.partnerId);
          return (
            <div key={chat.id} onClick={() => onSelectChat(chat.id)} className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-50 active:scale-[0.99] transition-transform cursor-pointer">
              <div className="relative">
                <img src={partner?.avatarUrl} className="w-14 h-14 rounded-full object-cover" />
                {chat.unreadCount > 0 && <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-white">{chat.unreadCount}</div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1"><h3 className="font-bold text-gray-900">{partner?.firstName}</h3><span className="text-xs text-gray-400">10m</span></div>
                <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>{chat.lastMessage}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

// --- PROFILE COMPONENTS ---

// SCREEN 7: Profile Preview (Public View)
const ProfilePreview = ({ user, onClose }: { user: UserType, onClose: () => void }) => {
  return (
    <div className="h-full bg-white absolute inset-0 z-50 overflow-y-auto animate-fade-in no-scrollbar">
      <div className="h-[55vh] relative">
        <img src={user.photos?.[0] || user.avatarUrl} className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4 z-10">
          <button onClick={onClose} className="p-2 bg-black/40 text-white rounded-full hover:bg-black/60 backdrop-blur-md">
            <ArrowLeft size={24} />
          </button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 text-white max-w-[80%]">
          <h1 className="text-4xl font-bold mb-1">{user.firstName}, {user.age}</h1>
          <div className="flex items-center gap-2 text-sm font-medium opacity-90">
             <Briefcase size={14} /> {user.work || 'No Job'}
          </div>
          <div className="flex items-center gap-2 text-sm font-medium opacity-90 mt-1">
             <MapPin size={14} /> {user.currentLocation || 'Unknown Location'}
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-8 pb-20">
         {user.about && (
           <section>
             <h3 className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-2">About</h3>
             <p className="text-gray-700 leading-relaxed text-lg">{user.about}</p>
           </section>
         )}

         {user.interests.length > 0 && (
           <section>
             <h3 className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-3">Interests</h3>
             <div className="flex flex-wrap gap-2">
               {user.interests.map(i => (
                 <span key={i} className="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium text-gray-700">
                   {i}
                 </span>
               ))}
             </div>
           </section>
         )}

         <section>
           <h3 className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-3">Basics</h3>
           <div className="space-y-3">
             {[
               { icon: <Ruler size={18} />, label: user.details?.height || 'Height' },
               { icon: <GraduationCap size={18} />, label: user.education || 'Education' },
               { icon: <Home size={18} />, label: user.hometown || 'Hometown' },
               { icon: <User size={18} />, label: user.details?.lookingFor || 'Looking For' },
               { icon: <Baby size={18} />, label: user.details?.kids || 'Kids' },
               { icon: <Star size={18} />, label: user.details?.starSign || 'Star Sign' },
               { icon: <Book size={18} />, label: user.details?.religion || 'Religion' },
               { icon: <Wine size={18} />, label: user.details?.drinking || 'Drinking' },
               { icon: <Cigarette size={18} />, label: user.details?.smoking || 'Smoking' },
               { icon: <Globe size={18} />, label: user.details?.languages?.join(', ') || 'Languages' },
             ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-700">
                   <span className="text-gray-400">{item.icon}</span>
                   <span className="capitalize">{item.label}</span>
                </div>
             ))}
           </div>
         </section>
      </div>
    </div>
  );
};

// SCREEN 1: Profile Overview (Main Page)
const ProfileOverview = ({ user, completionScore, onEdit, onPreview, walletBalance }: any) => {
  return (
    <div className="h-full bg-gray-50 flex flex-col relative">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Main Photo Card */}
        <div className="relative h-[55vh] w-full bg-gray-200">
          <img src={user.photos?.[0] || user.avatarUrl} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
          
          <div className="absolute top-4 right-4 z-10">
             <button onClick={onPreview} className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition">
               <Eye size={20} />
             </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-3xl font-bold mb-1">{user.firstName}, {user.age}</h1>
            <div className="flex flex-wrap gap-3 text-sm font-medium text-white/90 mb-6">
              <span className="flex items-center gap-1"><User size={14} /> {user.gender}</span>
              <span className="flex items-center gap-1"><MapPin size={14} /> {user.currentLocation || 'No Location'}</span>
              <span className="flex items-center gap-1"><Briefcase size={14} /> {user.work || 'No Job'}</span>
            </div>
            
            {/* Completion Card */}
            <div className="bg-white rounded-xl p-4 shadow-lg text-gray-900 transform translate-y-2">
               <div className="flex justify-between items-center mb-2">
                 <span className="font-bold text-sm">Profile Completion</span>
                 <span className="font-bold text-rose-500 text-sm">{completionScore}%</span>
               </div>
               <div className="w-full h-2 bg-gray-100 rounded-full mb-3 overflow-hidden">
                 <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: `${completionScore}%` }} />
               </div>
               <p className="text-xs text-gray-500 mb-3">
                 {completionScore < 100 ? "Add more photos to get 2x matches!" : "You're all set!"}
               </p>
               <Button onClick={onEdit} fullWidth className="py-2 text-sm">
                 {completionScore < 100 ? "Complete my profile" : "Edit Profile"}
               </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 px-4 space-y-4">
           {/* Quick Preview Cards */}
           <div onClick={onEdit} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer active:scale-[0.99] transition">
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">My Bio</h3>
                <p className="text-gray-500 text-sm line-clamp-1">{user.about || "Write something..."}</p>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
           </div>

           <div onClick={onEdit} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer active:scale-[0.99] transition">
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">My Interests</h3>
                <div className="flex gap-1 overflow-hidden h-6">
                  {user.interests.length > 0 ? user.interests.slice(0, 3).map((i: string) => (
                    <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded text-[10px] font-bold border border-rose-100">{i}</span>
                  )) : <span className="text-gray-400 text-xs italic">Add interests</span>}
                  {user.interests.length > 3 && <span className="text-gray-400 text-xs">+{user.interests.length - 3}</span>}
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
           </div>
           
           {/* Wallet */}
           <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-xl shadow-sm text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="bg-white/20 p-2 rounded-full"><Wallet size={20} /></div>
                 <div>
                   <p className="text-xs font-bold opacity-80 uppercase">Coin Balance</p>
                   <p className="text-xl font-bold">{walletBalance}</p>
                 </div>
              </div>
              <Button variant="secondary" className="bg-white/20 text-white border border-white/40 hover:bg-white/30 text-xs py-2 px-4 shadow-none">Top Up</Button>
           </div>
        </div>
      </div>
    </div>
  );
};

// SCREENS 2-6: Profile Editor Hub
const ProfileEditor = ({ user, onSave, onCancel }: { user: UserType, onSave: (u: UserType) => void, onCancel: () => void }) => {
  const [editedUser, setEditedUser] = useState<UserType>(JSON.parse(JSON.stringify(user)));
  const [activeSheet, setActiveSheet] = useState<string | null>(null); // 'BIO' | 'INTERESTS' | 'FIELD_KEY'
  
  // Section Definitions
  const LIFESTYLE_KEYS = ['exercise', 'drinking', 'smoking', 'educationLevel'];
  const PREFERENCE_KEYS = ['lookingFor', 'kids', 'haveKids', 'starSign', 'religion', 'politics'];
  
  // Photo Manager Logic
  const handlePhotoUpload = (index: number) => {
    // Mock upload flow
    const newPhotos = [...(editedUser.photos || [])];
    if (newPhotos[index]) {
      // If photo exists, delete it (Screen 2 requirement)
      if (confirm("Remove this photo?")) {
        newPhotos.splice(index, 1);
      }
    } else {
      // Add new photo
      newPhotos.push(`https://picsum.photos/400/600?random=${Date.now()}`);
    }
    setEditedUser({...editedUser, photos: newPhotos, avatarUrl: newPhotos[0] || ''});
  };

  const updateDetail = (key: keyof UserDetails, value: string | string[]) => {
    setEditedUser(prev => ({
      ...prev,
      details: { ...prev.details, [key]: value }
    }));
  };

  const getOptionList = (key: string) => {
     // @ts-ignore
     return PROFILE_OPTIONS[key] || [];
  };

  const formatLabel = (key: string) => {
    const spaced = key.replace(/([A-Z])/g, ' $1').trim();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col animate-slide-up absolute inset-0 z-50">
      {/* Navbar */}
      <div className="bg-white px-4 py-3 flex justify-between items-center border-b shadow-sm sticky top-0 z-10">
        <button onClick={onCancel} className="text-gray-500 font-medium hover:bg-gray-50 px-3 py-1 rounded-lg">Cancel</button>
        <h2 className="font-bold text-lg">Edit Profile</h2>
        <button onClick={() => onSave(editedUser)} className="text-rose-500 font-bold hover:bg-rose-50 px-3 py-1 rounded-lg">Save</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* SCREEN 2: Photo Management */}
        <section>
          <div className="flex justify-between items-end mb-2">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Profile Photos</h3>
            <span className="text-xs text-gray-400">Tap to add/remove</span>
          </div>
          <div className="grid grid-cols-3 grid-rows-2 gap-3 aspect-[3/4]">
             {[0, 1, 2, 3, 4, 5].map((idx) => {
               const photo = editedUser.photos?.[idx];
               const isMain = idx === 0;
               return (
                 <div 
                   key={idx} 
                   onClick={() => handlePhotoUpload(idx)}
                   className={`relative rounded-xl overflow-hidden bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition ${isMain ? 'row-span-2 col-span-2' : ''}`}
                 >
                   {photo ? (
                     <>
                       <img src={photo} className="w-full h-full object-cover" />
                       <div className="absolute bottom-2 right-2 bg-black/60 p-1.5 rounded-full text-white backdrop-blur-sm">
                         <Trash2 size={14} />
                       </div>
                       {isMain && <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">Main Photo</div>}
                     </>
                   ) : (
                     <div className="flex flex-col items-center gap-1 text-gray-400">
                        <Plus size={24} />
                     </div>
                   )}
                 </div>
               )
             })}
          </div>
        </section>

        {/* SCREEN 3: Basic Info */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
           <h3 className="font-bold text-gray-900 p-4 border-b border-gray-50 bg-gray-50/50">My Basics</h3>
           <div className="divide-y divide-gray-50">
             <div onClick={() => setActiveSheet('BIO')} className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                <span className="text-gray-600 font-medium">Bio</span>
                <span className="text-gray-400 text-sm max-w-[200px] truncate flex items-center gap-1">{editedUser.about || 'Add bio'} <ChevronRight size={16} /></span>
             </div>
             {[
               { label: 'Work', key: 'work' },
               { label: 'Education', key: 'education' },
               { label: 'Current Location', key: 'currentLocation' },
               { label: 'Hometown', key: 'hometown' },
             ].map(field => {
                const val = editedUser[field.key as keyof UserType];
                return (
                  <div key={field.key} onClick={() => setActiveSheet(field.key)} className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                    <span className="text-gray-600 font-medium">{field.label}</span>
                    <span className={`text-sm flex items-center gap-1 ${val ? 'text-gray-900' : 'text-gray-400'}`}>
                      {(val as string) || 'Add'} <ChevronRight size={16} />
                    </span>
                  </div>
                );
             })}
           </div>
        </section>

        {/* SCREEN 4: Interests */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
           <div onClick={() => setActiveSheet('INTERESTS')} className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
              <div>
                 <h3 className="font-bold text-gray-900">My Interests</h3>
                 <div className="flex flex-wrap gap-1 mt-2">
                   {editedUser.interests.length > 0 ? editedUser.interests.map(i => (
                     <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-600 text-xs rounded border border-rose-100 font-medium">{i}</span>
                   )) : <span className="text-gray-400 text-sm italic">Add interests to find matches</span>}
                 </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
           </div>
        </section>

        {/* SCREEN 5: My Lifestyle */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
           <h3 className="font-bold text-gray-900 p-4 border-b border-gray-50 bg-gray-50/50">My Lifestyle</h3>
           <div className="divide-y divide-gray-50">
             {/* Height Manually */}
             <div onClick={() => setActiveSheet('height')} className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
               <span className="text-gray-600 font-medium">Height</span>
               <span className={`text-sm flex items-center gap-1 ${editedUser.details?.height ? 'text-gray-900' : 'text-gray-400'}`}>
                 {editedUser.details?.height || 'Add'} <ChevronRight size={16} />
               </span>
             </div>
             {/* Other Lifestyle Keys */}
             {LIFESTYLE_KEYS.map(key => {
               const label = formatLabel(key);
               const val = editedUser.details?.[key as keyof UserDetails];
               return (
                 <div key={key} onClick={() => setActiveSheet(key)} className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                   <span className="text-gray-600 font-medium capitalize">{label}</span>
                   <span className={`text-sm flex items-center gap-1 capitalize ${val ? 'text-gray-900' : 'text-gray-400'}`}>
                     {(Array.isArray(val) ? val.join(', ') : val) || 'Add'} <ChevronRight size={16} />
                   </span>
                 </div>
               )
             })}
           </div>
        </section>

        {/* SCREEN 6: Relationship & Life Preferences */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
           <h3 className="font-bold text-gray-900 p-4 border-b border-gray-50 bg-gray-50/50">Relationship & Life Preferences</h3>
           <div className="divide-y divide-gray-50">
             {PREFERENCE_KEYS.map(key => {
               const label = formatLabel(key);
               const val = editedUser.details?.[key as keyof UserDetails];
               return (
                 <div key={key} onClick={() => setActiveSheet(key)} className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                   <span className="text-gray-600 font-medium capitalize">{label}</span>
                   <span className={`text-sm flex items-center gap-1 capitalize ${val ? 'text-gray-900' : 'text-gray-400'}`}>
                     {(Array.isArray(val) ? val.join(', ') : val) || 'Add'} <ChevronRight size={16} />
                   </span>
                 </div>
               )
             })}
             
             {/* Languages Row */}
             <div onClick={() => setActiveSheet('languages')} className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
               <span className="text-gray-600 font-medium">Languages</span>
               <span className={`text-sm flex items-center gap-1 ${editedUser.details?.languages?.length ? 'text-gray-900' : 'text-gray-400'}`}>
                 {editedUser.details?.languages?.join(', ') || 'Add'} <ChevronRight size={16} />
               </span>
             </div>
           </div>
        </section>
        
        <div className="h-20" />
      </div>

      {/* --- BOTTOM SHEETS FOR EDITING --- */}

      {/* Bio Editor */}
      <BottomSheet 
        isOpen={activeSheet === 'BIO'} 
        onClose={() => setActiveSheet(null)} 
        title="Edit Bio"
        actions={
          <Button fullWidth onClick={() => setActiveSheet(null)}>Done</Button>
        }
      >
        <textarea 
          className="w-full h-32 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none resize-none"
          placeholder="Write something about yourself..."
          value={editedUser.about}
          onChange={e => setEditedUser({...editedUser, about: e.target.value})}
          maxLength={300}
        />
        <div className="text-right text-xs text-gray-400 mt-2">{editedUser.about?.length || 0}/300</div>
      </BottomSheet>

      {/* Generic Text Input (Work, Education, Location, Hometown) */}
      {['work', 'education', 'currentLocation', 'hometown'].map(key => (
        <BottomSheet 
          key={key}
          isOpen={activeSheet === key} 
          onClose={() => setActiveSheet(null)} 
          title={`Edit ${key === 'currentLocation' ? 'Location' : key.charAt(0).toUpperCase() + key.slice(1)}`}
          actions={<Button fullWidth onClick={() => setActiveSheet(null)}>Save</Button>}
        >
          <input 
             className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-rose-500"
             placeholder={`Enter ${key}...`}
             value={(editedUser as any)[key] || ''}
             onChange={e => {
               setEditedUser({...editedUser, [key]: e.target.value});
             }}
          />
        </BottomSheet>
      ))}

      {/* Height Editor */}
      <BottomSheet 
        isOpen={activeSheet === 'height'} 
        onClose={() => setActiveSheet(null)} 
        title="Edit Height"
        actions={<Button fullWidth onClick={() => setActiveSheet(null)}>Save</Button>}
      >
        <input 
           className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-rose-500"
           placeholder="e.g. 5'10"
           value={editedUser.details?.height || ''}
           onChange={e => updateDetail('height', e.target.value)}
        />
      </BottomSheet>

      {/* Interests Editor */}
      <BottomSheet 
        isOpen={activeSheet === 'INTERESTS'} 
        onClose={() => setActiveSheet(null)} 
        title="Interests"
        actions={<Button fullWidth onClick={() => setActiveSheet(null)}>Done</Button>}
      >
        <div className="space-y-4">
          <div className="relative">
             <Search className="absolute left-3 top-3 text-gray-400" size={18} />
             <input placeholder="Search interests..." className="w-full pl-10 p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none" />
          </div>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_INTERESTS.map(int => {
              const isSelected = editedUser.interests.includes(int);
              return (
                <button 
                  key={int}
                  onClick={() => {
                     const newInterests = isSelected 
                        ? editedUser.interests.filter(i => i !== int)
                        : [...editedUser.interests, int];
                     setEditedUser({...editedUser, interests: newInterests});
                  }}
                  className={`px-4 py-2 rounded-full text-sm border font-medium transition ${isSelected ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white border-gray-200 text-gray-600'}`}
                >
                  {int}
                </button>
              )
            })}
          </div>
        </div>
      </BottomSheet>

      {/* Languages Editor (Multi-Select Chips) */}
      <BottomSheet
        isOpen={activeSheet === 'languages'}
        onClose={() => setActiveSheet(null)}
        title="Select Languages"
        actions={<Button fullWidth onClick={() => setActiveSheet(null)}>Done</Button>}
      >
         <div className="flex flex-wrap gap-2">
           {getOptionList('languages').map((lang: string) => {
             const currentLangs = editedUser.details?.languages || [];
             const isSelected = currentLangs.includes(lang);
             return (
               <button
                 key={lang}
                 onClick={() => {
                   const newLangs = isSelected
                     ? currentLangs.filter(l => l !== lang)
                     : [...currentLangs, lang];
                   updateDetail('languages', newLangs);
                 }}
                 className={`px-4 py-2 rounded-full text-sm font-medium border transition ${isSelected ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
               >
                 {lang}
               </button>
             )
           })}
         </div>
      </BottomSheet>

      {/* Generic Option Pickers (Lifestyle & Preferences) */}
      {[...LIFESTYLE_KEYS, ...PREFERENCE_KEYS].map(key => (
        <BottomSheet
          key={key}
          isOpen={activeSheet === key}
          onClose={() => setActiveSheet(null)}
          title={`Select ${formatLabel(key)}`}
        >
          <div className="space-y-2">
            {getOptionList(key).map((opt: string) => (
              <button
                key={opt}
                onClick={() => {
                  updateDetail(key as keyof UserDetails, opt);
                  setActiveSheet(null);
                }}
                className={`w-full p-4 text-left rounded-xl border font-medium flex justify-between items-center ${editedUser.details?.[key as keyof UserDetails] === opt ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-gray-100 hover:bg-gray-50 text-gray-700'}`}
              >
                {opt}
                {editedUser.details?.[key as keyof UserDetails] === opt && <Check size={18} className="text-rose-500" />}
              </button>
            ))}
          </div>
        </BottomSheet>
      ))}

    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [view, setView] = useState<AppView>('AUTH');
  
  // Profile View internal navigation state
  const [profileMode, setProfileMode] = useState<'OVERVIEW' | 'EDIT' | 'PREVIEW'>('OVERVIEW');
  const [selectedUserProfile, setSelectedUserProfile] = useState<UserType | null>(null);
  
  const [walletBalance, setWalletBalance] = useState(250);
  const [chats, setChats] = useState<ChatConversation[]>([
    { id: 'c1', partnerId: '2', lastMessage: 'Hey! Nice profile.', unreadCount: 1, timestamp: Date.now(), messages: [] },
    { id: 'c2', partnerId: '3', lastMessage: 'Would love to grab coffee!', unreadCount: 0, timestamp: Date.now() - 3600000, messages: [] }
  ]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChatMessages, setActiveChatMessages] = useState<any[]>([]);
  const [unlockedUserIds, setUnlockedUserIds] = useState<string[]>([]);

  // Derived State
  const completionScore = user ? calculateProfileCompletion(user) : 0;

  const handleLogin = (userData: any) => { setUser(userData); setView('DISCOVER'); };
  const handleUpdateUser = (updatedUser: UserType) => { setUser(updatedUser); };
  
  const handleSwipe = (id: string, dir: 'left' | 'right' | 'up') => {
    if (dir === 'right') {
      setTimeout(() => {
        if (Math.random() > 0.7) {
          alert("It's a Match! 🎉");
          setChats(prev => [{ id: `new_${Date.now()}`, partnerId: id, lastMessage: 'New Match!', unreadCount: 1, timestamp: Date.now(), messages: [] }, ...prev]);
        }
      }, 500);
    }
  };

  const handleUnlockProfile = (id: string) => {
    if (walletBalance >= 50) {
      setWalletBalance(prev => prev - 50);
      setUnlockedUserIds(prev => [...prev, id]);
    } else {
      alert("Not enough coins!");
    }
  };

  const handleSendGift = (gift: any) => {
    if (walletBalance >= gift.cost) {
      setWalletBalance(prev => prev - gift.cost);
      const newMessage = { id: `msg_${Date.now()}`, senderId: user?.id, giftId: gift.id, timestamp: Date.now(), isRead: false };
      setActiveChatMessages(prev => [...prev, newMessage]);
    }
  };

  const handleSendMessage = (text: string) => {
    const newMessage = { id: `msg_${Date.now()}`, senderId: user?.id, text, timestamp: Date.now(), isRead: false };
    setActiveChatMessages(prev => [...prev, newMessage]);
  };

  useEffect(() => {
    if (activeChatId) {
      setActiveChatMessages([
        { id: '1', senderId: 'partner', text: 'Hey there! How are you?', timestamp: Date.now() - 100000, isRead: true },
        { id: '2', senderId: 'me', text: 'I am good! Just browsing.', timestamp: Date.now() - 50000, isRead: true },
      ]);
    }
  }, [activeChatId]);

  if (!user) {
    return (
      <div className="bg-gray-200 min-h-screen flex items-center justify-center font-sans">
        <div className="app-container rounded-none sm:rounded-3xl overflow-hidden w-full sm:w-[480px]">
          <AuthView onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 min-h-screen flex items-center justify-center font-sans">
      <div className="app-container rounded-none sm:rounded-3xl overflow-hidden w-full sm:w-[480px]">
        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {view === 'DISCOVER' && (
             <DiscoverView 
               users={MOCK_USERS} 
               onSwipe={handleSwipe} 
               completionScore={completionScore}
               onGoToProfile={() => { setView('PROFILE'); setProfileMode('EDIT'); }}
             />
          )}
          {view === 'PEOPLE' && <PeopleView users={MOCK_USERS} onSelect={(u) => setSelectedUserProfile(u)} />}
          {view === 'LIKED_YOU' && <LikedYouView users={MOCK_USERS.slice(0, 3)} unlockedIds={unlockedUserIds} onUnlock={handleUnlockProfile} walletBalance={walletBalance} />}
          {view === 'CHAT' && (
            <ChatView 
              chats={chats} 
              activeChatId={activeChatId} 
              onSelectChat={setActiveChatId}
              onBack={() => setActiveChatId(null)}
              messages={activeChatMessages}
              onSendMessage={handleSendMessage}
              onSendGift={handleSendGift}
              currentUserId={user.id}
              walletBalance={walletBalance}
            />
          )}
          {view === 'PROFILE' && (
            <>
              {profileMode === 'OVERVIEW' && (
                <ProfileOverview 
                  user={user} 
                  walletBalance={walletBalance} 
                  onEdit={() => setProfileMode('EDIT')}
                  onPreview={() => setProfileMode('PREVIEW')}
                  completionScore={completionScore}
                />
              )}
              {profileMode === 'EDIT' && (
                <ProfileEditor 
                  user={user} 
                  onCancel={() => setProfileMode('OVERVIEW')} 
                  onSave={(u) => { handleUpdateUser(u); setProfileMode('OVERVIEW'); }}
                />
              )}
              {profileMode === 'PREVIEW' && (
                <ProfilePreview 
                  user={user} 
                  onClose={() => setProfileMode('OVERVIEW')}
                />
              )}
            </>
          )}
        </div>

        {/* Bottom Navigation */}
        {(!activeChatId || view !== 'CHAT') && !selectedUserProfile && (
          <div className="bg-white border-t border-gray-100 flex justify-around items-center h-20 px-2 pb-2 z-40">
             <NavButton active={view === 'PROFILE'} onClick={() => { setView('PROFILE'); setProfileMode('OVERVIEW'); }} icon={<User size={24} />} label="Profile" />
             <NavButton active={view === 'DISCOVER'} onClick={() => setView('DISCOVER')} icon={<Sparkles size={24} />} label="Discover" />
             <NavButton active={view === 'PEOPLE'} onClick={() => setView('PEOPLE')} icon={<Users size={24} />} label="People" />
             <NavButton active={view === 'LIKED_YOU'} onClick={() => setView('LIKED_YOU')} icon={<Heart size={24} />} label="Liked" />
             <NavButton active={view === 'CHAT'} onClick={() => setView('CHAT')} icon={<MessageCircle size={24} />} label="Chat" />
          </div>
        )}

        {/* Global Overlays */}
        {selectedUserProfile && (
            <ProfilePreview 
              user={selectedUserProfile} 
              onClose={() => setSelectedUserProfile(null)} 
            />
        )}
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${active ? 'text-rose-500' : 'text-gray-400 hover:text-gray-600'}`}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;