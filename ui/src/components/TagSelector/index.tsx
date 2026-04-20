import { useCallback, useState } from "react";
import { clsx } from "clsx";
import { HashtagIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface TagSelectorProps {
  tags: string[];
  currTag: string;
  onTagChange: (newTag: string) => void;
}

const TagSelector = (props: TagSelectorProps) => {
  const { tags = ["全部工具"], onTagChange, currTag } = props;
  const [filterText, setFilterText] = useState("");

  const handleScrollTo = (tag: string) => {
    onTagChange(tag);
    if (tag === "全部工具") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const elementId = `cat-${tag}`;
    const el = document.getElementById(elementId);
    if (el) {
      // Offset for header/banner
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const renderTags = useCallback(() => {
    const visibleTags = tags.filter((t) => 
      t.toLowerCase().includes(filterText.toLowerCase())
    );

    if (visibleTags.length === 0) {
      return (
        <div className="px-4 py-3 text-sm text-gray-400 text-center">
          无相关分类
        </div>
      );
    }

    return visibleTags.map((each: string) => {
      const isActive = currTag === each;
      return (
        <button
          key={`${each}-select-tag`}
          onClick={() => handleScrollTo(each)}
          className={clsx(
            "flex items-center w-full rounded-lg px-4 py-3 text-sm font-medium transition-all group",
            isActive
              ? "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          )}
        >
          <HashtagIcon className={clsx(
            "w-5 h-5 mr-3 flex-shrink-0 transition-colors",
            isActive ? "text-purple-500" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
          )} />
          <span className="truncate">{each}</span>
        </button>
      );
    });
  }, [tags, currTag, filterText]);

  return (
    <div className="w-full">
      <div className="mb-4 px-4 flex gap-2">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="过滤分类..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500/50 transition-shadow outline-none"
          />
        </div>
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
              document.getElementById('search-bar')?.focus();
            }, 300);
          }}
          className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm transition-colors shadow-sm whitespace-nowrap flex items-center justify-center flex-shrink-0"
          title="全站搜索"
        >
           全站搜索
        </button>
      </div>
      <div className="flex flex-col gap-1 px-2">
        {renderTags()}
      </div>
    </div>
  );
};

export default TagSelector;
