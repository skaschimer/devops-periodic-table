// src/components/ChatBox.tsx
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

type ChatBoxProps = {
  prompt: string;
};

export const ChatBox: React.FC<ChatBoxProps> = ({ prompt }) => {
  const [userInput, setUserInput] = useState<string>('');
  const [botResponse, setBotResponse] = useState<string>('');
  const [requestCount, setRequestCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const MAX_REQUESTS = 5;

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleChatSubmit();
    }
  };

  const handleChatSubmit = async () => {
    if (userInput.trim() === '') return;
    if (requestCount >= MAX_REQUESTS) {
      alert('You have reached the maximum number of requests.');
      return;
    }

    setRequestCount(requestCount + 1);
    setIsLoading(true);
    setBotResponse(''); // Clear previous response

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: prompt,
            },
            {
              role: 'user',
              content: userInput,
            },
          ],
          temperature: 0.4,
          max_tokens: 500,
          stream: true,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(response.statusText);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let botMessageContent = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunkValue = decoder.decode(value);

        const lines = chunkValue
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line !== '');

        for (const line of lines) {
          if (line === 'data: [DONE]') {
            break;
          }
          if (line.startsWith('data: ')) {
            const jsonStr = line.replace('data: ', '');
            try {
              const json = JSON.parse(jsonStr);
              const content = json.choices[0].delta?.content;
              if (content) {
                botMessageContent += content;
                setBotResponse(botMessageContent);
              }
            } catch (e) {
              console.error('Error parsing JSON:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error interacting with OpenAI API:', error);
    }

    setIsLoading(false);
    setUserInput(''); // Clear the input field
  };

  return (
    <div className="flex flex-col my-4 space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <Button variant="secondary" onClick={handleChatSubmit} disabled={isLoading}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </Button>
      </div>
      {isLoading && (
        <div className="flex justify-center items-center">
          <p>Loading...</p>
        </div>
      )}
      {botResponse && (
        <Card>
          <CardContent>
            <ReactMarkdown
              components={{
                ul: ({ node, ...props }) => <ul {...props} className="list-disc list-inside" />,
                li: ({ node, ...props }) => <li {...props} className="list-disc list-inside" />,
                a: ({ node, ...props }) => (
                  <a {...props} className="text-blue-500 hover:underline" />
                ),
                pre: ({ node, ...props }) => <pre {...props} className="overflow-auto" />,
                code: ({ node, inline, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{ margin: 0 }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code
                      className={`p-1 bg-gray-200 text-sm rounded ${className}`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                p: ({ node, children, ...props }) => <p {...props}>{children}</p>,
              }}
            >
              {botResponse}
            </ReactMarkdown>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
