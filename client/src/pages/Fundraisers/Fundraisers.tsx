import { useQuery } from "@tanstack/react-query";
import { fetchFundraisers } from "../../api/fundraisers";
import { ScrollablePageLayout } from "../../components/ScrollablePageLayout/ScrollablePageLayout";
import { FundraiserCard } from "./FundraiserCard";
import type { Fundraiser } from "../../types";

export function Fundraisers() {
  const query = useQuery({
    queryKey: ["fundraisers"],
    queryFn: fetchFundraisers,
    select: (data) => [...data].sort((a, b) => b.year - a.year),
  });

  return (
    <ScrollablePageLayout<Fundraiser>
      query={query}
      itemName="fundraisers"
      getLabel={(fundraiser) => String(fundraiser.year)}
      renderItem={(fundraiser, ref) => (
        <FundraiserCard
          key={fundraiser._id}
          ref={ref}
          fundraiser={fundraiser}
        />
      )}
      bannerSrc="/h4acBanner.png"
    />
  );
}
