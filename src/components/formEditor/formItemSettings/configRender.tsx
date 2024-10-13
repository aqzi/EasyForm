import { formActivity, formField } from '../protocol';
import TextConfig from './text/config';
import YesOrNoConfig from './yesOrNo/config';
import MultipleChoiceConfig from './multipleChoice/config';

export const configRender = ({ field, formActivity }: { 
    field: formField,
    formActivity: formActivity
}) => {
    switch (field.responseType) {
        case 'text':
            return (
                <TextConfig 
                    field={field}
                    formActivity={formActivity}
                />
            );
        case 'yesOrNo':
            return (
                <YesOrNoConfig 
                    field={field}
                    formActivity={formActivity}
                />
            );
        case 'multipleChoice':
            return (
                <MultipleChoiceConfig 
                    field={field}
                    formActivity={formActivity}
                />
            )
        default:
            return null;
    }
};