import { Expand, FilterIcon, Shrink } from 'lucide-react';
import { Download } from './download';
import Search from './search';
import { Share } from './share';
import { Button } from './ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { categoryData } from './periodic-table';
import { Item } from '@/app/data/devops';
import { Categories } from '@/app/constants';

export default function Topbar({
  setTextSearch,
  toggleFullScreen,
  isFullScreen,
  setOpen,
  open,
  activeCategory,
  setActiveCategory,
}: {
  setTextSearch: Function;
  toggleFullScreen: Function;
  isFullScreen: boolean;
  setOpen: Function;
  open: boolean;
  activeCategory: Categories | null;
  setActiveCategory: Function;
}) {
  return (
    <div className="flex items-center justify-center w-full p-4 border-b border-border">
      <div className="flex-1 hidden w-full mr-auto lg:flex xl:w-auto">
        <Share />
        <Download />
      </div>

      <div className="flex items-center justify-center w-full xl:w-auto">
        <Search className="mx-2 flex-2" setTextSearch={setTextSearch} />
        <div className="flex xl:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                onClick={() => setOpen((prev: boolean) => !prev)}
                variant={'secondary'}
              >
                <FilterIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex-col items-center justify-center overflow-scroll  max-h-52">
              {categoryData.map((item, i) => {
                const isActive =
                  activeCategory === null || activeCategory === item.name;
                return (
                  <DropdownMenuItem
                    key={i}
                    className="items-center justify-center"
                  >
                    <Button
                      onClick={() => {
                        setActiveCategory((prev: string) =>
                          prev === item.name ? null : item.name
                        );
                        setOpen(false);
                      }}
                      variant={'ghost'}
                      className={`flex justify-start items-center w-full ${
                        isActive ? 'brightness-100' : 'brightness-75'
                      }  hover:brightness-90`}
                    >
                      <div
                        className={`px-1 lg:mx-0 w-6 h-6 rounded my-1 ${item.color}`}
                      ></div>
                      <span className="px-2 text-sm">{item.name}</span>
                    </Button>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="items-center justify-end flex-1 hidden ml-auto  lg:flex">
        <Button
          variant={'secondary'}
          onClick={() => {
            toggleFullScreen();
          }}
          className=""
        >
          {isFullScreen ? (
            <Shrink className="w-4 h-4" />
          ) : (
            <Expand className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
