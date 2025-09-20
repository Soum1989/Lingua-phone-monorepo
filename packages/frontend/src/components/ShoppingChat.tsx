import React, { useState, useRef, useEffect } from "react";
import languages from "../shared/languages";
import { speechService, enhancedTTS } from "../services/speechService";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  language: string;
  timestamp: Date;
  productRecommendations?: any[];
  searchResults?: any[];
  audioUrl?: string;
  actions?: { type: string; payload: any }[];
}

interface ShoppingChatProps {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

// Map product IDs to explicit Bazaar URLs
const productUrls: Record<string, string> = {
  "1": "https://bazaar-market-place.netlify.app/products/1",
  "2": "https://bazaar-market-place.netlify.app/products/2",
  "3": "https://bazaar-market-place.netlify.app/products/3",
  "4": "https://bazaar-market-place.netlify.app/products/4",
  "5": "https://bazaar-market-place.netlify.app/products/5",
  "6": "https://bazaar-market-place.netlify.app/products/6",
  "7": "https://bazaar-market-place.netlify.app/products/7",
  "8": "https://bazaar-market-place.netlify.app/products/8",
  "9": "https://bazaar-market-place.netlify.app/products/9",
  "10": "https://bazaar-market-place.netlify.app/products/10",
  "11": "https://bazaar-market-place.netlify.app/products/11",
  "12": "https://bazaar-market-place.netlify.app/products/12",
  "13": "https://bazaar-market-place.netlify.app/products/13",
  "14": "https://bazaar-market-place.netlify.app/products/14",
  "15": "https://bazaar-market-place.netlify.app/products/15",
  "16": "https://bazaar-market-place.netlify.app/products/16",
  "17": "https://bazaar-market-place.netlify.app/products/17",
  "18": "https://bazaar-market-place.netlify.app/products/18",
  "19": "https://bazaar-market-place.netlify.app/products/19",
  "20": "https://bazaar-market-place.netlify.app/products/20",
};

const getProductUrl = (product: any) => {
  // support product.id (number/string) and product.productId shapes
  const id =
    product?.id ?? product?.productId ?? product?.product_id ?? product?.sku;
  if (id === undefined || id === null) return "#";
  return productUrls[String(id)] ?? "#";
};

export default function ShoppingChat({
  selectedLanguage,
  onLanguageChange,
}: ShoppingChatProps): JSX.Element {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPlayingTTS, setIsPlayingTTS] = useState<{ [key: string]: boolean }>(
    {}
  );

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type === "assistant" && !isPlayingTTS[lastMessage.id]) {
        handlePlayTTS(lastMessage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // Render products cards
  const renderProducts = (products: any[] = []) => {
    return products.map((product: any) => {
      const priceText = (() => {
        if (product == null) return "";
        if (typeof product.price === "number") return `$${product.price.toFixed(2)}`;
        if (product.priceUsd) {
          const units = Number(product.priceUsd.units ?? 0);
          const nanos = Number(product.priceUsd.nanos ?? 0);
          const total = units + nanos / 1_000_000_000;
          return `$${total.toFixed(2)}`;
        }
        if (product.amount) return `$${Number(product.amount).toFixed(2)}`;
        return "";
      })();

      return (
        <div
          key={String(product?.id ?? product?.productId ?? Math.random())}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "8px",
            width: "150px",
          }}
        >
          <a
            href={getProductUrl(product)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontWeight: "bold",
              fontSize: "12px",
              display: "block",
              marginBottom: "4px",
            }}
          >
            {product?.name ?? product?.title ?? "Product"}
          </a>
          <div style={{ fontSize: "11px", color: "#666" }}>{priceText}</div>
        </div>
      );
    });
  };

  // Sending chat message
  const sendMessage = async (text: string) => {
    if (!text || !text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: text,
      language: selectedLanguage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          language: selectedLanguage,
          userId: "demo-user",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data: any = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: String(data?.translatedResponse ?? data?.response ?? "No response"),
        language: selectedLanguage,
        timestamp: new Date(),
        productRecommendations: Array.isArray(data?.productRecommendations)
          ? data.productRecommendations
          : undefined,
        searchResults: Array.isArray(data?.searchResults)
          ? data.searchResults
          : undefined,
        actions: Array.isArray(data?.actions) ? data.actions : undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        language: "en",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice recognition helpers
  const startSpeechRecognition = async () => {
    if (!speechService.isWebSpeechSupported()) {
      alert("Web Speech API not supported. Use Chrome or Edge.");
      return;
    }

    try {
      setIsRecording(true);
      const languageObj = languages.find((lang) => lang.code === selectedLanguage);
      const languageCode = languageObj?.bcp47 ?? "en-US";

      await speechService.startRecognition(
        languageCode,
        (transcript: string) => {
          setInputText(transcript);
          setIsRecording(false);
        },
        (err: any) => {
          console.error("Speech recognition error:", err);
          alert(String(err));
          setIsRecording(false);
        },
        () => console.log("Speech recognition started"),
        () => setIsRecording(false)
      );
    } catch (err) {
      console.error("Failed to start recognition:", err);
      setIsRecording(false);
    }
  };

  const stopSpeechRecognition = () => {
    try {
      speechService.stopRecognition();
    } catch (err) {
      // ignore stop errors
    }
    setIsRecording(false);
  };

  const toggleRecording = () => (isRecording ? stopSpeechRecognition() : startSpeechRecognition());

  // Play TTS
  const handlePlayTTS = async (message: ChatMessage) => {
    if (!enhancedTTS?.isSupported?.()) {
      // If TTS not supported, simply return
      return;
    }
    setIsPlayingTTS((prev) => ({ ...prev, [message.id]: true }));

    try {
      const languageObj = languages.find((lang) => lang.code === message.language);
      const languageCode = languageObj?.bcp47 ?? "en-US";

      await enhancedTTS.speak(String(message.content ?? ""), languageCode, {
        rate: 0.8,
        volume: 1.0,
        onSuccess: () => setIsPlayingTTS((prev) => ({ ...prev, [message.id]: false })),
        onError: () => setIsPlayingTTS((prev) => ({ ...prev, [message.id]: false })),
      });
    } catch (err) {
      console.error("TTS error:", err);
      setIsPlayingTTS((prev) => ({ ...prev, [message.id]: false }));
    }
  };

  const handleStopTTS = () => {
    try {
      enhancedTTS.stop();
    } catch (err) {
      // ignore
    }
    setIsPlayingTTS({});
  };

  // Action handler (SEARCH_PRODUCTS, VIEW_PRODUCT, ADD_TO_CART, GET_RECOMMENDATIONS)
  const handleAction = async (action: { type: string; payload: any }) => {
    setIsLoading(true);
    try {
      switch (action.type) {
        case "SEARCH_PRODUCTS": {
          const res = await fetch("/api/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: action.payload?.query ?? "",
              language: selectedLanguage,
            }),
          });
          if (res.ok) {
            const searchData = await res.json();
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                type: "assistant",
                content: `I found ${Array.isArray(searchData?.products) ? searchData.products.length : 0
                  } products for "${action.payload?.query ?? ""}".`,
                language: selectedLanguage,
                timestamp: new Date(),
                searchResults: Array.isArray(searchData?.products)
                  ? searchData.products
                  : undefined,
              },
            ]);
          }
          break;
        }
        case "VIEW_PRODUCT": {
          const pid = action.payload?.productId;
          const res = await fetch(`/api/products/${String(pid ?? "")}`);
          if (res.ok) {
            const product = await res.json();
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                type: "assistant",
                content: `Here are the details for ${product?.name ?? "this product"}: ${product?.description ?? ""
                  }`,
                language: selectedLanguage,
                timestamp: new Date(),
                searchResults: [product],
              },
            ]);
          }
          break;
        }
        case "ADD_TO_CART": {
          await fetch("/api/cart/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: "demo-user",
              productId: action.payload?.productId,
              quantity: action.payload?.quantity ?? 1,
            }),
          });
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              type: "assistant",
              content: "I've added that item to your cart!",
              language: selectedLanguage,
              timestamp: new Date(),
            },
          ]);
          break;
        }
        case "GET_RECOMMENDATIONS": {
          const res = await fetch("/api/action", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: { type: "GET_RECOMMENDATIONS", payload: action.payload },
              context: { query: action.payload?.query ?? "", language: selectedLanguage }
            }),
          });
          if (res.ok) {
            const recommendationData = await res.json();
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                type: "assistant",
                content: recommendationData?.translatedResponse ?? recommendationData?.response ?? "Here are some recommendations for you:",
                language: selectedLanguage,
                timestamp: new Date(),
                productRecommendations: Array.isArray(recommendationData?.productRecommendations)
                  ? recommendationData.productRecommendations
                  : undefined,
              },
            ]);
          }
          break;
        }
        default:
          console.warn("Unknown action type:", action.type);
      }
    } catch (err) {
      console.error("Action handler error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "600px",
        border: "1px solid #ddd",
        borderRadius: "12px",
        backgroundColor: "var(--bg-primary)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #eee",
          backgroundColor: "#4285f4",
          color: "white",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <h3 style={{ margin: "0 0 8px 0" }}>🛍️ AI Shopping Assistant</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span>Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "white",
              color: "#333",
            }}
          >
            {languages.map((lang: any) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: "16px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: "flex",
              justifyContent: message.type === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "12px 16px",
                borderRadius: "18px",
                backgroundColor: message.type === "user" ? "#4285f4" : "#f1f3f4",
                color: message.type === "user" ? "white" : "#333",
              }}
            >
              <div>{message.content}</div>

              {/* Recommendations */}
              {message.productRecommendations && message.productRecommendations.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  <strong>Recommended Products:</strong>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                      marginTop: "5px",
                    }}
                  >
                    {renderProducts(message.productRecommendations)}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {message.searchResults && message.searchResults.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  <strong>Search Results:</strong>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                      marginTop: "5px",
                    }}
                  >
                    {renderProducts(message.searchResults)}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {message.actions && message.actions.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  {message.actions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleAction(action)}
                      disabled={isLoading}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#4285f4",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        marginRight: "5px",
                      }}
                    >
                      {action.type.replaceAll("_", " ")}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* anchor for auto scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "16px",
          borderTop: "1px solid #eee",
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              // prevent double send if button click also triggers
              sendMessage(inputText);
            }
          }}
          placeholder={`Type your question in ${
            languages.find((l: any) => l.code === selectedLanguage)?.name ?? ""
          }...`}
          style={{
            flex: 1,
            padding: "12px 16px",
            border: "1px solid #ddd",
            borderRadius: "24px",
          }}
        />
        <button
          onClick={() => sendMessage(inputText)}
          disabled={!inputText.trim() || isLoading}
          style={{
            padding: "12px 16px",
            backgroundColor: "#4285f4",
            color: "white",
            border: "none",
            borderRadius: "24px",
          }}
        >
          Send
        </button>
        <button
          onClick={toggleRecording}
          disabled={isLoading}
          style={{
            padding: "12px",
            backgroundColor: isRecording ? "#ea4335" : "#34a853",
            color: "white",
            border: "none",
            borderRadius: "50%",
            fontSize: "16px",
            width: "48px",
            height: "48px",
          }}
        >
          {isRecording ? "⏹️" : "🎤"}
        </button>
      </div>
    </div>
  );
}
