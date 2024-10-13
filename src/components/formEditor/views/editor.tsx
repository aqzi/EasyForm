import React, { useMemo } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import FormField from '@/components/formEditor/formField';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import useFormEditorStore from '@/store/formEditor';
import { formActivity } from '../protocol';

const Editor = ({formActivity}: {formActivity: formActivity}) => {
    const { formFields, setFormFields } = useFormEditorStore((state) => ({
        title: state.title,
        formFields: state.formFields,
        setFormFields: state.setFormFields,
        setTitle: state.setTitle,
    }))   

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = formFields.findIndex((f) => f.id === active.id)
            const newIndex = formFields.findIndex((f) => f.id === over.id)

            setFormFields(arrayMove(formFields, oldIndex, newIndex))
        }
    }

    const FormFieldRender = useMemo(() => {
        return formFields.map((f, index) => (
            <div id={`question-${f.id}`} key={f.id}>
                <FormField 
                    item={f}
                    seqNumber={index + 1}
                    formActivity={formActivity}
                />
            </div>
        ))
    }, [formFields])
    
    const DragComponent = useMemo(() => {
        return (
            <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
            >
                <SortableContext 
                    items={formFields.map(f => f.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {FormFieldRender}
                </SortableContext>
            </DndContext>
        )
    }, [sensors, handleDragEnd, formFields, FormFieldRender])

    if (formActivity === 'createOrEdit') {
        return DragComponent
    } else {
        return FormFieldRender
    }
}

export default React.memo(Editor)