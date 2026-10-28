import { ApiOptions, Callback, Endpoint, HttpMethod, HttpStatus, QueryOptions, RequestParams } from '../../types';

class Loader {
    private readonly baseLink: string;
    private readonly options: ApiOptions;

    constructor(baseLink: string, options: ApiOptions) {
        this.baseLink = baseLink;
        this.options = options;
    }

    protected getResp<T>(
        { endpoint, options = {} }: RequestParams,
        callback: Callback<T> = (): void => {
            console.error('No callback for GET response');
        }
    ): void {
        this.load<T>(HttpMethod.Get, endpoint, callback, options);
    }

    private errorHandler(res: Response): Response {
        if (!res.ok) {
            if (res.status === HttpStatus.Unauthorized || res.status === HttpStatus.NotFound)
                console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            throw Error(res.statusText);
        }

        return res;
    }

    private makeUrl(options: QueryOptions, endpoint: Endpoint): string {
        const urlOptions: QueryOptions = { ...this.options, ...options };
        const query = new URLSearchParams();

        (Object.keys(urlOptions) as Array<keyof QueryOptions>).forEach((key) => {
            const value = urlOptions[key];
            if (value !== undefined) query.append(key, value);
        });

        return `${this.baseLink}${endpoint}?${query.toString()}`;
    }

    private load<T>(method: HttpMethod, endpoint: Endpoint, callback: Callback<T>, options: QueryOptions = {}): void {
        fetch(this.makeUrl(options, endpoint), { method })
            .then((res) => this.errorHandler(res))
            .then((res) => res.json() as Promise<T>)
            .then((data) => callback(data))
            .catch((err: unknown) => console.error(err));
    }
}

export default Loader;
