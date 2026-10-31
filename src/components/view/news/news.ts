import './news.css';
import { Article } from '../../../types';
import { getTemplate, requireElement } from '../../../utils/dom';

const MAX_NEWS_COUNT = 10;
const PLACEHOLDER_IMAGE = 'img/news_placeholder.svg';

export type NewsStatus = 'idle' | 'loading' | 'error' | 'empty';

const STATUS_TITLES: Readonly<Record<NewsStatus, string>> = {
    idle: 'Pick a news source',
    loading: 'Loading headlines…',
    error: 'Could not load the news',
    empty: 'Nothing to show here yet',
};

function cssUrl(url: string): string {
    return `url("${url.replace(/["\\\n\r]/g, encodeURIComponent)}")`;
}

function formatDate(iso: string): string {
    return iso.slice(0, 10).split('-').reverse().join('.');
}

class News {
    public showStatus(status: NewsStatus, details: string = ''): void {
        const container = requireElement('.news');
        container.setAttribute('aria-busy', String(status === 'loading'));
        container.innerHTML = '';
        container.classList.add('news--status');

        const box = document.createElement('div');
        box.className = `news__status news__status--${status}`;
        box.setAttribute('role', status === 'error' ? 'alert' : 'status');

        const title = document.createElement('p');
        title.className = 'news__status-title';
        title.textContent = STATUS_TITLES[status];
        box.appendChild(title);

        if (details) {
            const text = document.createElement('p');
            text.className = 'news__status-text';
            text.textContent = details;
            box.appendChild(text);
        }

        container.appendChild(box);
    }

    public draw(data: readonly Article[]): void {
        const news = data.slice(0, MAX_NEWS_COUNT);

        if (news.length === 0) {
            this.showStatus('empty', 'This source has no recent articles. Try another one.');
            return;
        }

        const fragment = document.createDocumentFragment();
        const newsItemTemp = requireElement<HTMLTemplateElement>('#newsItemTemp');

        news.forEach((item) => {
            const newsClone = getTemplate(newsItemTemp);

            const photo = requireElement('.news__meta-photo', newsClone);
            photo.style.backgroundImage = cssUrl(PLACEHOLDER_IMAGE);
            if (item.urlToImage) {
                const image = new Image();
                image.referrerPolicy = 'no-referrer';
                image.onload = (): void => {
                    photo.style.backgroundImage = cssUrl(image.src);
                };
                image.src = item.urlToImage;
            }
            requireElement('.news__meta-author', newsClone).textContent = item.author || item.source.name;
            const date = requireElement<HTMLTimeElement>('.news__meta-date', newsClone);
            date.textContent = formatDate(item.publishedAt);
            date.dateTime = item.publishedAt;

            requireElement('.news__description-title', newsClone).textContent = item.title;
            requireElement('.news__description-source', newsClone).textContent = item.source.name;
            requireElement('.news__description-content', newsClone).textContent = item.description;

            const link = requireElement<HTMLAnchorElement>('.news__read-more', newsClone);
            link.href = item.url;
            link.setAttribute('aria-label', `Read more: ${item.title}`);

            fragment.append(newsClone);
        });

        const container = requireElement('.news');
        container.setAttribute('aria-busy', 'false');
        container.classList.remove('news--status');
        container.innerHTML = '';
        container.appendChild(fragment);
    }
}

export default News;
