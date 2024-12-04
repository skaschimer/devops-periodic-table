// src/components/ChatBox.tsx
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Icons } from '@/components/ui/icons';
import { CodeProps } from 'react-markdown/lib/ast-to-react';

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

      console.log('Response:', response);

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

  const CodeBlock: React.FC<CodeProps> = ({
    node,
    inline,
    className,
    children,
    ...props
  }) => {
    const [isCopied, setIsCopied] = useState(false);
  
    const handleCopy = () => {
      navigator.clipboard.writeText(String(children)).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      });
    };
  
    return !inline ? (
      <div className="relative my-4 border-gray-500">
        <div className="overflow-x-auto">
          <pre className="rounded-lg bg-muted p-4 font-mono text-sm">
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 rounded bg-white dark:bg-black hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {isCopied ? (
            <Icons.Check className="w-4 h-4" />
          ) : (
            <Icons.Copy className="w-4 h-4" />
          )}
        </button>
      </div>
    ) : (
      <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded" {...props}>
        {children}
      </code>
    );
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
          <Icons.Send className="w-4 h-4" />
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
            <div className="prose dark:prose-invert mt-6">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code: CodeBlock,
                }}
              >
                {botResponse}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
