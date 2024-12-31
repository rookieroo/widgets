import {
  Github,
  ArrowBigRight,
  Folder,
  Mail,
  Twitter
} from 'lucide-react';
import { useEffect, useRef } from "react";

export default function Result({ item, active, highlight }) {
  const ref = useRef(null);

  useEffect(() => {
    if (active && ref?.current) {
      highlight(ref);
    }
  }, [active]);

  return typeof item === "string" ? (
    <span className="text-neutral-500 text-sm capitalize flex items-center w-full h-12">
      <p className="mb-1 truncate text-base font-semibold min-w-0">
        {item}
      </p>
    </span>
  ) : (
    <div ref={ref} className="h-12 rounded flex items-center cursor-pointer">
      <span className="pl-2 inline-flex gap-2 items-center w-full">
        {item?.type === "link" && <ArrowBigRight />}
        {item?.type === "group" && <Folder />}
        {item?.type === "github" && <Github />}
        {item?.type === "contact" && <Mail />}
        {item?.type === "twitter" && <Twitter />}

        <p className="mb-1 truncate text-base font-semibold min-w-0">
          {`${item.name}`}
        </p>
      </span>
    </div>
  );
}
