# 💬 Chat History System - User Conversations Saved

## ✅ What's Implemented

Your chatbot now **automatically saves all conversations** to MongoDB, linked to each user!

### Features
- ✅ **Automatic saving** - Every message saved to database
- ✅ **User-specific** - Each user has their own chat history
- ✅ **Chat sessions** - Multiple conversations per user
- ✅ **Timestamps** - Track when messages were sent
- ✅ **Source citations** - Saved with AI responses
- ✅ **Chat management** - View, delete, rename chats
- ✅ **Sidebar UI** - Easy access to chat history

## 📊 Database Schema

### Chats Collection
```typescript
{
  _id: ObjectId,
  userId: string,              // Links to User._id
  title: string,               // Chat title (first message preview)
  messages: [
    {
      role: 'user' | 'assistant',
      content: string,
      sources: [...],          // Optional source citations
      timestamp: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Example Document
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "userId": "65a1b2c3d4e5f6g7h8i9j0k2",
  "title": "What are the requirements for computer science?",
  "messages": [
    {
      "role": "user",
      "content": "What are the requirements for computer science?",
      "timestamp": "2025-01-15T10:30:00.000Z"
    },
    {
      "role": "assistant",
      "content": "**For Bachelor of Science in Computer Science (BSCS):**\n\n**Eligibility Criteria:**\n- 12 Years of Education...",
      "sources": [
        {
          "source": "Computer Science Program",
          "score": 0.95
        }
      ],
      "timestamp": "2025-01-15T10:30:05.000Z"
    }
  ],
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:05.000Z"
}
```

## 🔧 API Endpoints

### GET `/api/chats`
Get all chats for logged-in user.

**Headers:**
```
Cookie: next-auth.session-token=...
```

**Response (200):**
```json
{
  "chats": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "userId": "65a1b2c3d4e5f6g7h8i9j0k2",
      "title": "What are the requirements for computer science?",
      "messageCount": 4,
      "lastMessage": {
        "role": "assistant",
        "content": "...",
        "timestamp": "2025-01-15T10:35:00.000Z"
      },
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:35:00.000Z"
    }
  ]
}
```

### POST `/api/chats`
Create a new chat session.

**Request:**
```json
{
  "title": "New Chat",
  "firstMessage": "What are the requirements for computer science?"
}
```

**Response (201):**
```json
{
  "chat": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "userId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "title": "What are the requirements for computer science?",
    "messages": [],
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

### GET `/api/chats/[id]`
Get specific chat with all messages.

**Response (200):**
```json
{
  "chat": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "userId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "title": "What are the requirements for computer science?",
    "messages": [
      {
        "role": "user",
        "content": "What are the requirements for computer science?",
        "timestamp": "2025-01-15T10:30:00.000Z"
      },
      {
        "role": "assistant",
        "content": "**For Bachelor of Science...",
        "sources": [...],
        "timestamp": "2025-01-15T10:30:05.000Z"
      }
    ],
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:05.000Z"
  }
}
```

### DELETE `/api/chats/[id]`
Delete a chat.

**Response (200):**
```json
{
  "message": "Chat deleted"
}
```

### PATCH `/api/chats/[id]`
Update chat title.

**Request:**
```json
{
  "title": "CS Program Requirements"
}
```

**Response (200):**
```json
{
  "message": "Chat updated"
}
```

### POST `/api/chats/[id]/messages`
Add message to existing chat (rarely needed, handled automatically).

**Request:**
```json
{
  "role": "user",
  "content": "Tell me more about scholarships",
  "sources": []
}
```

## 🔄 How It Works

### 1. User Sends Message
```typescript
// Frontend sends query
fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ 
    query: "What are the requirements?",
    chatId: currentChatId  // null for new chat
  })
})
```

### 2. Backend Creates/Updates Chat
```typescript
// API route (/api/chat/route.ts)

// Create new chat if needed
if (!chatId) {
  const chat = await ChatModel.createChat(userId, query);
  chatId = chat._id;
}

// Save user message
await ChatModel.addMessage(chatId, 'user', query);
```

### 3. Stream AI Response
```typescript
// Stream from FastAPI
const response = await fetch('http://127.0.0.1:8000/api/query/stream');

