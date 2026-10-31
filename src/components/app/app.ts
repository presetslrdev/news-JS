import AppController from '../controller/controller';
import { AppView } from '../view/appView';

class App {
    private readonly controller: AppController;
    private readonly view: AppView;

    constructor() {
        this.controller = new AppController();
        this.view = new AppView();
    }

    public start(): void {
        this.controller.getSources((data) =>
            this.view.drawSources(data, (sourceId) =>
                this.controller.getNewsBySourceId(sourceId, (news) => this.view.drawNews(news))
            )
        );
    }
}

export default App;
