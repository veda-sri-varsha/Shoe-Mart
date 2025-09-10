import { ApiResponse } from "../shared";

export type Collection = {
  id: string;         
  name: string;
  isActive: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
};

export type createCollectionPayload = {
  name: string;
};

export type createCollectionResponse = ApiResponse<{ collection: Collection }>;

export type updateCollectionPayload = {
  id: string;
  name: string;
};

export type updateCollectionResponse = ApiResponse<{ collection: Collection }>;

export type deleteCollectionPayload = {
  id: string;
};

export type deleteCollectionResponse = ApiResponse<{ collection: Collection }>;

export type getAllCollectionsResponse = ApiResponse<{
  collections: Collection[];
  count: number;
}>;

export type getCollectionPayload = {
  id: string;
};

export type getCollectionResponse = ApiResponse<{ collection: Collection }>;

export type toggleCollectionStatusPayload = {
  id: string;
  isActive: boolean;
};

export type toggleCollectionStatusResponse = ApiResponse<{ collection: Collection }>;

