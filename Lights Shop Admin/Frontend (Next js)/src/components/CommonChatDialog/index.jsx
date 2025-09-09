import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";

const ChatDialog = ({
  open,
  onClose,
  complaint,
  messages,
  loading,
  page,
  limit,
  total,
  onPageChange,
  fetchMessagesFn,
  sendMessageFn,
  recordIdKey,
  chatTitle = "Chat",
}) => {
  const [message, setMessage] = useState("");
  const [scrollingUpLoading, setScrollingUpLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const adminId = useSelector((state) => state.auth?.userInfo?.userData?.id);
  const totalPages = Math.ceil(total / limit);

  // Auto-scroll to bottom on open or when new messages arrive
  useEffect(() => {
    if (open && messages?.length > 0 && !scrollingUpLoading) {
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [open, messages, scrollingUpLoading]);

  // Handle scrolling up to load more messages
  const handleScroll = async () => {
    const container = chatContainerRef.current;

    if (!container || scrollingUpLoading) return;

    const nearTop = container.scrollTop < 20;

    if (nearTop && page < totalPages) {
      setScrollingUpLoading(true);
      const prevScrollHeight = container.scrollHeight;

      await onPageChange(page + 1);

      setTimeout(() => {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop = newScrollHeight - prevScrollHeight;
        setScrollingUpLoading(false);
      }, 200);
    }
  };

  // Handle sending a message
  const handleSendMessage = async (newMessage) => {
    if (!complaint || !newMessage?.trim()) return;

    const payload = {
      userId: adminId,
      note: newMessage,
      [recordIdKey]: complaint,
    };

    try {
      const res = await sendMessageFn(payload);

      if (res?.status === 200) {
        setMessage("");
        const res2 = await fetchMessagesFn(complaint, 1, limit);
        const leads = res2?.data?.leads || res2?.data?.orders || [];

        const newMessages = leads.map((msg) => ({
          sender: msg.userId === adminId ? "me" : "staff",
          text: msg.note,
          createdAt: msg.createdAt,
        }));

        setMessage(newMessages);
        setChatPage(1);
        setChatTotal(res2.data.total || 0);

        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
              chatContainerRef.current.scrollHeight;
          }
        }, 100);
      } else {
        console.error("Message not added:", res);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        {chatTitle}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{ height: 400, display: "flex", flexDirection: "column" }}
      >
        {/* Chat Messages Container */}
        <Box
          ref={chatContainerRef}
          onScroll={handleScroll}
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            mb: 2,
            pr: 1,
          }}
        >
          {loading && page === 1 ? (
            <Box sx={{ display: "flex", justifyContent: "center",alignItems:'center', mt: 2 , height:'100%' }}>
              <CircularProgress />
            </Box>
          ) : messages?.length > 0 ? (
            <>
              {scrollingUpLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                  <CircularProgress size={20} />
                </Box>
              )}

              {[...messages].reverse().map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent:
                      msg.sender === "me" ? "flex-end" : "flex-start",
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor:
                        msg.sender === "me" ? "#1976d2" : "#e0e0e0",
                      color: msg.sender === "me" ? "#fff" : "#000",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      maxWidth: "70%",
                    }}
                  >
                    <Typography variant="body2">{msg.text}</Typography>
                  </Box>
                </Box>
              ))}
            </>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No messages yet.
            </Typography>
          )}
        </Box>

        {/* Input Area */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && handleSendMessage(message)
            }
          />
          <Button
            variant="contained"
            onClick={() => handleSendMessage(message)}
          >
            Send
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
