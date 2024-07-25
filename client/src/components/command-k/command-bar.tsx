import { AnimatePresence, motion } from "framer-motion";
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch,
} from "kbar";
import Results from "./results";
import {useLocation} from "wouter";
import actions from "./actions";
import {debounce} from "@/utils/utils";
import {tryInt} from "../../utils/int";
import {client} from "../../main";
import {headersWithAuth} from "../../utils/auth";
import {useConfig} from "../../store/useConfig";
import useWorksAction from "../../hooks/use-works-action";
import useToggleMode from "../../hooks/use-toggle-mode";

function InnerCommandBar() {
  const [config, setConfig] = useConfig()
  useWorksAction();

  const handleSearchChange = debounce((event) => {
    const keyword = `${encodeURIComponent(event.target.value)}`
    if (!keyword) return
    const page = tryInt(1)
    const limit = tryInt(10, process.env.PAGE_SIZE)
    client.search({ keyword }).get({
      query: {
        page: page,
        limit: limit
      },
      headers: headersWithAuth()
    }).then(({ data }) => {
      if (data.data && typeof data.data !== 'string') {
        setConfig({
          ...config,
          search: data.data
        });
      }
    })
  }, 500);

  return (
    <KBarPortal>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: {
            duration: 0.1,
          },
        }}
        exit={{
          opacity: 0,
          transition: {
            duration: 0.1,
          },
        }}
        className="bg-white dark:bg-black bg-opacity-80 dark:bg-opacity-80
             backdrop-blur-sm
             h-screen w-screen fixed top-0 left-0"
      />

      <KBarPositioner>
        <KBarAnimator className="w-full max-w-xl">
          <div
            className="smooth-shadow dark:shadow-none h-auto
                dark:bg-background dark:text-white bg-white
                dark:bg-opacity-75 dark:backdrop-filter dark:backdrop-blur-md
                w-full py-2 px-2 rounded-xl"
          >
            <KBarSearch
              className="w-full p-4 outline-none mb-4 bg-neutral-50 dark:bg-input rounded"
              placeholder="Search"
              onChange={handleSearchChange}
              value={config.search}
            />

            <div className="mt-2 border-t border-neutral-200 dark:border-neutral-800 max-h-[60vh] overflow-y-scroll">
              <Results />
            </div>
          </div>
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
}

export default function CommandBar({ children }) {
  const [location, navigate] = useLocation();
  const [config, setConfig] = useConfig();
  useToggleMode(config);

  return (
    <AnimatePresence>
      <KBarProvider
        actions={actions(navigate, config, setConfig)}
        options={{
          enabledHistory: true,
        }}
      >
        <InnerCommandBar />

        {children}
      </KBarProvider>
    </AnimatePresence>
  );
}