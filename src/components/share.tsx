import { Check, CopyIcon, Share as ShareIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Icons } from './ui/icons';
import { siteConfig, socialConfig } from '@/config';
import { useEffect, useState } from 'react';

export function Share() {
  const [copied, setCopied] = useState(false);

  // after 2 seconds have copied be false if active
  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 2000);
    }
  }, [copied]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'secondary'}>
          <ShareIcon className="w-4 h-4 mr-2" />
          <span className="">Share</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[520px]">
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <h3 className="text-lg font-semibold">
            Copy the link or share to LinkedIn below
          </h3>
        </div>
        <div className="flex items-center pt-4 space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={siteConfig.url}
              readOnly
              autoFocus={false}
              className="h-9"
            />
          </div>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(siteConfig.url);
              setCopied(true);
            }}
            size="sm"
            variant="secondary"
            className="px-3"
          >
            {copied ? <Check width={16} /> : <CopyIcon width={16} />}
          </Button>
        </div>
        <div className="flex flex-col items-start justify-center">
          <div className="flex items-center justify-center my-4">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={socialConfig.linkedin}
            >
              <Button
                className="flex items-center justify-center mx-2"
                variant={'outline'}
              >
                <Icons.Linkedin className="w-4 h-4 mx-2 fill-current" />
                <span>LinkedIn</span>
              </Button>
            </a>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
