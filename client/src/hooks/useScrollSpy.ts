import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

interface WithId {
  _id: string;
}

interface UseScrollSpyOptions<T extends WithId> {
  items: T[] | undefined;
  getLabel: (item: T) => string;
  getHash?: (item: T) => string;
}

interface UseScrollSpyResult {
  activeId: string | null;
  setItemRef: (id: string) => (el: HTMLDivElement | null) => void;
  scrollToItem: (id: string) => void;
}

export function useScrollSpy<T extends WithId>({
  items,
  getLabel,
  getHash = getLabel,
}: UseScrollSpyOptions<T>): UseScrollSpyResult {
  const location = useLocation();
  const [activeId, setActiveId] = useState<string | null>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const isScrollingRef = useRef(false);

  const scrollToItem = useCallback(
    (itemId: string) => {
      const element = itemRefs.current.get(itemId);
      const item = items?.find((i) => i._id === itemId);
      if (element && item) {
        isScrollingRef.current = true;
        setActiveId(itemId);
        element.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", `#${getHash(item)}`);

        setTimeout(() => {
          isScrollingRef.current = false;
        }, 1000);
      }
    },
    [items, getHash],
  );

  useEffect(() => {
    if (!items?.length) return;

    const hash = location.hash.slice(1);
    if (hash) {
      const matchingItem = items.find((item) => getHash(item) === hash);
      if (matchingItem) {
        setTimeout(() => scrollToItem(matchingItem._id), 100);
      }
    } else {
      setActiveId(items[0]._id);
    }
  }, [items, location.hash, scrollToItem, getHash]);

  useEffect(() => {
    if (!items?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.split("-").slice(1).join("-");
            const item = items.find((i) => i._id === id);
            setActiveId(id);
            if (item) {
              window.history.replaceState(null, "", `#${getHash(item)}`);
            }
          }
        });
      },
      {
        rootMargin: "-100px 0px -60% 0px",
        threshold: 0,
      },
    );

    itemRefs.current.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items, getHash]);

  const setItemRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) {
        itemRefs.current.set(id, el);
      } else {
        itemRefs.current.delete(id);
      }
    },
    [],
  );

  return { activeId, setItemRef, scrollToItem };
}
