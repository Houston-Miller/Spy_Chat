import { useState, useEffect } from "react";
import { HubConnection } from "@microsoft/signalr";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface CodecBoardProps {
    connection: HubConnection | null;
    roomID: string;
}

interface ChatMessage {
    user: string;
    text: string;
}

export default function CodecBoard({ connection, roomID }: CodecBoardProps) {
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

    useEffect(() => {
        if (!connection) return;
        connection.on("ReceiveMessage", (user: string, text: string) => {
            setChatHistory((prev) => [...prev, { user, text }]);
        });
        return () => {
            connection.off("ReceiveMessage");
        };
    }, [connection]);

    const handleSendMessage = async () => {
        if (!connection || !message.trim()) return;
        try {
            await connection.invoke("SendMessage", roomID, message);
            setMessage(""); //This is to clear the input field after sending a message
        } catch (error) {
            console.error("Error sending message:", error);

        }
    };

  return (
    <div>
      <div>
        <h2>FREQ: {roomID}</h2>
        <span>Connected...</span>
      </div>

      {/* Message Readout */}
      <div>
        {chatHistory.length === 0 && (
          <p>Awaiting signal...</p>
        )}
        {chatHistory.map((msg, index) => (
          <div key={index}>
            <span>[{msg.user.substring(0, 5)}]:</span>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>

      {/* Textarea and Send Button */}
      <div className="space-y-4">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="ENTER MESSAGE..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button 
          onClick={handleSendMessage}
        >
          SEND
        </Button>
      </div>
    </div>
  );
}