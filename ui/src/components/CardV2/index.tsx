import { useMemo } from "react";
import clsx from "clsx";
import { getJumpTarget } from "../../utils/setting";
import { ToolLogo } from "../ToolLogo";

interface CardProps {
  title: string;
  url: string;
  des: string;
  logo: string;
  catelog: string;
  onClick: () => void;
  index: number;
  isSearching: boolean;
}

const Card = ({ title, url, des, logo, catelog, onClick, index, isSearching }: CardProps) => {

  const showNumIndex = index < 10 && isSearching;

  return (
    <a
      href={url === "toggleJumpTarget" ? undefined : url}
      onClick={onClick}
      target={getJumpTarget() === "blank" ? "_blank" : "_self"}
      rel="noreferrer"
      className={clsx("van-card", styles.container)}
    >
      {showNumIndex && (
        <span className={clsx("van-card-index", styles.index)}>
          {index + 1}
        </span>
      )}

      <div className={clsx("van-card-icon", styles.iconWrapper)}>
        <ToolLogo logo={logo} name={title} url={url} className="h-full w-full text-xl" />
      </div>

      <div className={clsx("van-card-content", styles.content)}>
        <div className={clsx("van-card-header", styles.header)}>
          <h3 className={clsx("van-card-title", styles.title)} title={title}>
            {title}
          </h3>
          {catelog && (
            <span className={clsx("van-card-catelog", styles.catelog)}>
              {catelog}
            </span>
          )}
        </div>
        <p className={clsx("van-card-desc", styles.desc)} title={des}>
          {des}
        </p>
      </div>
    </a>
  );
};

const styles = {
  container: "group relative flex w-full cursor-pointer flex-col p-3 rounded-lg bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-gray-100 transition-all duration-300 hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] hover:border-purple-100 dark:bg-gray-800 dark:border-gray-700/50 dark:hover:border-purple-900/50 sm:flex-row sm:items-start sm:text-left h-full",
  index: "absolute right-2 top-2 font-mono text-xs text-gray-300 dark:text-gray-600",
  iconWrapper: "mb-2 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-50/50 dark:bg-gray-700/30 overflow-hidden sm:mb-0 sm:mr-3 sm:mt-0.5",
  content: "flex flex-col items-center min-w-0 flex-1 w-full sm:items-start",
  header: "flex flex-col items-center gap-1 w-full sm:flex-row sm:justify-between sm:w-full",
  title: "truncate text-[15px] font-medium text-gray-800 dark:text-gray-200 w-full text-center sm:w-auto sm:text-left sm:flex-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors",
  catelog: "hidden sm:block shrink-0 rounded bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-400 dark:bg-gray-700 dark:text-gray-500",
  desc: "hidden sm:line-clamp-2 mt-1 text-xs text-gray-500/90 dark:text-gray-400/90 break-all leading-relaxed",
};

export default Card;
