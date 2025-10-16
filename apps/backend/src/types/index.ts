export interface MetSearchResponse {
  total: number;
  objectIDs: number[] | null;
}

export interface MetObject {
  objectID: number;
  title: string;
  primaryImage: string;
  primaryImageSmall: string;
  artistDisplayName: string;
  artistDisplayBio: string;
  objectDate: string;
  medium: string;
  department: string;
  culture: string;
  period: string;
  objectURL: string;
  dimensions: string;
  creditLine: string;
  classification: string;
  repository: string;
  tags: Array<{ term: string }> | null;
  additionalImages: string[];
  [key: string]: unknown;
}

export interface SearchResult {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  objectIDs: number[];
  objects: MetObject[];
}

export interface SearchParams {
  query: string;
  page: number;
  perPage: number;
  hasImages: boolean;
  departmentId?: number;
  artistOrCulture?: boolean;
}

export interface MetDepartment {
  departmentId: number;
  displayName: string;
}

export interface MetDepartmentResponse {
  departments: MetDepartment[];
}
