import './sources.css';
import { Source } from '../../../types';
import { getTemplate, requireElement } from '../../../utils/dom';

class Sources {
    public draw(data: readonly Source[]): void {
        const fragment = document.createDocumentFragment();
        const sourceItemTemp = requireElement<HTMLTemplateElement>('#sourceItemTemp');

        data.forEach((item) => {
            const sourceClone = getTemplate(sourceItemTemp);

            requireElement('.source__item-name', sourceClone).textContent = item.name;
            requireElement('.source__item', sourceClone).setAttribute('data-source-id', item.id);

            fragment.append(sourceClone);
        });

        requireElement('.sources').append(fragment);
    }
}

export default Sources;
