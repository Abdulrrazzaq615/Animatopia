import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Message, User, Group } from '../types';
import { Send, MessageSquare, Sparkles, User as UserIcon, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatSectionProps {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  currentUser: User;
  users: User[];
  groups: Group[];
}

export default function ChatSection({
  messages,
  setMessages,
  currentUser,
  users,
  groups
}: ChatSectionProps) {
  const [selectedChatType, setSelectedChatType] = useState<'group' | 'dm'>('group');
  const [selectedTargetId, setSelectedTargetId] = useState<string>(groups[0]?.id || '');
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingName, setTypingName] = useState('');
  const [aiAssistantLoading, setAiAssistantLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const activeChatMessages = messages.filter((msg) => {
    if (selectedChatType === 'group') {
      return msg.groupId === selectedTargetId;
    } else {
      // 1-on-1 messages logic
      const isMineToThem = msg.senderId === currentUser.id && msg.receiverId === selectedTargetId;
      const isTheirsToMe = msg.senderId === selectedTargetId && msg.receiverId === currentUser.id;
      return isMineToThem || isTheirsToMe;
    }
  });

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const myMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      groupId: selectedChatType === 'group' ? selectedTargetId : undefined,
      receiverId: selectedChatType === 'dm' ? selectedTargetId : undefined,
      content: messageText,
      createdAt: new Date().toISOString()
    };

    const textToProcess = messageText;
    const currentList = [...messages, myMessage];
    setMessages(currentList);
    setMessageText('');

    // If typing to a real mock user in DM, trigger a simulated cool Sheng reply after a brief timeout!
    if (selectedChatType === 'dm') {
      const targetUser = users.find((u) => u.id === selectedTargetId);
      if (targetUser) {
        setTypingName(targetUser.displayName);
        setIsTyping(true);

        setTimeout(() => {
          setIsTyping(false);

          let replyContent = `Mambo vipi @${currentUser.username}! Nimecheki message yako. Karibu sana Animatopia!`;
          if (targetUser.username === 'otaku_wanjiku') {
            const replies = [
              'Shukran msee! Nimefanya sketch mpya ya Eren Jaeger, naileta screening siku ya ijumaa. Unakuja?',
              'Sasa! Unasoma manga gani saa hizi? Mimi nimemaliza Ghibli reviews, natafuta suggestions mpya.',
              'Bazuu! Nipo hapa Kaimosi Friends Univ nachora kidogo. Tukutane cafe ya Kiprop baadaye tuandike story!'
            ];
            replyContent = replies[Math.floor(Math.random() * replies.length)];
          } else if (targetUser.username === 'kakashi_kiprop') {
            const replies = [
              'Oi wasee! Karibu sana cafe yangu. Naandaa Projector ya giant kwa ajili ya anime finale! Hype ni real.',
              'Safi sana msee! Soda baridi and popcorns ziko tayari. Make sure umealika marafiki wako wote wa Chavakali!',
              'Kabisa! Kiprop Gaming & Anime spot ndio form ijumaa. See you then msee.'
            ];
            replyContent = replies[Math.floor(Math.random() * replies.length)];
          } else if (targetUser.username === 'manga_mwaniki') {
            const replies = [
              'Weuh! Kitabu cha Berserk leo kimeniliza. Unapenda Seinen manga au unataka story za soka tu?',
              'Ah, mambo amadi! Nipo Chavakali hapa. Nataka kupanga session tuchore scenario ya Kaimosi pamoja.'
            ];
            replyContent = replies[Math.floor(Math.random() * replies.length)];
          }

          const responseMsg: Message = {
            id: `msg_reply_${Date.now()}`,
            senderId: targetUser.id,
            receiverId: currentUser.id,
            content: replyContent,
            createdAt: new Date().toISOString()
          };

          setMessages([...currentList, responseMsg]);
        }, 1800);
      }
    } 
    
    // Custom recommendation interactive trigger inside the Sheng general chat channel
    if (selectedChatType === 'group') {
      // If user prompts the general chat asking for recommendation or help
      const textLower = textToProcess.toLowerCase();
      if (textLower.includes('recommend') || textLower.includes('reki') || textLower.includes('sugua') || textLower.includes('ai') || textLower.includes('shauri')) {
        setIsTyping(true);
        setTypingName('AI Kurama Bot');
        
        // Try hitting our back-end API proxy for Gemini to provide actual recommendations!
        try {
          const res = await fetch('/api/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: textToProcess })
          });
          
          if (res.ok) {
            const data = await res.json();
            setIsTyping(false);
            const aiMsg: Message = {
              id: `msg_ai_${Date.now()}`,
              senderId: 'ai_bot_chat', // Custom identifier
              groupId: selectedTargetId,
              content: data.response || "Mambo! Nimecheki request yako lakini network imelega kidogo. Jaribu tena!",
              createdAt: new Date().toISOString()
            };
            setMessages([...currentList, aiMsg]);
            return;
          }
        } catch (err) {
          console.error("Gemini API fallback locally", err);
        }

        // Standard funny fallback if local Gemini API isn't set up yet
        setTimeout(() => {
          setIsTyping(false);
          const aiMsg: Message = {
            id: `msg_ai_${Date.now()}`,
            senderId: 'ai_bot_chat',
            groupId: selectedTargetId,
            content: "💡 *Kurama AI Bot:* Yo! Nimepata swali lako kuhusu suggestions. Hapa Kaimosi tunashauri: \n1. *Kaimosi Chrono-Trigger* (Form sana!) \n2. *Spirit Bound* (Upanga wa ajabu!) \n\nUkitaka reviews za live, andika 'AI' kwenye general chat au tuchat!",
            createdAt: new Date().toISOString()
          };
          setMessages([...currentList, aiMsg]);
        }, 2000);
      }
    }
  };

  const getSenderDetails = (senderId: string) => {
    if (senderId === currentUser.id) return currentUser;
    if (senderId === 'ai_bot_chat') {
      return {
        displayName: 'Kurama AI Assistant',
        username: 'kurama_ai_bot',
        avatarUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&auto=format&fit=crop&q=80' // Tech robot cover
      };
    }
    return users.find((u) => u.id === senderId) || {
      displayName: 'Kaimosi Otaku',
      username: 'kaimosi_fan',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
  };

  return (
    <div className="flex h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] bg-brand-card/30 rounded-3xl border border-white/[0.04] overflow-hidden shadow-2xl">
      {/* Sidebar Channels & Contacts */}
      <div className="w-20 md:w-64 bg-brand-card border-r border-[#ffb7c5]/10 flex flex-col justify-between">
        <div className="p-4 flex flex-col gap-6">
          {/* Channels Section */}
          <div>
            <h4 className="hidden md:block text-[10px] uppercase font-bold tracking-wider text-gray-500 font-mono mb-3">
              Room Group Rooms
            </h4>
            <div className="flex flex-col gap-1.5">
              {groups.map((g) => {
                const isActive = selectedChatType === 'group' && selectedTargetId === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => {
                      setSelectedChatType('group');
                      setSelectedTargetId(g.id);
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-all text-left ${
                      isActive
                        ? 'bg-brand-purple/60 text-white border-l-4 border-brand-orange'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.01]'
                    }`}
                  >
                    <MessageSquare className="w-5 h-5 shrink-0 text-brand-orange" />
                    <span className="hidden md:block text-xs font-semibold truncate">{g.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DMs Section */}
          <div>
            <h4 className="hidden md:block text-[10px] uppercase font-bold tracking-wider text-gray-500 font-mono mb-3">
              Direct Messages
            </h4>
            <div className="flex flex-col gap-1.5">
              {users.map((u) => {
                const isActive = selectedChatType === 'dm' && selectedTargetId === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      setSelectedChatType('dm');
                      setSelectedTargetId(u.id);
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-all text-left ${
                      isActive
                        ? 'bg-brand-purple/60 text-white border-l-4 border-brand-orange'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.01]'
                    }`}
                  >
                    <img src={u.avatarUrl} className="w-6 h-6 rounded-full object-cover shrink-0" alt="avatar" />
                    <span className="hidden md:block text-xs font-semibold truncate">{u.displayName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tip trigger hint */}
        <div className="hidden md:block p-4 m-3 bg-[#151125]/80 border border-white/[0.03] rounded-2xl">
          <p className="text-[10px] text-brand-sakura flex items-center gap-1 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange animate-pulse" />
            <span>Sheng AI Hint</span>
          </p>
          <p className="text-[9px] text-gray-400 mt-1 leading-relaxed">
            Write "AI recommend me some cool action anime" inside the group chat to trigger our simulated Gemini recommender!
          </p>
        </div>
      </div>

      {/* Main chat log window */}
      <div className="flex-1 flex flex-col justify-between bg-brand-bg/40">
        {/* Chat top info header */}
        <div className="p-4 bg-brand-card/85 border-b border-[#ffb7c5]/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedChatType === 'group' ? (
              <div className="p-2 bg-brand-purple/80 text-brand-orange rounded-xl border border-brand-orange/20">
                <MessageSquare className="w-5 h-5" />
              </div>
            ) : (
              <img
                src={users.find((u) => u.id === selectedTargetId)?.avatarUrl}
                className="w-10 h-10 rounded-full border border-brand-orange object-cover"
                alt="avatar"
              />
            )}
            <div>
              <h3 className="text-white font-medium text-sm">
                {selectedChatType === 'group'
                  ? groups.find((g) => g.id === selectedTargetId)?.name
                  : users.find((u) => u.id === selectedTargetId)?.displayName}
              </h3>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                {selectedChatType === 'group' ? 'General Channel Room' : 'Active 1-on-1 Chat'}
              </p>
            </div>
          </div>
        </div>

        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4">
          {activeChatMessages.map((msg) => {
            const sender = getSenderDetails(msg.senderId);
            const isMe = msg.senderId === currentUser.id;

            return (
              <div key={msg.id} className={`flex gap-3 max-w-[80%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}>
                <img
                  src={sender.avatarUrl}
                  alt={sender.displayName}
                  className="w-8 h-8 rounded-full object-cover border border-white/[0.05]"
                />
                <div>
                  <div className={`flex items-center gap-2 mb-1 ${isMe ? 'justify-end' : ''}`}>
                    <span className="text-[11px] font-semibold text-gray-300">{sender.displayName}</span>
                    <span className="text-[9px] text-gray-500 font-mono">
                      {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      isMe
                        ? 'bg-brand-orange text-white rounded-tr-none'
                        : msg.senderId === 'ai_bot_chat'
                        ? 'bg-gradient-to-r from-brand-purple to-purple-950 text-brand-sakura border border-brand-sakura/20 rounded-tl-none font-sans font-medium'
                        : 'bg-brand-card border border-[#ffb7c5]/5 text-gray-200 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 items-center self-start text-xs text-gray-500 font-mono bg-brand-card/40 py-1.5 px-3 rounded-full border border-[#ffb7c5]/5">
              <span className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce [animation-delay:0.4s]" />
              <span>{typingName} anaandika...</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input Text Box Form */}
        <form onSubmit={handleSendMessage} className="p-4 bg-[#151125]/80 border-t border-[#ffb7c5]/5 flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message... use 'AI recommend me' for smart answers"
            className="flex-1 bg-brand-bg/60 border border-[#ffb7c5]/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
          />
          <button
            type="submit"
            disabled={!messageText.trim()}
            className="p-3 bg-brand-orange text-white hover:bg-brand-sakura hover:text-brand-bg rounded-xl transition-all disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
