import { sortableItem } from '@/store/formEditor';
import { formActivity } from './formRender';
import TextConfig from './formConfigs/text';

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