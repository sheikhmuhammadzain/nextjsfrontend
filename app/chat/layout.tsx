import { Navbar } from '../components/navbar';
import { ChatHistory } from '../components/chat-history';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <ChatHistory />
      {children}
    </>
  );
}
