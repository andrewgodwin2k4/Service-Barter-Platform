import { useEffect, useState, useContext, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import api from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";
import {
  Search, Send, MessageCircle, ArrowLeft, Circle, User as UserIcon, ChevronRight, Hash, MoreHorizontal, RefreshCw, Loader2, Check, CheckCheck, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Messages() {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [mobileShowThread, setMobileShowThread] = useState(false);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchUserId = searchParams.get("userId");

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, [token]);

  // Fetch conversations
  const fetchConversations = async () => {
    if (!user) return;
    try {
      const res = await api.get("/chat/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(res.data);
    } catch (err) {
      console.error("Failed to fetch conversations", err);
    }
  };

  useEffect(() => {
    if (user) fetchConversations();
  }, [user]);

  // Handle auto-starting chat from URL
  useEffect(() => {
    if (user && searchUserId && allUsers.length > 0) {
      const targetUser = allUsers.find(u => u.id === parseInt(searchUserId));
      if (targetUser) {
        startChat(targetUser);
        // Clear search params so it doesn't keep opening on refresh
        setSearchParams({}, { replace: true });
      }
    }
  }, [user, searchUserId, allUsers]);

  // Pre-load all users if a userId is provided
  useEffect(() => {
    if (searchUserId && user) {
      fetchAllUsers();
    }
  }, [searchUserId, user]);

  // Fetch messages for active chat
  const fetchMessages = async () => {
    if (!activeChat || !user) return;
    try {
      const res = await api.get(`/chat/conversation/${activeChat.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(Array.isArray(res.data) ? res.data : []);
      // Mark as read
      await api.put(`/chat/read/${activeChat.id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  useEffect(() => {
    if (activeChat) {
      fetchMessages();
      // Poll every 3 seconds
      pollRef.current = setInterval(() => {
        fetchMessages();
        fetchConversations();
      }, 3000);
      return () => clearInterval(pollRef.current);
    }
  }, [activeChat]);

  // Auto scroll to bottom
  useEffect(() => {
    try {
      if (messages.length > 0) {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      }
    } catch (err) {
      console.warn("Scroll failed", err);
    }
  }, [messages]);

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || sending) return;
    setSending(true);
    try {
      await api.post("/chat", {
        receiverId: activeChat.id,
        content: newMessage.trim(),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewMessage("");
      // Reset height
      const textarea = document.getElementById("chat-input");
      if (textarea) textarea.style.height = 'auto';
      await fetchMessages();
      await fetchConversations();
    } catch (err) {
      console.error("Failed to send message", err);
    }
    setSending(false);
  };

  // Start new chat
  const fetchAllUsers = async () => {
    try {
      const res = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllUsers(res.data.filter(u => u.id !== user?.id));
    } catch (err) {
      console.error(err);
    }
  };

  const startChat = (otherUser) => {
    setActiveChat(otherUser);
    setShowNewChat(false);
    setMobileShowThread(true);
  };

  const openConversation = (msg) => {
    const other = msg.sender.id === user.id ? msg.receiver : msg.sender;
    setActiveChat(other);
    setMobileShowThread(true);
  };

  const getOtherUser = (msg) => msg.sender.id === user.id ? msg.receiver : msg.sender;

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const getDayLabel = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (isSameDay(d, now)) return "Today";
    if (isSameDay(d, yesterday)) return "Yesterday";
    
    return d.toLocaleDateString([], { month: 'long', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
  };

  const filteredConversations = conversations.filter(msg => {
    const other = getOtherUser(msg);
    const searchable = `${other.profileName || ''} ${other.username || ''}`.toLowerCase();
    return searchable.includes(search.toLowerCase());
  });

  const filteredUsers = allUsers.filter(u => {
    const searchable = `${u.profileName || ''} ${u.username || ''}`.toLowerCase();
    return searchable.includes(search.toLowerCase());
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden bg-background h-[calc(100vh-64px)]">
      <div className="flex w-full overflow-hidden">
        
        {/* Sidebar */}
        <div className={`w-full sm:w-96 border-r border-border flex flex-col bg-card shadow-xl z-20 transition-all duration-300 ${mobileShowThread ? "hidden sm:flex" : "flex"}`}>
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Messages</h1>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => { setShowNewChat(!showNewChat); if (!showNewChat) fetchAllUsers(); }}
                className="hover:bg-primary/10 text-primary cursor-pointer rounded-xl font-bold transition-all duration-200"
              >
                {showNewChat ? (
                  <div className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>New</span>
                  </div>
                )}
              </Button>
            </div>
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={showNewChat ? "Search users..." : "Search threads..."}
                className="w-full pl-11 pr-4 py-3 bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 transition-all"
              />
            </div>
          </div>

          {/* List Section */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              {showNewChat ? (
                <motion.div
                  key="users"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="p-2 space-y-1"
                >
                  {filteredUsers.length === 0 ? (
                    <div className="p-10 text-center">
                       <p className="text-zinc-400 text-sm font-medium">No users found</p>
                    </div>
                  ) : (
                    filteredUsers.map(u => (
                      <button
                        key={u.id}
                        onClick={() => startChat(u)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-2xl transition-all cursor-pointer group"
                      >
                        <div className="w-12 h-12 rounded-full border-2 border-transparent group-hover:border-primary/20 transition-all shrink-0">
                          {u.avatarUrl ? (
                            <img src={`http://localhost:8080${u.avatarUrl}`} className="w-full h-full rounded-full object-cover shadow-sm" alt="" />
                          ) : (
                            <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
                               <UserIcon className="w-5 h-5 text-primary" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="font-bold text-zinc-900 dark:text-zinc-50 text-base truncate leading-tight">{u.profileName || u.username}</p>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-all text-primary">
                           <ChevronRight className="w-4 h-4" />
                        </div>
                      </button>
                    ))
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="conversations"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-2 space-y-1"
                >
                  {filteredConversations.length === 0 ? (
                    <div className="p-10 text-center flex flex-col items-center">
                       <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-4">
                          <MessageCircle className="w-6 h-6 text-zinc-400" />
                       </div>
                       <p className="text-zinc-500 font-bold text-sm">No active chats</p>
                    </div>
                  ) : (
                    filteredConversations.map(msg => {
                      const other = getOtherUser(msg);
                      const isUnread = msg.receiver.id === user.id && !msg.isRead;
                      const isActive = activeChat?.id === other.id;
                      return (
                        <button
                          key={msg.id}
                          onClick={() => openConversation(msg)}
                          className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer relative group
                            ${isActive ? "bg-zinc-900 dark:bg-white shadow-lg" : "hover:bg-zinc-100 dark:hover:bg-zinc-800/50"}`}
                        >
                          <div className="relative shrink-0">
                            <div className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${isActive ? "border-primary shadow-lg" : "border-transparent"}`}>
                              {other.avatarUrl ? (
                                <img src={`http://localhost:8080${other.avatarUrl}`} className="w-full h-full object-cover" alt="" />
                              ) : (
                                <div className={`w-full h-full flex items-center justify-center ${isActive ? "bg-white text-zinc-900" : "bg-primary/10 text-primary"}`}>
                                   <UserIcon className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            {isUnread && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary border-2 border-white dark:border-zinc-900 rounded-full flex items-center justify-center" />
                            )}
                          </div>
                          
                          <div className="flex-1 text-left min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <p className={`text-base font-black truncate leading-tight ${isActive ? "text-white dark:text-zinc-900" : "text-zinc-900 dark:text-zinc-50"}`}>
                                {other.profileName || other.username}
                              </p>
                              <span className={`text-[10px] font-bold shrink-0 ${isActive ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-400"}`}>
                                {formatTime(msg.sentAt)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-xs truncate font-medium ${isActive ? "text-zinc-400 dark:text-zinc-500" : isUnread ? "text-zinc-900 dark:text-white font-bold" : "text-zinc-500"}`}>
                                {msg.sender.id === user.id ? "You: " : ""}{msg.content}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Chat Thread */}
        <div className={`flex-1 flex flex-col bg-background relative ${!mobileShowThread ? "hidden sm:flex" : "flex"}`}>
          {activeChat ? (
            <>
              {/* Header */}
              <div className="py-4 px-6 border-b border-border flex items-center justify-between bg-card/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-4">
                  <button
                    className="sm:hidden p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 cursor-pointer"
                    onClick={() => { setMobileShowThread(false); setActiveChat(null); }}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full border-2 border-primary/20 p-0.5">
                      {activeChat.avatarUrl ? (
                        <img src={`http://localhost:8080${activeChat.avatarUrl}`} className="w-full h-full rounded-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-primary" />
                        </div>
                      )}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-black rounded-full" />
                  </div>
                  <div>
                    <h3 className="font-black text-zinc-900 dark:text-white text-lg leading-tight">{activeChat.profileName || activeChat.username}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer p-0">
                      <Info size={20} />
                   </Button>
                   <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer p-0">
                      <MoreHorizontal size={20} />
                   </Button>
                </div>
              </div>

              {/* Messages Content */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 custom-scrollbar relative bg-zinc-50 dark:bg-zinc-950">
                {/* Background Noise layer */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat opacity-[0.15] mix-blend-overlay pointer-events-none z-0" />
                
                <div className="relative z-1 flex flex-col">
                  {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center h-full py-20 text-center">
                      <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                        <MessageCircle className="w-10 h-10 text-zinc-300 dark:text-zinc-700" />
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400 font-bold text-xl">Start your conversation</p>
                      <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-2 max-w-xs">Messages are secured with end-to-end encryption aesthetics.</p>
                    </div>
                  ) : (
                    messages.reduce((acc, msg, i) => {
                        const dateLabel = getDayLabel(msg.sentAt);
                        const prevMsg = i > 0 ? messages[i-1] : null;
                        const prevDateLabel = prevMsg ? getDayLabel(prevMsg.sentAt) : null;
                        
                        // Add Date Divider if needed
                        if (dateLabel !== prevDateLabel) {
                            acc.push(
                                <div key={`date-${msg.id}`} className="flex justify-center my-8">
                                    <span className="px-4 py-1.5 rounded-full bg-white dark:bg-zinc-900 text-[11px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800 shadow-sm">
                                        {dateLabel}
                                    </span>
                                </div>
                            );
                        }
                        
                        const isMe = msg.sender?.id === user.id;
                        const isLastInGroup = i === messages.length - 1 || messages[i + 1]?.sender?.id !== msg.sender?.id;
                        
                        acc.push(
                          <motion.div
                            key={msg.id || `msg-${i}`}
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className={`flex mb-1 ${isMe ? "justify-end" : "justify-start"} ${isLastInGroup ? "mb-4" : ""}`}
                          >
                            <div className={`max-w-[85%] md:max-w-[70%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                              <div
                                className={`px-4 py-2.5 shadow-sm text-sm relative group
                                  ${isMe
                                    ? `bg-secondary dark:bg-zinc-800 text-foreground dark:text-zinc-100 ${isLastInGroup ? "rounded-2xl rounded-br-none" : "rounded-2xl"}`
                                    : `bg-card dark:bg-zinc-900 border border-border text-foreground dark:text-zinc-100 ${isLastInGroup ? "rounded-2xl rounded-bl-none" : "rounded-2xl"}`
                                  }`}
                              >
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                <div className={`flex items-center justify-end gap-1.5 mt-1 opacity-70 ${isMe ? "text-zinc-400" : "text-zinc-500"}`}>
                                    <span className="text-[9px] font-bold uppercase">{formatTime(msg.sentAt)}</span>
                                    {isMe && (
                                        msg.isRead ? <CheckCheck className="w-3 h-3 text-blue-400" /> : <Check className="w-3 h-3 text-zinc-400" />
                                    )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                        return acc;
                    }, [])
                  )}
                  <div ref={messagesEndRef} className="h-4" />
                </div>
              </div>

              {/* Input Area */}
              <div className="p-6 bg-card border-t border-border">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-end gap-3 bg-secondary p-2 rounded-[2rem] border border-border transition-all focus-within:ring-2 focus-within:ring-primary/20">
                  <textarea
                    rows={1}
                    value={newMessage}
                    onChange={(e) => {
                       setNewMessage(e.target.value);
                       e.target.style.height = 'auto';
                       e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend(e);
                        }
                    }}
                    id="chat-input"
                    placeholder="Message..."
                    className="flex-1 px-4 py-3 bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 text-sm resize-none custom-scrollbar max-h-32"
                  />
                  <Button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="w-12 h-12 rounded-full p-0 flex items-center justify-center bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:scale-105 transition-all shadow-lg cursor-pointer shrink-0"
                  >
                    {sending ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 -rotate-45 -translate-y-0.5" />}
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[radial-gradient(circle_at_center,_var(--color-primary-foreground)_0%,_transparent_100%)] dark:bg-none">
              <div className="w-24 h-24 rounded-[2.5rem] bg-white dark:bg-zinc-900 flex items-center justify-center mb-8 shadow-2xl rotate-3">
                <MessageCircle className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight mb-4 uppercase">Messenger</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-base max-w-sm leading-relaxed font-medium">
                Select a conversation to reveal the thread, or initiate a new connection with any user on the platform.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
