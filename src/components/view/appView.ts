import News, { NewsStatus } from './news/news';
import Sources from './sources/sources';
import { Callback, NewsResponse, SourcesResponse } from '../../types';

export class AppView {
    private readonly news: News;
    private readonly sources: Sources;

    constructor() {
        this.news = new News();
        this.sources = new Sources();
        this.news.showStatus('idle', 'Choose a portal from the list above to see its latest headlines.');
    }

    public drawNews(data: Partial<NewsResponse>): void {
        this.news.draw(data.articles ?? []);
    }

    public showNewsStatus(status: NewsStatus, details?: string): void {
        this.news.showStatus(status, details);
    }

    public drawSources(data: Partial<SourcesResponse>, onSelect: Callback<string>): void {
        this.sources.setOnSelect(onSelect);
        this.sources.draw(data.sources ?? []);
    }

    public showSourcesError(message: string): void {
        this.sources.showError(message);
    }
}

export default AppView;
