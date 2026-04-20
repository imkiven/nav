import React from "react";
import clsx from "clsx";
import { DocumentTextIcon, Squares2X2Icon, UsersIcon } from "@heroicons/react/24/outline";

interface RightSidebarProps {
  totalTools: number;
  totalCategories: number;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ totalTools, totalCategories }) => {
  return (
    <div className="hidden lg:block w-[18rem] flex-shrink-0 space-y-6">
      
      {/* 站点统计 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 ring-1 ring-black/5 dark:ring-white/10">
        <h3 className="text-gray-900 dark:text-gray-100 text-sm font-medium mb-4 flex items-center">
          <span className="w-1 h-3.5 bg-purple-500 rounded-full mr-2"></span>
          站点统计
        </h3>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5">
            <Squares2X2Icon className="w-4 h-4 mx-auto text-blue-500 mb-1" />
            <div className="text-lg font-bold text-gray-800 dark:text-gray-200">{totalCategories}</div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">分类数</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5">
             <DocumentTextIcon className="w-4 h-4 mx-auto text-purple-500 mb-1" />
            <div className="text-lg font-bold text-gray-800 dark:text-gray-200">{totalTools}</div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">工具总数</div>
          </div>
        </div>
      </div>

      {/* 公告 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 ring-1 ring-black/5 dark:ring-white/10">
        <h3 className="text-gray-900 dark:text-gray-100 text-sm font-medium mb-3 flex items-center">
          <span className="w-1 h-3.5 bg-orange-500 rounded-full mr-2"></span>
          便捷信息
        </h3>
        <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed border border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50/50 dark:bg-gray-800/50">
          欢迎使用 Van Nav 导航系统。
          这是您的私人快捷导航和实用工具集合，让您的工作和学习更高效。
        </div>
      </div>

    </div>
  );
};

export default RightSidebar;
