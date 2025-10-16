export interface ArtworkSummary {
  objectID: number;
  title: string;
  primaryImage: string;
  primaryImageSmall: string;
  artistDisplayName: string;
  objectDate: string;
  department: string;
  objectURL: string;
}

export interface ArtworkDetail extends ArtworkSummary {
  artistDisplayBio: string;
  medium: string;
  culture: string;
  period: string;
  dimensions: string;
  creditLine: string;
  classification: string;
  repository: string;
  tags: Array<{ term: string }> | null;
  additionalImages: string[];
}

export interface SearchResponse {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  objectIDs: number[];
  objects: ArtworkDetail[];
}

export interface Department {
  departmentId: number;
  displayName: string;
}

export interface DepartmentResponse {
  departments: Department[];
}
