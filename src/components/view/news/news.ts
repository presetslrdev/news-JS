import './news.css';
import { Article } from '../../../types';
import { getTemplate, requireElement } from '../../../utils/dom';

const MAX_NEWS_COUNT = 10;
const PLACEHOLDER_IMAGE = 'img/news_placeholder.svg';

class News {
    private currentIndex: number = 0;

    public draw(data: readonly Article[]): void {
        const news = data.slice(0, MAX_NEWS_COUNT);

        const fragment = document.createDocumentFragment();
        const newsItemTemp = requireElement<HTMLTemplateElement>('#newsItemTemp');

        news.forEach((item) => {
            const newsClone = getTemplate(newsItemTemp);

            requireElement('.news__meta-photo', newsClone).style.backgroundImage = `url(${
                item.urlToImage || PLACEHOLDER_IMAGE
            })`;
            requireElement('.news__meta-author', newsClone).textContent = item.author || item.source.name;
            requireElement('.news__meta-date', newsClone).textContent = item.publishedAt
                .slice(0, 10)
                .split('-')
                .reverse()
                .join('-');

            requireElement('.news__description-title', newsClone).textContent = item.title;
            requireElement('.news__description-source', newsClone).textContent = item.source.name;
            requireElement('.news__description-content', newsClone).textContent = item.description;
            requireElement('.news__read-more a', newsClone).setAttribute('href', item.url);

            fragment.append(newsClone);
        });

        const wrapper = requireElement('.news__carousel-track');
        wrapper.innerHTML = '';
        wrapper.appendChild(fragment);

        this.currentIndex = 0;
        this.updateDots(news.length);
        this.scrollTo(0);
    }

    private scrollTo(index: number): void {
        const track = requireElement('.news__carousel-track');
        const items = track.querySelectorAll<HTMLElement>('.news__item');
        if (!items.length) return;

        this.currentIndex = Math.max(0, Math.min(index, items.length - 1));
        items[this.currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        this.updateDots(items.length);
    }

    private updateDots(total: number): void {
        const dotsContainer = document.querySelector('.news__dots');
        if (!dotsContainer) return;

        dotsContainer.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.className = 'news__dot' + (i === this.currentIndex ? ' news__dot--active' : '');
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dot.addEventListener('click', () => this.scrollTo(i));
            dotsContainer.appendChild(dot);
        }
    }

    public initControls(): void {
        const prevBtn = document.querySelector<HTMLButtonElement>('.news__btn--prev');
        const nextBtn = document.querySelector<HTMLButtonElement>('.news__btn--next');

        prevBtn?.addEventListener('click', () => this.scrollTo(this.currentIndex - 1));
        nextBtn?.addEventListener('click', () => this.scrollTo(this.currentIndex + 1));

        // Обновляем currentIndex при прокрутке (scroll snap)
        const track = requireElement('.news__carousel-track');
        track.addEventListener(
            'scroll',
            () => {
                const items = track.querySelectorAll<HTMLElement>('.news__item');
                const scrollLeft = track.scrollLeft;
                const itemWidth = items[0]?.offsetWidth ?? 0;
                if (itemWidth > 0) {
                    this.currentIndex = Math.round(scrollLeft / itemWidth);
                    this.updateDots(items.length);
                }
            },
            { passive: true }
        );
    }
}

export default News;
