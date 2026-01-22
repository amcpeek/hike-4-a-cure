export interface Photo {
  url: string;
  tag?: string;
}

export interface Section {
  _id: string;
  title: string;
  description?: string;
  order: number;
  photos: Photo[];
  createdAt: string;
  updatedAt: string;
}

export interface Fundraiser {
  _id: string;
  year: number;
  title?: string;
  description?: string;
  amountRaised: number;
  photos: Photo[];
  createdAt: string;
  updatedAt: string;
}

export type SectionInput = Omit<Section, "_id" | "createdAt" | "updatedAt">;
export type FundraiserInput = Omit<
  Fundraiser,
  "_id" | "createdAt" | "updatedAt"
>;
