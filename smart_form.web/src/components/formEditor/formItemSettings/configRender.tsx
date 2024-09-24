import { sortableItem, formActivity } from '../protocol';
import TextConfig from './text/config';

export const configRender = ({ responseItem, formActivity }: { 
    responseItem: sortableItem,
    formActivity: formActivity
}) => {
    switch (responseItem.responseType) {
        case 'text':
            return (
                <TextConfig 
                    responseItem={responseItem}
                    formActivity={formActivity}
                />
            );
        default:
            return null;
    }
};