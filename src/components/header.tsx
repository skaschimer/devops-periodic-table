import Link from 'next/link';
import { Button } from './ui/button';
import { Icons } from './ui/icons';
import { siteConfig } from '@/config';
import { useTheme } from 'next-themes';
import { themes } from '@/lib/utils';
import { useState } from 'react';
import { Sheet, SheetContent } from './ui/sheet';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <nav className="flex w-full">
      <Sheet open={open} onOpenChange={() => setOpen((prev) => !prev)}>
        <SheetContent>
          <div className="flex flex-col items-center justify-center w-full">
            <Link
              className="flex items-center justify-start w-full my-2"
              href={siteConfig.github}
              target="_blank"
            >
              <Button className="" variant={'ghost'}>
                <Icons.GitHub className="w-6 h-6 fill-current" />
                <span className="px-4 text-lg font-bold">GitHub</span>
              </Button>
            </Link>
            <Link
              className="flex items-center justify-start w-full my-2"
              href={siteConfig.linkedin}
            >
              <Button variant={'ghost'}>
                <Icons.Linkedin className="w-6 h-6 fill-current" />
                <span className="px-4 text-lg font-bold">LinkedIn</span>
              </Button>
            </Link>

            <Button
              onClick={() =>
                theme === themes.DARK
                  ? setTheme(themes.LIGHT)
                  : setTheme(themes.DARK)
              }
              variant={'ghost'}
              className="flex items-center justify-start w-full my-2"
            >
              {theme === themes.DARK ? (
                <div className="flex items-center justify-start my-2">
                  <Icons.Moon className="w-6 h-6 fill-current" />
                  <span className="px-4 text-lg font-bold">Dark Mode</span>
                </div>
              ) : (
                <div className="flex items-center justify-start my-2">
                  <Icons.Sun className="w-6 h-6 fill-current" />
                  <span className="px-4 text-lg font-bold">Light Mode</span>
                </div>
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex items-center justify-start">
        <Icons.Logo className="w-5 h-5 mr-2 text-black dark:text-white" />
        <span className="text-xl font-bold text-black dark:text-white">
          {siteConfig.title}
        </span>
      </div>
      <div className="flex ml-auto md:hidden">
        <Button onClick={() => setOpen((prev) => !prev)} variant={'ghost'}>
          <Icons.Menu className="w-5 h-5 fill-current" />
        </Button>
      </div>

      <div className="hidden ml-auto md:flex">
        <a href={siteConfig.github} target="_blank">
          <Button className="" variant={'ghost'}>
            <Icons.GitHub className="w-5 h-5 fill-current" />
          </Button>
        </a>
        <a
          href={siteConfig.linkedin}
          target="_blank"
          referrerPolicy="no-referrer"
        >
          <Button variant={'ghost'}>
            <Icons.Linkedin className="w-5 h-5 fill-current" />
          </Button>
        </a>
        <Button
          onClick={() =>
            theme === themes.DARK
              ? setTheme(themes.LIGHT)
              : setTheme(themes.DARK)
          }
          variant={'ghost'}
        >
          {theme === themes.DARK ? (
            <Icons.Moon className="w-5 h-5 fill-current" />
          ) : (
            <Icons.Sun className="w-5 h-5 fill-current" />
          )}
        </Button>
      </div>
    </nav>
  );
}
