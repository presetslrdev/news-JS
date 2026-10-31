import AppLoader from './appLoader';
import { Callback, Endpoint, NewsResponse, SourcesResponse } from '../../types';

class AppController extends AppLoader {
    private lastSourceId: string = '';

    public getSources(callback: Callback<SourcesResponse>): void {
        super.getResp<SourcesResponse>({ endpoint: Endpoint.Sources }, callback);
    }

    public getNewsBySourceId(sourceId: string, callback: Callback<NewsResponse>): void {
        if (this.lastSourceId === sourceId) return;
        this.lastSourceId = sourceId;
        super.getResp<NewsResponse>(
            {
                endpoint: Endpoint.Everything,
                options: { sources: sourceId },
            },
            callback
        );
    }
}

export default AppController;
