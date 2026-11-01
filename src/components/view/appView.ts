import News, { NewsStatus } from './news/news';
import Sources from './sources/sources';
import { NewsResponse, SourcesResponse } from '../../types';

export class AppView {
    private readonly news: News;
    private readonly sources: Sources;

    constructor() {
        this.news = new News();
        this.sources = new Sources();
        this.news.showStatus('idle', 'Select a newsroom from the controls above to read today’s dispatches.');
    }

    public drawNews(data: Partial<NewsResponse>, sourceName?: string): void {
        const titleEl = document.querySelector<HTMLElement>('#newsCurrentSource');
        if (titleEl && sourceName) {
            titleEl.textContent = sourceName;
        }
        this.news.draw(data.articles ?? []);
    }

    public showNewsStatus(status: NewsStatus, details?: string): void {
        this.news.showStatus(status, details);
    }

    public drawSources(data: Partial<SourcesResponse>, onSelect: (sourceId: string, sourceName: string) => void): void {
        this.sources.setOnSelect(onSelect);
        this.sources.draw(data.sources ?? []);
    }

    public showSourcesError(message: string): void {
        this.sources.showError(message);
    }
}

export default AppView;
