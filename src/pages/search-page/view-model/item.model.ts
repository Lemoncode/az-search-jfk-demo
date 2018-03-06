export interface Item {
  title: string;
  subtitle?: string;
  thumbnail?: string;
  excerpt?: string;
  rating?: number;
  extraFields?: string[];
}

export type ItemCollection = Item[];
