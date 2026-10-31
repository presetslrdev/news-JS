import AppLoader from './appLoader';
import { Callback, Endpoint, ErrorCallback, NewsResponse, SourcesResponse } from '../../types';

class AppController extends AppLoader {
    public getSources(callback: Callback<SourcesResponse>, onError?: ErrorCallback): void {
        super.getResp<SourcesResponse>({ endpoint: Endpoint.Sources }, callback, onError);
    }

    public getNewsBySourceId(sourceId: string, callback: Callback<NewsResponse>, onError?: ErrorCallback): void {
        super.getResp<NewsResponse>(
            {
                endpoint: Endpoint.Everything,
                options: { sources: sourceId },
            },
            callback,
            onError
        );
    }
}

export default AppController;
