import './news.css';
import { Article } from '../../../types';
import { getTemplate, requireElement } from '../../../utils/dom';

const MAX_NEWS_COUNT = 12;
const PLACEHOLDER_IMAGE = 'img/news_placeholder.svg';

export type NewsStatus = 'idle' | 'loading' | 'error' | 'empty';

const STATUS_TITLES: Readonly<Record<NewsStatus, string>> = {
    idle: 'Select a newsroom to begin',
    loading: 'Dispatching correspondents…',
    error: 'Unable to retrieve live feed',
    empty: 'No articles currently reported',
};

function cssUrl(url: string): string {
    return `url("${url.replace(/["\\\n\r]/g, encodeURIComponent)}")`;
}

function formatDate(iso: string): string {
    try {
        const date = new Date(iso);
        if (isNaN(date.getTime())) return iso.slice(0, 10);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    } catch {
        return iso.slice(0, 10);
    }
}

function calculateReadingTime(text: string): string {
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 50));
    return `${minutes} min read`;
}

class News {
    public showStatus(status: NewsStatus, details: string = ''): void {
        const container = requireElement('.news');
        container.setAttribute('aria-busy', String(status === 'loading'));
        container.innerHTML = '';

        if (status === 'loading') {
            container.classList.remove('news--status');
            container.appendChild(this.createSkeletons(6));
            return;
        }

        container.classList.add('news--status');

        const box = document.createElement('div');
        box.className = `news__status news__status--${status}`;
        box.setAttribute('role', status === 'error' ? 'alert' : 'status');

        const icon = document.createElement('div');
        icon.className = 'news__status-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.innerHTML =
            status === 'error'
                ? '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
                : '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>';
        box.appendChild(icon);

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

        const countLabel = requireElement('#newsArticlesCount');
        countLabel.textContent = `${news.length} headlines`;

        if (news.length === 0) {
            this.showStatus('empty', 'This newsroom currently has no dispatches available. Please choose another one.');
            return;
        }

        const fragment = document.createDocumentFragment();
        const newsItemTemp = requireElement<HTMLTemplateElement>('#newsItemTemp');

        news.forEach((item, index) => {
            const newsClone = getTemplate(newsItemTemp);
            const articleEl = newsClone.querySelector<HTMLElement>('.news__item');

            if (articleEl && index === 0) {
                articleEl.classList.add('news__item--lead');
            }

            const photo = requireElement('.news__meta-photo', newsClone);
            photo.style.backgroundImage = cssUrl(PLACEHOLDER_IMAGE);

            if (item.urlToImage) {
                const image = new Image();
                image.referrerPolicy = 'no-referrer';
                image.onload = (): void => {
                    photo.style.backgroundImage = cssUrl(image.src);
                };
                image.onerror = (): void => {
                    photo.style.backgroundImage = cssUrl(PLACEHOLDER_IMAGE);
                };
                image.src = item.urlToImage;
            }

            const badge = requireElement('.news__meta-badge', newsClone);
            badge.textContent = index === 0 ? 'Lead Story' : item.source.name;

            const readingTimeEl = requireElement('.news__reading-time', newsClone);
            const fullContent = `${item.title} ${item.description || ''} ${item.content || ''}`;
            readingTimeEl.textContent = calculateReadingTime(fullContent);

            requireElement('.news__description-source', newsClone).textContent = item.source.name;
            requireElement('.news__description-title', newsClone).textContent = item.title;
            requireElement('.news__description-content', newsClone).textContent =
                item.description || 'No summary provided.';

            const authorEl = requireElement('.news__meta-author', newsClone);
            authorEl.textContent = item.author ? `By ${item.author}` : item.source.name;

            const date = requireElement<HTMLTimeElement>('.news__meta-date', newsClone);
            date.textContent = formatDate(item.publishedAt);
            date.dateTime = item.publishedAt;

            const link = requireElement<HTMLAnchorElement>('.news__read-more', newsClone);
            link.href = item.url;
            link.setAttribute('aria-label', `Read full article: ${item.title}`);

            fragment.append(newsClone);
        });

        const container = requireElement('.news');
        container.setAttribute('aria-busy', 'false');
        container.classList.remove('news--status');
        container.innerHTML = '';
        container.appendChild(fragment);
    }

    private createSkeletons(count: number): DocumentFragment {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < count; i++) {
            const card = document.createElement('div');
            card.className = 'news__skeleton-card';
            if (i === 0) card.classList.add('news__skeleton-card--lead');
            card.innerHTML = `
                <div class="news__skeleton-photo"></div>
                <div class="news__skeleton-body">
                    <div class="news__skeleton-tag"></div>
                    <div class="news__skeleton-title"></div>
                    <div class="news__skeleton-title news__skeleton-title--short"></div>
                    <div class="news__skeleton-text"></div>
                    <div class="news__skeleton-footer"></div>
                </div>
            `;
            fragment.appendChild(card);
        }
        return fragment;
    }
}

export default News;
