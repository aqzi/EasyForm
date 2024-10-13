import TextResponse from './text/response';
import YesOrNoResponse from './yesOrNo/response';
import MultipleChoiceResponse from './multipleChoice/response';
import { formField, formActivity } from '../protocol';

export const responseRender = ({ field, formActivity }: { 
    field: formField,
    formActivity: formActivity
}) => {
    switch (field.responseType) {
        case 'text':
            return (
                <TextResponse
                    field={field}
                    formActivity={formActivity}
                />
            );
        case 'yesOrNo':
            return (
                <YesOrNoResponse
                    field={field}
                    formActivity={formActivity}
                />
            );
        case 'multipleChoice':
            return (
                <MultipleChoiceResponse
                    field={field}
                    formActivity={formActivity}
                />
            );
        default:
            return null;
    }
};