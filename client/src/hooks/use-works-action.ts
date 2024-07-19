import { useRegisterActions } from "kbar";
import { useEffect, useMemo, useState } from "react";
import {generateKey} from "@/utils/utils";
import {useLocation} from "wouter";
import {client} from "../main";
import {headersWithAuth} from "../utils/auth";

const searchId = generateKey();

export default function useWorksAction() {
  const [location, navigate] = useLocation();
  const [results, setResults] = useState();

  const defaultAction = useMemo(() => {
    return {
      id: searchId,
      name: "Search works...",
      shortcut: ["?"],
      keywords: "works find search work portfolio",
      section: "Works",
    };
  }, []);

  function fetchFeeds(title?: string) {
    let query = {
      page: 1,
      limit: 5,
      type: 'normal'
    }
    if(title) {
      query.title = title
    }
    client.feed.index.get({
      query,
      headers: headersWithAuth()
    }).then(({ data }) => {
      if (data && typeof data != 'string') {
        setResults([...data]);
      }
    })
  }

  useEffect(() => {
    fetchFeeds('');
  }, []);

  const searchActions = useMemo(() => {
    if (!results) {
      return null;
    }

    return results.map(({ id, summary, title, hashtags }) => {
      return {
        id,
        parent: searchId,
        name: title,
        shortcut: [],
        section: "Blogs",
        keywords: hashtags,
        perform: () => navigate(`feed/${id}`),
      };
    });
  }, [results, location]);

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
