'use client';

import { Icons } from '@/components/ui/Icons';

export interface BreadcrumbItem {
  id: string;
  title: string;
  type: 'course' | 'group' | 'lesson';
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (item: BreadcrumbItem, index: number) => void;
}

export default function Breadcrumbs({ items, onNavigate }: BreadcrumbsProps) {

  const getIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <Icons.BookOpen className="h-4 w-4" />;
      case 'group':
        return <Icons.FolderOpen className="h-4 w-4" />;
      case 'lesson':
        return <Icons.Play className="h-4 w-4" />;
      default:
        return <Icons.BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-[#151515] rounded-lg mb-6">
      <Icons.Home className="h-4 w-4 text-gray-400" />
      <button
        onClick={() => onNavigate({ id: '', title: 'Курсы', type: 'course' }, -1)}
        className="text-gray-400 hover:text-white transition-colors text-sm"
      >
        Курсы
      </button>
      
      {items.map((item, index) => (
        <div key={item.id} className="flex items-center gap-2">
          <Icons.ChevronRight className="h-4 w-4 text-gray-600" />
          <div className="flex items-center gap-1">
            {getIcon(item.type)}
            <button
              onClick={() => onNavigate(item, index)}
              className={`text-sm transition-colors ${
                index === items.length - 1
                  ? 'text-white font-medium'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.title}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
