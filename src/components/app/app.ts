import AppController from '../controller/controller';
import { AppView } from '../view/appView';

class App {
    private readonly controller: AppController;
    private readonly view: AppView;
    private requestedSourceId: string = '';

    constructor() {
        this.controller = new AppController();
        this.view = new AppView();
    }

    public start(): void {
        this.controller.getSources(
            (data) => this.view.drawSources(data, (sourceId) => this.loadNews(sourceId)),
            (message) => this.view.showSourcesError(message)
        );
    }

    private loadNews(sourceId: string): void {
        this.requestedSourceId = sourceId;
        this.view.showNewsStatus('loading');
        this.controller.getNewsBySourceId(
            sourceId,
            (news) => {
                if (sourceId === this.requestedSourceId) this.view.drawNews(news);
            },
            (message) => {
                if (sourceId === this.requestedSourceId) {
                    this.view.showNewsStatus('error', `${message}. Pick the source again to retry.`);
                }
            }
        );
    }
}

export default App;
