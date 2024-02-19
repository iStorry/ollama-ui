import * as React from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { toast } from "sonner";
import { ChatBubble, ChatBubbleProps } from "y/components/ui/chat-bubble";
import { Icons } from "y/components/ui/icons";

interface ChatProps {
  model: string | undefined;
}

export function Chat({ model }: ChatProps) {
  const [messages, setMessages] = React.useState<ChatBubbleProps[]>([]);
  const [input, setInput] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  var endOfMessagesRef = React.useRef<HTMLDivElement | null>(null);

  const checkIfModelIsSelected = React.useCallback(() => {
    if (!model) {
      toast.warning("Please select a model first!", { duration: 1000 });
      return false;
    }
    return true;
  }, [model]);

  const checkIfMessageIsEmpty = React.useCallback(() => {
    if (!input) {
      toast.warning("Please type a message first!", { duration: 1000 });
      return false;
    }
    return true;
  }, [input]);

  const generateMessage = React.useCallback(async () => {
    // Get the last ai message from the messages array and it's reference from the dom
    const lastAiMessage = messages[messages.length - 1];
    const lastUserMessage = messages[messages.length - 2];
    const lastAiMessageRef = endOfMessagesRef.current?.previousSibling;

    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt: lastUserMessage?.message }),
    });

    if (!response.body) {
      toast.error("Something went wrong!", { duration: 1000 });
      return;
    }

    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

    while (true) {
      const res = await reader?.read();
      if (res?.done) {
        setLoading(false);
        break;
      }
      const json = JSON.parse(res?.value);

      if (lastAiMessageRef) {
        const htmlDiv = lastAiMessageRef as HTMLDivElement;
        const bubbleAi = htmlDiv.querySelector(".bubble.ai") as HTMLDivElement;
        const hasPElement = bubbleAi.querySelector("div.text-sm");

        if (!hasPElement) {
          bubbleAi.innerHTML = `<div class="text-sm font-normal text-gray-900 dark:text-white"></div>`;
        }

        bubbleAi.querySelector("div.text-sm")!.innerHTML += json["response"];

        if (json["response"] === "\n" || json["response"] === " " || json["response"] === "↵") {
          bubbleAi.querySelector("div.text-sm")!.innerHTML += "<br>";
        }

        if (json["done"]) {
          setLoading(false);
          break;
        }

        if (endOfMessagesRef.current) {
          endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [messages]);

  const onMessageSend = React.useCallback(() => {
    if (!checkIfModelIsSelected() || !checkIfMessageIsEmpty()) {
      return;
    }

    // Update the messages array with the new message and loading state
    setMessages((prevMessages) => [
      ...prevMessages,
      { avatar: "U", username: "You", message: input, config: { loading: false, at: new Date() } },
      { avatar: "AI", username: "Ollama", config: { loading: true, at: new Date() } },
    ]);

    setInput("");
    setLoading(true);
  }, [checkIfModelIsSelected, checkIfMessageIsEmpty, input, generateMessage]);

  // Keyboard event handler
  const onKeyPress = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        onMessageSend();
      }
    },
    [onMessageSend],
  );

  React.useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  React.useEffect(() => {
    // If message length changes, generate a new message
    if (messages.length > 0) {
      generateMessage();
    }
  }, [messages, generateMessage]);

  return (
    <>
      <div className="h-96 overflow-scroll rounded bg-slate-800 p-4">
        <div className="flex flex-col gap-2.5">
          {messages.map((message, index) => (
            <ChatBubble key={index} {...message} />
          ))}
          <div ref={endOfMessagesRef} />
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <Input
          type="text"
          size="sm"
          placeholder="Type a message"
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={onKeyPress}
          value={input}
        />
        <Button variant="solid" color="primary" onClick={onMessageSend} isLoading={loading}>
          <Icons.send className="h-4 w-4" /> Send
        </Button>
      </div>
    </>
  );
}

// const [messages, setMessages] = React.useState<ChatBubbleProps[]>([]);
// const [inputMessage, setInputMessage] = React.useState<string>("");
// const [loading, setLoading] = React.useState<boolean>(false);
// const endOfMessagesRef = React.React.useRef<null | HTMLDivElement>(null);

// const loadMessage = React.useCallback(
//   async (prompt: string) => {
//     // Get the chat bubble which is posted by ai
//     console.log(messages);

//     // const reader = response.body?.getReader();

//     // if (!reader) {
//     //   toast.error("Something went wrong!", { duration: 1000 });
//     //   return;
//     // }

//   },
//   [model, messages],
// );

// const onClick = React.useCallback(() => {
//   // if (!model) {
//   //   toast.warning("Please select a model first!", { duration: 1000 });
//   //   return;
//   // }

//   if (!inputMessage) {
//     toast.warning("Please type a message first!", { duration: 1000 });
//     return;
//   }

//   loadMessage(inputMessage);

//   setMessages([
//     ...messages,
//     { avatar: "U", username: "You", message: inputMessage, config: { loading: false, at: new Date() } },
//     { avatar: "AI", username: "Ollama", config: { loading: true, at: new Date() } },
//   ]);

//   setInputMessage("");
//   setLoading(true);
// }, [model, inputMessage, messages]);

// const handleKeyPress = (event: React.KeyboardEvent) => {
//   if (event.key === "Enter") {
//     onClick();
//   }
// };

// return (
//   <>
//     <div className="h-96 overflow-scroll rounded bg-slate-800 p-4">
//       <div className="flex flex-col gap-2.5">

//         <div ref={endOfMessagesRef} />
//       </div>
//     </div>
//     <div className="flex items-center justify-center gap-4">
//       <Input
//         type="text"
//         size="sm"
//         placeholder="Type a message"
//         value={inputMessage}
//         onChange={(e) => setInputMessage(e.target.value)}
//         onKeyPress={handleKeyPress}
//       />
//       <Button variant="solid" color="primary" onClick={onClick} isLoading={loading}>
//         <Icons.send className="h-4 w-4" /> Send
//       </Button>
//     </div>
//   </>
// );
// }