// Parse and accumulate
let assistantMessage = '';
// ... parse SSE events ...
assistantMessage += event.text;
```

### 4. Save AI Response
```typescript
// After stream completes
await ChatModel.addMessage(
  chatId,
  'assistant',
  assistantMessage,
  sources
);
```

### 5. Return Chat ID
```typescript
// Frontend receives chatId in header
const chatId = response.headers.get('X-Chat-Id');
setCurrentChatId(chatId);  // Continue this chat
```

## 🎨 UI Features

### Chat History Sidebar
- **Toggle button** - Left side of screen
- **Chat list** - All user's chats
- **New chat** - Start fresh conversation
- **Delete chat** - Remove unwanted chats
- **Chat preview** - Title and message count
- **Timestamps** - Last updated date

### Location
The sidebar appears on the left side of the chat page.

### Usage
1. Click **history icon** (left side)
2. View **all your chats**
3. Click chat to **load it** (TODO: implement loading)
4. Click **trash icon** to delete
5. Click **"+ New Chat"** to start fresh

## 🔒 Security

### User Isolation
```typescript
// All queries filtered by userId
const chats = await collection.find({ userId });
```

### Authorization
```typescript
// Verify ownership before operations
const chat = await collection.findOne({
  _id: chatId,
  userId: session.user.id  // Must match!
});
```

### Session Required
```typescript
// All endpoints check authentication
const session = await getServerSession(authOptions);
if (!session?.user?.id) {
  return 401 Unauthorized;
}
```

## 📁 Files Created

### Models
- `lib/models/Chat.ts` - Chat model and database operations

### API Routes
- `app/api/chats/route.ts` - List/create chats
- `app/api/chats/[id]/route.ts` - Get/update/delete chat
- `app/api/chats/[id]/messages/route.ts` - Add messages
- `app/api/chat/route.ts` - **Updated** to save messages

### Components
- `app/components/chat-history.tsx` - Sidebar UI
- `app/components/chat-interface.tsx` - **Updated** to track chatId

### Layouts
- `app/chat/layout.tsx` - **Updated** to include ChatHistory

## 🎯 Database Queries

### Create Index for Performance
```javascript
// In MongoDB shell or Compass
db.chats.createIndex({ userId: 1, updatedAt: -1 });
```

This speeds up fetching user's chats sorted by recent activity.

## 📊 Statistics

### Get User's Chat Stats
```typescript
const collection = await ChatModel.getCollection();

const stats = await collection.aggregate([
  { $match: { userId: session.user.id } },
  {
    $group: {
      _id: null,
      totalChats: { $sum: 1 },
      totalMessages: { $sum: { $size: '$messages' } },
      avgMessagesPerChat: { $avg: { $size: '$messages' } }
    }
  }
]).toArray();
```

## 🚀 Next Steps

### Enhance Chat History
- [ ] **Load chat** - Click to load previous conversation
- [ ] **Search chats** - Find by keywords
- [ ] **Export chat** - Download as PDF/text
- [ ] **Share chat** - Generate shareable link
- [ ] **Pin favorites** - Keep important chats on top

### Add Features
- [ ] **Edit messages** - Modify sent messages
- [ ] **Regenerate** - Re-generate AI response
- [ ] **Branch conversations** - Fork at any point
- [ ] **Chat folders** - Organize by category
- [ ] **Archive old chats** - Hide without deleting

### Analytics
- [ ] **Usage stats** - Messages per day
- [ ] **Popular topics** - Most asked questions
- [ ] **Response times** - AI performance metrics
- [ ] **User engagement** - Active users, sessions

## 🐛 Troubleshooting

### Chats not saving
Check MongoDB connection:
```bash
# Is MongoDB running?
mongod

# Check connection in logs
# Look for: "MongoDB connected"
```

### Can't see chat history
Check authentication:
```typescript
// In browser console
console.log(session);  // Should have user.id
```

### Duplicate messages
This shouldn't happen, but if it does:
```typescript
// Add unique constraint
db.chats.createIndex(
  { userId: 1, 'messages.timestamp': 1 },
  { unique: true }
);
```

## ✅ Summary

You now have a **complete chat history system** that:

1. ✅ **Automatically saves** all user and AI messages
2. ✅ **Links to users** - Each user has their own history
3. ✅ **Stores sources** - Citations saved with responses
4. ✅ **Manages sessions** - Multiple chats per user
5. ✅ **Provides UI** - Sidebar to view/manage chats
6. ✅ **Ensures security** - User can only see their chats
7. ✅ **Tracks timestamps** - Know when messages were sent
8. ✅ **Supports operations** - Create, read, update, delete

**All conversations are now permanently saved!** 🎉

---

**MongoDB Collections:**
- `users` - User accounts
- `chats` - **NEW!** Conversation history

**Test it:**
1. Start chatting
2. Refresh page
3. Click history icon (left side)
4. See your saved chats!
