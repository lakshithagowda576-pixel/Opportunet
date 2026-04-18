import { useState } from "react";
import { useListMessages, useSendMessage } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Mail, Briefcase, Reply, User, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function Messages() {
  const { data: messages, isLoading } = useListMessages();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [replyBody, setReplyBody] = useState("");

  const { mutate: sendMessage, isPending: isSending } = useSendMessage({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["listMessages"] });
        setReplyBody("");
        toast({ title: "Message sent", description: "Your message was sent to HR." });
      },
      onError: () => {
        toast({ title: "Failed", description: "Could not send message.", variant: "destructive" });
      },
    },
  });

  if (isLoading) {
    return <div className="flex justify-center py-32"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
  }

  const selectedMessage = messages?.find((m) => m.id === selectedId) || messages?.[0];
  const canReplyAsHr = user?.role === "admin" || user?.role === "hr";

  const handleReply = async () => {
    if (!selectedMessage || !replyBody.trim()) return;

    if (canReplyAsHr) {
      const res = await fetch(`${BASE}/api/messages/${selectedMessage.id}/reply`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: replyBody }),
      });
      if (!res.ok) {
        toast({ title: "Failed", description: "Could not send HR reply.", variant: "destructive" });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["listMessages"] });
      setReplyBody("");
      toast({ title: "Reply sent", description: "Applicant has received your reply." });
      return;
    }

    const jobId = selectedMessage.jobId;
    sendMessage({
      data: {
        jobId,
        senderName: user?.name || "Applicant",
        senderEmail: user?.email || selectedMessage.senderEmail,
        subject: selectedMessage.subject.startsWith("Re:")
          ? selectedMessage.subject
          : `Re: ${selectedMessage.subject}`,
        body: replyBody,
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-120px)] flex flex-col md:flex-row gap-6 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      
      {/* Sidebar List */}
      <div className="w-full md:w-1/3 border-r border-border flex flex-col h-full bg-secondary/20">
        <div className="p-4 border-b border-border bg-card">
          <h2 className="text-xl font-display font-bold flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-primary" /> HR Inbox
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {!messages?.length ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No messages yet. Contact HR from a job listing to start a conversation.
            </div>
          ) : (
            messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelectedId(msg.id)}
                className={cn(
                  "w-full text-left p-4 rounded-xl transition-all",
                  (selectedId ? msg.id === selectedId : msg.id === messages[0].id)
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "hover:bg-secondary text-foreground"
                )}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-sm truncate pr-2">
                    {msg.isReply ? "HR Team" : "You"}
                  </span>
                  <span className={cn("text-[10px] whitespace-nowrap", 
                    (selectedId ? msg.id === selectedId : msg.id === messages[0].id) ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {format(new Date(msg.sentAt), 'MMM dd')}
                  </span>
                </div>
                <div className="text-sm font-medium truncate mb-1">{msg.subject}</div>
                <div className={cn("text-xs truncate", 
                  (selectedId ? msg.id === selectedId : msg.id === messages[0].id) ? "text-primary-foreground/80" : "text-muted-foreground"
                )}>
                  {msg.body}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Message Content View */}
      <div className="w-full md:w-2/3 flex flex-col h-full bg-card">
        {selectedMessage ? (
          <>
            <div className="p-6 border-b border-border">
              <h1 className="text-2xl font-bold text-foreground mb-4">{selectedMessage.subject}</h1>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", 
                    selectedMessage.isReply ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                  )}>
                    {selectedMessage.isReply ? <Briefcase className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-semibold">
                      {selectedMessage.isReply ? "HR Representative" : selectedMessage.senderName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {selectedMessage.isReply ? selectedMessage.hrEmail : selectedMessage.senderEmail}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(selectedMessage.sentAt), 'MMM dd, yyyy h:mm a')}
                </div>
              </div>

              {selectedMessage.job && (
                <div className="mt-4 px-4 py-2 bg-secondary rounded-lg text-sm inline-flex items-center gap-2 border border-border">
                  <span className="text-muted-foreground">Regarding:</span> 
                  <span className="font-semibold text-primary">{selectedMessage.job.title}</span>
                </div>
              )}
            </div>

            <div className="flex-1 p-8 overflow-y-auto">
              <div className="prose prose-slate max-w-none text-foreground whitespace-pre-wrap leading-relaxed">
                {selectedMessage.body}
              </div>
            </div>
            
            <div className="p-4 border-t border-border bg-secondary/30">
              <div className="relative">
                <textarea 
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  placeholder={canReplyAsHr ? "Reply to applicant..." : "Write a follow-up message to HR..."} 
                  className="w-full pl-4 pr-12 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none min-h-[80px] resize-none"
                />
                <button
                  onClick={handleReply}
                  disabled={!replyBody.trim() || isSending}
                  className="absolute bottom-4 right-4 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Reply className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <Mail className="w-16 h-16 mb-4 opacity-20" />
            <p>Select a message to read</p>
          </div>
        )}
      </div>

    </div>
  );
}
