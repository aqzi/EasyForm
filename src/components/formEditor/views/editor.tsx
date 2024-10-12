import React, { useMemo } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableItemRender from '@/components/formEditor/sortableItemRender';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import useFormEditorStore from '@/store/formEditor';
import { formActivity } from '../protocol';

const Editor = ({formActivity}: {formActivity: formActivity}) => {
    const { sortableItems, setSortableItems } = useFormEditorStore((state) => ({
        title: state.title,
        sortableItems: state.sortableItems,
        setSortableItems: state.setSortableItems,
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
            const oldIndex = sortableItems.findIndex((s) => s.id === active.id)
            const newIndex = sortableItems.findIndex((s) => s.id === over.id)

            setSortableItems(arrayMove(sortableItems, oldIndex, newIndex))
        }
    }

    const SortableItemsRender = useMemo(() => {
        return sortableItems.map((s, index) => (
            <div id={`question-${s.id}`} key={s.id}>
                <SortableItemRender 
                    item={s}
                    seqNumber={index + 1}
                    formActivity={formActivity}
                />
            </div>
        ))
    }, [sortableItems])
    
    const DragComponent = useMemo(() => {
        return (
            <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
            >
                <SortableContext 
                    items={sortableItems.map(s => s.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {SortableItemsRender}
                </SortableContext>
            </DndContext>
        )
    }, [sensors, handleDragEnd, sortableItems, SortableItemsRender])

    if (formActivity === 'createOrEdit') {
        return DragComponent
    } else {
        return SortableItemsRender
    }
}

export default React.memo(Editor)