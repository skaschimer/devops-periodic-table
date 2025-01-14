import type { Dispatch, SetStateAction } from 'react';
import { Column } from './column';
import { CategorySelector, type CategoryData } from './category-selector';
import { Item, columns } from '@/app/data/devops';
import { Categories } from '@/app/constants';
import { colorConfig } from '@/config';

export const categoryData: CategoryData = [
  { name: Categories.AIOPS_ANALYTICS, color: colorConfig.orange },
  { name: Categories.ARTIFACT_PACKAGE_MANAGEMENT, color: colorConfig.cyan },
  { name: Categories.CLOUD, color: colorConfig.darkgreen },
  { name: Categories.COLLABORATION, color: colorConfig.rose },
  { name: Categories.CONFIGURATION_AUTOMATION, color: colorConfig.blue },
  { name: Categories.CONTAINERS, color: colorConfig.teal },
  { name: Categories.DATABASE_MANAGEMENT, color: colorConfig.darkorange },
  { name: Categories.CD, color: colorConfig.darkindigo },
  { name: Categories.ENTERPRISE_AGILE_PLANNING, color: colorConfig.green },
  { name: Categories.ISSUE_TRACKING_ITSM, color: colorConfig.lightorange },
  { name: Categories.RELEASE_MANAGEMENT, color: colorConfig.darkteal },
  { name: Categories.SECURITY, color: colorConfig.darkblue },
  { name: Categories.SERVERLESS_PAAS, color: colorConfig.red },
  { name: Categories.SCM, color: colorConfig.medindigo },
  { name: Categories.TESTING, color: colorConfig.lightblue },
  { name: Categories.VALUE_STREAM_MANAGEMENT, color: colorConfig.medgreen },
  { name: Categories.CI, color: colorConfig.indigo },
];

export default function PeriodicTable({
  setOpen,
  setActiveElement,
  activeCategory,
  setActiveCategory,
  textSearch,
  zoomLevel,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  activeCategory: Categories | null;
  setActiveCategory: Dispatch<SetStateAction<Categories | null>>;
  setActiveElement: Dispatch<SetStateAction<Item | null>>;
  textSearch: string;
  zoomLevel: 0 | 1 | 2;
}) {
  return (
    <div className="flex flex-col-reverse items-start justify-center w-full p-4 py-6 overflow-scroll text-white xl:flex-row lg:flex xl:overflow-visible flex-nowrap">
      <div className="flex items-start justify-start ml-0 md:justify-center xl:ml-auto">
        {columns.map((group, i) => (
          <Column
            select={() => setOpen(true)}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            key={i}
            items={group.items}
            textSearch={textSearch}
            setActiveElement={setActiveElement}
            categoryData={categoryData}
            zoomLevel={zoomLevel}
          />
        ))}
      </div>
      <CategorySelector
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categoryData={categoryData}
      />
    </div>
  );
}
