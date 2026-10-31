import News from './news/news';
import Sources from './sources/sources';
import { Callback, NewsResponse, SourcesResponse } from '../../types';

export class AppView {
    private readonly news: News;
    private readonly sources: Sources;

    constructor() {
        this.news = new News();
        this.sources = new Sources();
    }

    public drawNews(data: Partial<NewsResponse>): void {
        this.news.draw(data.articles ?? []);
    }

    public drawSources(data: Partial<SourcesResponse>, onSelect: Callback<string>): void {
        this.sources.setOnSelect(onSelect);
        this.sources.draw(data.sources ?? []);
    }
}

export default AppView;
