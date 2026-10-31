import Loader from './loader';

const DEFAULT_API_URL = 'https://rss-news-api.onrender.com/mocks/';

class AppLoader extends Loader {
    constructor() {
        super(process.env.API_URL || DEFAULT_API_URL, {
            apiKey: process.env.API_KEY || '',
        });
    }
}

export default AppLoader;
