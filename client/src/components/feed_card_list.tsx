import {Link} from "wouter";
import {useTranslation} from "react-i18next";
import {timeago} from "../utils/timeago";
import {HashTag} from "./hashtag";
import {useMemo} from "react";
import {Card} from "./ui/card";

export function FeedCardList({id, title, avatar, draft, listed, top, summary, hashtags, createdAt, updatedAt}:
                               {
                                 id: string, avatar?: string,
                                 draft?: number, listed?: number, top?: number,
                                 title: string, summary: string,
                                 hashtags: { id: number, name: string }[],
                                 createdAt: Date, updatedAt: Date
                               }) {
  const {t} = useTranslation()
  return useMemo(() => (
    <Card className="p-4 my-2 transition-all duration-500">
      <Link href={`/feed/${id}`} target="_blank">
        <div className="flex items-center space-x-4">
          <div className="bg-muted h-16 w-16 flex-none">
            <img
              className="object-cover object-center w-full h-full hover:scale-105 translation duration-300"
              src={avatar}
              alt=""
            />
          </div>
          <div className="space-y-2">
            <div className="rounded-md">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-pretty overflow-hidden">
                {title}
              </h1>
            </div>
            <div className="rounded-md">
              <p className="space-x-2">
                    <span className="text-gray-400 text-sm" title={new Date(createdAt).toLocaleString()}>
                        {createdAt === updatedAt ? timeago(createdAt) : t('feed_card.published$time', {time: timeago(createdAt)})}
                    </span>
                {createdAt !== updatedAt &&
                <span className="text-gray-400 text-sm" title={new Date(updatedAt).toLocaleString()}>
                            {t('feed_card.updated$time', {time: timeago(updatedAt)})}
                        </span>
                }
              </p>
            </div>
            <div className="rounded-md">
              <p className="space-x-2">
                {draft === 1 && <span className="text-gray-400 text-sm">草稿</span>}
                {listed === 0 && <span className="text-gray-400 text-sm">未列出</span>}
                {top === 1 && <span className="text-primary text-sm">
                        置顶
                    </span>}
              </p>
              <p className="text-pretty overflow-hidden dark:text-neutral-500">
                {summary}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  ), [id, title, avatar, draft, listed, top, summary, hashtags, createdAt, updatedAt])
}