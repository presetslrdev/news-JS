export enum Endpoint {
    Sources = 'sources',
    Everything = 'everything',
}

export enum HttpMethod {
    Get = 'GET',
    Post = 'POST',
}

export enum HttpStatus {
    Unauthorized = 401,
    NotFound = 404,
}

export type NewsCategory =
    | 'all'
    | 'business'
    | 'entertainment'
    | 'general'
    | 'health'
    | 'science'
    | 'sports'
    | 'technology';

export interface Source {
    id: string;
    name: string;
    description: string;
    url: string;
    category: string;
    language: string;
    country: string;
}

export interface Article {
    source: Pick<Source, 'id' | 'name'>;
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
}

interface ApiResponse {
    status: string;
}

export interface SourcesResponse extends ApiResponse {
    sources: Source[];
}

export interface NewsResponse extends ApiResponse {
    totalResults: number;
    articles: Article[];
}

export type Callback<T> = (data: T) => void;

export type QueryOptions = Partial<Record<'apiKey' | 'sources' | 'category' | 'q', string>>;

export type ApiOptions = Readonly<Pick<QueryOptions, 'apiKey'>>;

export interface RequestParams {
    endpoint: Endpoint;
    options?: QueryOptions;
}

export type ErrorCallback = (message: string) => void;
