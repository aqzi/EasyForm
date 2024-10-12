import TextResponse from './text/response';
import YesOrNoResponse from './yesOrNo/response';
import MultipleChoiceResponse from './multipleChoice/response';
import { sortableItem, formActivity } from '../protocol';

export const responseRender = ({ responseItem, formActivity }: { 
    responseItem: sortableItem,
    formActivity: formActivity
}) => {
    switch (responseItem.responseType) {
        case 'text':
            return (
                <TextResponse
                    responseItem={responseItem}
                    formActivity={formActivity}
                />
            );
        case 'yesOrNo':
            return (
                <YesOrNoResponse
                    responseItem={responseItem}
                    formActivity={formActivity}
                />
            );
        case 'multipleChoice':
            return (
                <MultipleChoiceResponse
                    responseItem={responseItem}
                    formActivity={formActivity}
                />
            );
        default:
            return null;
    }
};