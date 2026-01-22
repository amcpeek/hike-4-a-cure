import { get, post, put, del } from "./client";
import type { Section, SectionInput } from "../types";

export function fetchSections(): Promise<Section[]> {
  return get<Section[]>("/sections");
}

export function createSection(section: SectionInput): Promise<Section> {
  return post<Section>("/sections", section);
}

export function updateSection(
  id: string,
  section: Partial<SectionInput>,
): Promise<Section> {
  return put<Section>(`/sections/${id}`, section);
}

export function deleteSection(id: string): Promise<{ message: string }> {
  return del<{ message: string }>(`/sections/${id}`);
}

export function reorderSections(
  orderedIds: string[],
): Promise<{ message: string }> {
  return put<{ message: string }>("/sections/reorder", { orderedIds });
}
