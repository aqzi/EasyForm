'use client'

import React, { useRef, useEffect, useMemo } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableItemRender from '@/components/formEditor/sortableItemRender';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useSearchParams } from 'next/navigation';
import useFormEditorStore from '@/store/formEditor';

export type formActivity = 'createOrEdit' | 'view' | 'reply'

const FormRender = ({formActivity}: {formActivity: formActivity}) => {
    const containerRef = useRef<HTMLDivElement>(null)

    const searchParams = useSearchParams();
    const formId = searchParams.get('formId');

    const { title, sortableItems, setSortableItems, setTitle } = useFormEditorStore((state) => ({
        title: state.title,
        sortableItems: state.sortableItems,
        setSortableItems: state.setSortableItems,
        setTitle: state.setTitle,
    }))

    useEffect(() => {
        const resizeContainer = () => {
            if (containerRef.current) {
                const scale = Math.min(
                    (window.innerWidth - 64) / 595,  // 32px padding on each side
                    (window.innerHeight - 64) / 842  // 32px padding on top and bottom
                )

                containerRef.current.style.transform = `scale(${scale})`
            }
        }

        resizeContainer()
        window.addEventListener('resize', resizeContainer)

        return () => window.removeEventListener('resize', resizeContainer)
    }, [])

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

    return (
        <div
            ref={containerRef}
            className="w-[595px] h-[842px] bg-[#1e1e1e] origin-center relative mt-40"
            style={{ transform: 'scale(1)' }}
        >
            <div className="h-full p-8 flex overflow-auto">
                <div className="flex-grow">
                    <div className="relative mb-8">
                        {
                            formActivity === 'createOrEdit' ?
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Untitled Form"
                                className="text-3xl font-bold mb-2 text-gray-200 w-full bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-500 hover:bg-gray-800 transition-colors duration-200 ease-in-out px-2 py-1 rounded"
                            />
                            :
                            <p className="text-3xl pb-3 font-bold mb-2 text-gray-200 w-full bg-transparent border-none px-2 py-1 rounded cursor-default">{title}</p>
                        }
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-gray-400 to-transparent"></div>
                    </div>
                    {formActivity === 'createOrEdit' ? DragComponent : SortableItemsRender}
                </div>
            </div>
        </div>
    )
}

export default React.memo(FormRender)