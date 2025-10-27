

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  shareLink: string;
  createdAt: string;
  userId: string;
  _count?: {
    photos: number;
  };
}

export interface Photo {
  id: string;
  url: string;
  displayUrl?: string | null;
  thumbnailUrl?: string | null;
  blurDataUrl?: string | null;
  fileName: string;
  fileSize: number;
  width?: number | null;
  height?: number | null;
  downloadCount: number;
  createdAt: string;
  eventId: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ApiError {
  error: string;
  details?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
