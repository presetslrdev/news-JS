import AppController from '../controller/controller';
import { AppView } from '../view/appView';
import { requireElement } from '../../utils/dom';

class App {
    private readonly controller: AppController;
    private readonly view: AppView;
    private requestedSourceId: string = '';

    constructor() {
        this.controller = new AppController();
        this.view = new AppView();
    }

    public start(): void {
        this.renderDate();
        this.controller.getSources(
            (data) => {
                this.view.drawSources(data, (sourceId, sourceName) => this.loadNews(sourceId, sourceName));
            },
            (message) => this.view.showSourcesError(message)
        );
    }

    private renderDate(): void {
        const dateEl = requireElement<HTMLTimeElement>('#currentDate');
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        dateEl.textContent = now.toLocaleDateString('en-US', options);
        dateEl.dateTime = now.toISOString().slice(0, 10);
    }

    private loadNews(sourceId: string, sourceName: string = ''): void {
        this.requestedSourceId = sourceId;
        const currentTitle = requireElement('#newsCurrentSource');
        if (sourceName) {
            currentTitle.textContent = sourceName;
        }
        this.view.showNewsStatus('loading');
        this.controller.getNewsBySourceId(
            sourceId,
            (news) => {
                if (sourceId === this.requestedSourceId) {
                    this.view.drawNews(news, sourceName);
                }
            },
            (message) => {
                if (sourceId === this.requestedSourceId) {
                    this.view.showNewsStatus(
                        'error',
                        `${message}. Please reselect the newsroom or verify your connection.`
                    );
                }
            }
        );
    }
}

export default App;
