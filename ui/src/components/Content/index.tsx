import CardV2 from "../CardV2";
import SearchBar from "../SearchBar";
import { Loading } from "../Loading";
import { Helmet } from "react-helmet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { FetchList } from "../../utils/api";
import TagSelector from "../TagSelector";
import pinyin from "pinyin-match";
import GithubLink from "../GithubLink";
import DarkSwitch from "../DarkSwitch";

import { toggleJumpTarget } from "../../utils/setting";
import LockScreen from "../LockScreen";
import { InboxIcon, Bars3BottomLeftIcon, ChevronDoubleLeftIcon } from "@heroicons/react/24/outline";
import RightSidebar from "../RightSidebar";

const mutiSearch = (s: string, t: string) => {
  const source = (s || "").toLowerCase();
  const target = t.toLowerCase();
  const rawInclude = source.includes(target);
  const pinYinInlcude = Boolean(pinyin.match(source, target));
  return rawInclude || pinYinInlcude;
};

const Content = (props: any) => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [currTag, setCurrTag] = useState("全部工具");
  const [searchString, setSearchString] = useState("");
  const [val, setVal] = useState("");
  const [locked, setLocked] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const filteredDataRef = useRef<any>([]);

  const showGithub = useMemo(() => {
    const hide = data?.setting?.hideGithub === true;
    return !hide;
  }, [data]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const r = await FetchList();
      if (r.locked) {
        setLocked(true);
        setData({ setting: r.setting });
      } else {
        setLocked(false);
        setData(r);
        const tagInLocalStorage = window.localStorage.getItem("tag");
        if (tagInLocalStorage && tagInLocalStorage !== "") {
          if (r?.catelogs && r?.catelogs.includes(tagInLocalStorage)) {
            setCurrTag(tagInLocalStorage);
          }
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [setData, setLoading, setCurrTag]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Inject Custom Code
  useEffect(() => {
    if (data?.setting) {
      if (data.setting.customCSS) {
        const style = document.createElement("style");
        style.id = "custom-css";
        style.innerHTML = data.setting.customCSS;
        document.head.appendChild(style);
        return () => {
          const el = document.getElementById("custom-css");
          if (el) el.remove();
        };
      }
    }
  }, [data?.setting?.customCSS]);

  useEffect(() => {
    if (data?.setting?.customJS) {
      try {
        const rawJS = data.setting.customJS.trim();
        const existingScript = document.getElementById("custom-js");
        if (existingScript) existingScript.remove();

        if (rawJS.startsWith("<script")) {
          const div = document.createElement("div");
          div.innerHTML = rawJS;
          const originalScript = div.querySelector("script");

          if (originalScript) {
            const script = document.createElement("script");
            script.id = "custom-js";

            Array.from(originalScript.attributes).forEach((attr) => {
              script.setAttribute(attr.name, attr.value);
            });

            if (originalScript.innerHTML) {
              script.innerHTML = originalScript.innerHTML;
            }

            document.body.appendChild(script);
          }
        } else {
          const script = document.createElement("script");
          script.id = "custom-js";
          script.innerHTML = rawJS;
          document.body.appendChild(script);
        }

        return () => {
          const el = document.getElementById("custom-js");
          if (el) el.remove();
        };
      } catch (e) {
        console.error("Failed to inject custom JS", e);
      }
    }
  }, [data?.setting?.customJS]);

  const handleSetCurrTag = (tag: string) => {
    setCurrTag(tag);
    if (tag !== "管理后台") {
      window.localStorage.setItem("tag", tag);
    }
    // Only reset search string, don't reset chosen tag
    setVal("");
    setSearchString("");
  };

  const resetSearch = (notSetTag?: boolean) => {
    setVal("");
    setSearchString("");
    const tagInLocalStorage = window.localStorage.getItem("tag");
    if (!notSetTag && tagInLocalStorage && tagInLocalStorage !== "" && tagInLocalStorage !== "管理后台") {
      setCurrTag(tagInLocalStorage);
    }
  };

  const handleSetSearch = (val: string) => {
    if (val !== "" && val) {
      setCurrTag("全部工具");
      setSearchString(val.trim());
    } else {
      resetSearch();
    }
  };

  const filteredData = useMemo(() => {
    if (data.tools) {
      const localResult = data.tools
        .filter((item: any) => {
          if (searchString === "") return true;
          return (
            mutiSearch(item.name, searchString) ||
            mutiSearch(item.desc, searchString) ||
            mutiSearch(item.url, searchString)
          );
        });
      return localResult;
    } else {
      return [];
    }
  }, [data, searchString]);

  useEffect(() => {
    filteredDataRef.current = filteredData;
  }, [filteredData]);

  const onKeyEnter = useCallback((ev: KeyboardEvent) => {
    const cards = filteredDataRef.current;
    if (ev.keyCode === 13) {
      if (cards && cards.length) {
        window.open(cards[0]?.url, "_blank");
        resetSearch();
      }
    }
    if (ev.ctrlKey || ev.metaKey) {
      const num = Number(ev.key);
      if (isNaN(num)) return;
      ev.preventDefault();
      const index = Number(ev.key) - 1;
      if (index >= 0 && index < cards.length) {
        window.open(cards[index]?.url, "_blank");
        resetSearch();
      }
    }
  }, []);

  useEffect(() => {
    if (searchString.trim() === "") {
      document.removeEventListener("keydown", onKeyEnter);
    } else {
      document.addEventListener("keydown", onKeyEnter);
    }
    return () => {
      document.removeEventListener("keydown", onKeyEnter);
    };
  }, [searchString, onKeyEnter]);

  const renderCardsV2 = (cardsArr: any[]) => {
    return cardsArr.map((item, index) => {
      return (
        <CardV2
          title={item.name}
          url={item.url}
          des={item.desc}
          logo={item.logo}
          key={item.id}
          catelog={item.catelog}
          index={index}
          isSearching={searchString.trim() !== ""}
          onClick={() => {
            resetSearch();
            if (item.url === "toggleJumpTarget") {
              toggleJumpTarget();
              loadData();
            }
          }}
        />
      );
    });
  };

  if (locked) {
    return <LockScreen onUnlock={loadData} />;
  }

  const isSearching = searchString.trim() !== "";
  const catelogsList: string[] = data?.catelogs ?? ["全部工具"];

  return (
    <div className={clsx("van-layout-root", styles.root)}>
      <Helmet>
        <meta charSet="utf-8" />
        <link rel="icon" href={data?.setting?.favicon ?? "favicon.ico"} />
        <title>{data?.setting?.title ?? "Van Nav"}</title>
      </Helmet>

      {/* Left Sidebar */}
      <div className={clsx(
        "transition-all duration-300 ease-in-out flex flex-col flex-shrink-0 z-30 sticky top-0 overflow-hidden",
        isSidebarCollapsed ? "w-0 opacity-0 border-r-0 md:h-screen" : "van-layout-sidebar w-full md:w-64 md:h-screen bg-white dark:bg-gray-900 md:border-r border-b md:border-b-0 border-gray-200 dark:border-gray-800 shadow-sm"
      )}>
        <div className="py-6 px-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-800 shrink-0">
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500 tracking-tight truncate">
            {data?.setting?.title ?? "Van Nav"}
          </h1>
          <button 
            onClick={() => setIsSidebarCollapsed(true)}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            title="收起侧边栏"
          >
            <ChevronDoubleLeftIcon className="w-5 h-5 hidden md:block" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-6 hide-scrollbar min-w-[256px]">
          <TagSelector
            tags={catelogsList}
            currTag={currTag}
            onTagChange={handleSetCurrTag}
          />
        </div>
      </div>

      {/* Main Container */}
      <div className={clsx("van-layout-main", styles.mainContainer)}>
        
        {/* Toggle Button for Collapsed State */}
        {isSidebarCollapsed && (
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="fixed top-6 left-4 z-40 p-2 bg-white dark:bg-gray-800 text-gray-500 shadow-md rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 focus:outline-none"
            title="展开侧边栏"
          >
            <Bars3BottomLeftIcon className="w-6 h-6" />
          </button>
        )}

        {/* Top Banner (Hero Area) */}
        <div className={styles.banner}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-3xl mx-auto w-full px-4 text-center z-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8 tracking-wide drop-shadow-md">
              发现最新实用工具与资源
            </h2>
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md shadow-2xl">
              <SearchBar
                searchString={val}
                setSearchText={(t) => {
                  setVal(t);
                  handleSetSearch(t);
                }}
              />
            </div>
          </div>
        </div>

        {/* Inner Content Area */}
        <div className="flex px-4 md:px-6 lg:px-8 py-8 w-full mx-auto gap-6 lg:gap-8 max-w-[1600px] mb-16">
          {/* Main List Sector */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <Loading />
            ) : isSearching ? (
              // Search Results Block
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <h3 className="mb-6 text-xl font-medium text-gray-800 dark:text-gray-200">搜索结果</h3>
                {filteredData.length > 0 ? (
                  <div className={styles.grid}>
                    {renderCardsV2(filteredData)}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <InboxIcon className="h-16 w-16 text-gray-300 dark:text-gray-700 mb-4" />
                    <p className="text-gray-400 dark:text-gray-500 text-sm">
                      没有找到与 <span className="font-medium">“{searchString}”</span>相关的工具
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Categories Block
              <div className="space-y-12">
                {catelogsList.map((cat) => {
                  if (cat === "全部工具" || cat === "管理后台") return null;
                  const cards = (data?.tools ?? []).filter((t: any) => t.catelog === cat);
                  if (cards.length === 0) return null;
                  return (
                    <div key={cat} id={`cat-${cat}`} className="scroll-mt-24 animate-in fade-in zoom-in-95 duration-300">
                      <h3 className="mb-6 text-xl font-semibold flex items-center text-gray-800 dark:text-gray-200">
                        <span className="w-1.5 h-6 bg-purple-500 rounded-full mr-3 shadow-sm"></span>
                        {cat}
                      </h3>
                      <div className={styles.grid}>
                        {renderCardsV2(cards)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <RightSidebar
            totalTools={data?.tools?.filter((t: any) => t.catelog !== "管理后台").length ?? 0}
            totalCategories={data?.catelogs?.filter((c: string) => c !== "全部工具" && c !== "管理后台").length ?? 0}
          />
        </div>
        
        {/* Footer */}
        <div className={styles.footer}>
          <a
            href="https://beian.miit.gov.cn"
            target="_blank"
            rel="noreferrer"
            className="hover:text-gray-500 transition-colors"
          >
            {data?.setting?.govRecord ?? ""}
          </a>
        </div>

      </div>

      {showGithub && <GithubLink />}
      <DarkSwitch showGithub={showGithub} />
    </div>
  );
};

const styles = {
  root: "min-h-screen bg-gray-50 dark:bg-gray-900 md:flex md:flex-row pb-20 md:pb-0",
  // original sidebar style was moved directly to clsx in JS logic
  mainContainer: "flex-1 flex flex-col min-w-0 transition-colors overflow-y-auto h-screen relative",
  banner: "relative w-full py-16 md:py-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shrink-0",
  grid: "grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4",
  footer: "absolute bottom-4 left-0 right-0 text-center text-xs text-gray-400 dark:text-gray-600 pointer-events-auto",
};

export default Content;
