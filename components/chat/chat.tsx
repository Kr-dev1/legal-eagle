"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import MDEditor from "@uiw/react-md-editor"
import { chatMessage, getChatHistory } from "./actions/actions";
import { readStreamableValue } from "@ai-sdk/rsc";
import { Spinner } from "../ui/spinner";

export default function Chat(id: { id: string }) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [messageLoading, setMesasgeLoading] = useState(false)
  const [loadingMsgIndex, setLoadingMsgIndex] = useState<number | null>(null);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getChat = useCallback(async () => {
    const res = await getChatHistory(id.id);

    if (!res) return;
    const formatted = res.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    setMessages(formatted);
  }, [id.id]);

  useEffect(() => {
    getChat()
  }, [])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 320;
      const minHeight = 48;

      if (input.trim() === "") {
        textareaRef.current.style.height = minHeight + "px";
      } else {
        textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + "px";
      }
    }
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    const result = await chatMessage(input, id.id);
    if (!result) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
      return;
    }
    const { output } = result;
    let response = "";
    let msgIndex: number;
    setMessages((prev) => {
      msgIndex = prev.length - 1;
      setLoadingMsgIndex(msgIndex);
      return prev;
    });
    for await (const chunk of readStreamableValue(output)) {
      setMesasgeLoading(false)
      if (chunk) {
        response += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          updated[msgIndex] = { ...updated[msgIndex], content: response };
          return updated;
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-y-auto chat-scrollbar p-4 space-y-4 min-h-0">
        <div className="max-w-3xl mx-auto text-sm">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div className="max-w-[80vw] sm:max-w-xl break-words">
                {msg.role === "assistant" ? (
                  <div className="bg-transparent text-white px-3 sm:px-4 py-2 rounded-2xl">
                    {loadingMsgIndex === idx && !msg.content ? (
                      <Spinner />
                    ) : (
                      <MDEditor.Markdown
                        source={msg.content}
                        style={{ backgroundColor: "transparent", fontSize: ".875em" }}
                      />
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-200 text-black rounded-2xl px-3 sm:px-4 py-2">
                    {msg.content}
                  </div>
                )}

              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="flex-shrink-0 p-4">
        <div className="relative w-full max-w-3xl mx-auto flex items-end">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="What can I help you with today?"
            className="min-h-[48px] max-h-72 resize-none rounded-4xl pr-12 text-sm sm:text-base overflow-y-auto focus:outline-none focus:ring-0 focus:border-transparent"
            style={{
              paddingTop: '12px',
              paddingBottom: '12px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              transition: 'height 0.2s ease-in-out'
            }}
          />
          <Button
            size="icon"
            onClick={() => {
              sendMessage()
            }}
            className="absolute bottom-[6px] right-4 rounded-full"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}