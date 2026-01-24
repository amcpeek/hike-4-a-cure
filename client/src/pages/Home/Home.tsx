import { useQuery } from "@tanstack/react-query";
import { fetchSections } from "../../api/sections";
import { ScrollablePageLayout } from "../../components/ScrollablePageLayout/ScrollablePageLayout";
import { SectionCard } from "./SectionCard";
import type { Section } from "../../types";

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function Home() {
  const query = useQuery({
    queryKey: ["sections"],
    queryFn: fetchSections,
  });

  return (
    <ScrollablePageLayout<Section>
      query={query}
      itemName="sections"
      getLabel={(section) => section.title}
      getHash={(section) => toSlug(section.title)}
      renderItem={(section, ref) => (
        <SectionCard key={section._id} ref={ref} section={section} />
      )}
      bannerSrc="/h4acBanner.png"
    />
  );
}
