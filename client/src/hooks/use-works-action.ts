import { useRegisterActions } from "kbar";
import { useMemo } from "react";
import {generateKey} from "@/utils/utils";
import {useLocation} from "wouter";
import {useConfig} from "@/store/useConfig";
import {useTranslation} from "react-i18next";

const searchId = generateKey();

export default function useWorksAction() {
  const [location, navigate] = useLocation();
  const [config] = useConfig();
  const {t, i18n} = useTranslation();

  const defaultAction = useMemo(() => {
    return {
      id: searchId,
      name: t('search_blogs'),
      shortcut: ["?"],
      keywords: "works find search work portfolio",
      section: "Blogs",
    };
  }, [i18n.language]);

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
