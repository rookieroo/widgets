import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import template from 'lodash.template'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {YoutubeIcon} from "lucide-react";
import * as React from "react";
import {CommomProps} from "@vavt/rt-extension/lib/types/common/props";
import {useCallback, useState} from "react";
import {InsertContentGenerator} from "md-editor-rt";
import {DialogClose} from "@radix-ui/react-dialog";

interface Props extends CommomProps {
  css?: string;
}

const YOUTUBE_EMBED_HTML_WITH_VARIABLES = `
<div style="display: flex; justify-content: center;">
    <iframe
      style="aspect-ratio: 16 / 9; width: 100% !important;"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
      src="<%- src %>"
    ></iframe>
  </div>
`


export function YoutubeEmbed(props: Props) {
  const {
    title = 'youtube',
    insert = () => null,
    trigger,
  } = props;
  const [link, setLink] = useState("")

  const handleEmbed = useCallback(
    (link: string) => {
      const generator: InsertContentGenerator = () => {
        const _link = "https://www.youtube.com/embed/" + link.split("/").splice(-1)[0]
        return {
          targetValue: template(YOUTUBE_EMBED_HTML_WITH_VARIABLES)({src: _link}),
          deviationStart: 0,
          deviationEnd: 0
        };
      };

      insert(generator);
    },
    [insert]
  );


  return (
    <Dialog>
      <DialogTrigger asChild>
        <YoutubeIcon className="h-4 w-4 dark:text-white" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Youtube Embed Link
          </DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Link
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              value={link}
              onChange={event => setLink(event.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={() => handleEmbed(link)}
              type="submit"
            >
              Embed
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
