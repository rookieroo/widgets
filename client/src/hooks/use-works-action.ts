import { useRegisterActions } from "kbar";
import { useMemo } from "react";
import {generateKey} from "@/utils/utils";
import {useLocation} from "wouter";
import {useConfig} from "@/store/useConfig";

const searchId = generateKey();

export default function useWorksAction() {
  const [location, navigate] = useLocation();
  const [config] = useConfig();

  const defaultAction = useMemo(() => {
    return {
      id: searchId,
      name: "Search blogs...",
      shortcut: ["?"],
      keywords: "works find search work portfolio",
      section: "Blogs",
    };
  }, []);

  const searchActions = useMemo(() => {
    if (!config.search || !config.search.length) {
      return [];
    }

    return config.search.map(({ id, summary, title, hashtags }) => {
      return {
        id,
        parent: searchId,
        name: `${title} ${summary}`,
        shortcut: [],
        section: "Blogs",
        keywords: hashtags,
        perform: () => navigate(`/feed/${id}`),
      };
    });
  }, [config.search, location]);

  const rootWorksAction = useMemo(
    () => (searchActions?.length ? defaultAction : null),
    [searchActions, defaultAction]
  );

  const actions = useMemo(() => {
    if (!rootWorksAction) {
      return defaultAction;
    }

    return [rootWorksAction, ...searchActions];
  }, [rootWorksAction, searchActions, defaultAction]);

  useRegisterActions(actions, [actions]);
}
