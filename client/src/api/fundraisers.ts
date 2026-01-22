import { get, post, put, del } from "./client";
import type { Fundraiser, FundraiserInput } from "../types";

export function fetchFundraisers(): Promise<Fundraiser[]> {
  return get<Fundraiser[]>("/fundraisers");
}

export function createFundraiser(
  fundraiser: FundraiserInput,
): Promise<Fundraiser> {
  return post<Fundraiser>("/fundraisers", fundraiser);
}

export function updateFundraiser(
  id: string,
  fundraiser: Partial<FundraiserInput>,
): Promise<Fundraiser> {
  return put<Fundraiser>(`/fundraisers/${id}`, fundraiser);
}

export function deleteFundraiser(id: string): Promise<{ message: string }> {
  return del<{ message: string }>(`/fundraisers/${id}`);
}
