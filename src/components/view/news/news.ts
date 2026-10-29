import './news.css';
import { Article } from '../../../types';
import { getTemplate, requireElement } from '../../../utils/dom';

const MAX_NEWS_COUNT = 10;
const PLACEHOLDER_IMAGE = 'img/news_placeholder.svg';

class News {
    public draw(data: readonly Article[]): void {
        const news = data.slice(0, MAX_NEWS_COUNT);

        const fragment = document.createDocumentFragment();
        const newsItemTemp = requireElement<HTMLTemplateElement>('#newsItemTemp');

        news.forEach((item, idx) => {
            const newsClone = getTemplate(newsItemTemp);

            if (idx % 2) requireElement('.news__item', newsClone).classList.add('alt');

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

        const container = requireElement('.news');
        container.innerHTML = '';
        container.appendChild(fragment);
    }
}

export default News;
