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
          model: 'gpt-4o',
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
          temperature: 0.2,
          max_tokens: 1000,
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

      let doneReading = false;
      while (!doneReading) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunkValue = decoder.decode(value);

        const lines = chunkValue
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line !== '');

        for (const line of lines) {
          if (line === 'data: [DONE]') {
            doneReading = true;
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
    } finally {
      setIsLoading(false);
      setUserInput(''); // Clear the input field
    }
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

    if (inline) {
      return (
        <code className="bg-neutral-50 dark:bg-neutral-900 px-1 rounded" {...props}>
          {children}
        </code>
      );
    }

    return (
      <div className="relative my-4 w-full">
        <pre className="relative overflow-x-auto rounded-lg bg-neutral-50 dark:bg-neutral-900 p-4 font-mono text-sm w-full">
          <code className={className} {...props}>
            {children}
          </code>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 rounded bg-white dark:bg-black hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            {isCopied ? (
              <Icons.Check className="w-4 h-4" />
            ) : (
              <Icons.Copy className="w-4 h-4" />
            )}
          </button>
        </pre>
      </div>
    );
  };

  return (
    <div className="flex flex-col my-4 space-y-4 w-full">
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
            <div className="prose dark:prose-invert mt-6 space-y-6 w-full max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ href, children, ...props }) => (
                    <a
                      href={href}
                      className="inline-flex items-center space-x-2 px-2 py-0 border border-transparent hover:border-black dark:hover:border-white rounded-md text-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    >
                      <span>{children}</span>
                      <Icons.ExternalLink className="w-4 h-4" />
                    </a>
                  ),
                  ul: ({ children, ...props }) => (
                    <ul className="list-disc pl-5 space-y-2" {...props}>
                      {children}
                    </ul>
                  ),
                  li: ({ children, ...props }) => (
                    <li className="flex items-start space-x-2" {...props}>
                      <span className="text-primary">•</span>
                      <span>{children}</span>
                    </li>
                  ),
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
