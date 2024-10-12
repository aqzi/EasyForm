import { sortableItem, formActivity } from '../protocol';
import TextConfig from './text/config';
import YesOrNoConfig from './yesOrNo/config';
import MultipleChoiceConfig from './multipleChoice/config';

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
        case 'yesOrNo':
            return (
                <YesOrNoConfig 
                    responseItem={responseItem}
                    formActivity={formActivity}
                />
            );
        case 'multipleChoice':
            return (
                <MultipleChoiceConfig 
                    responseItem={responseItem}
                    formActivity={formActivity}
                />
            )
        default:
            return null;
    }
};