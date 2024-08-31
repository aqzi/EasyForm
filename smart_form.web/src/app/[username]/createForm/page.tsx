'use client'

import React, { useState, useRef, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import Plus from '@/components/customSvg/plus';
import Save from '@/components/customSvg/save';
import Skeleton from '@/components/layout/skeleton';
import SortableItemRender from '@/components/createForm/sortableItemRender';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useSearchParams } from 'next/navigation';
import useFormEditorStore from '@/store/formEditor';

const CreateForm: React.FC = () => {
    const [title, setTitle] = useState("")
    const containerRef = useRef<HTMLDivElement>(null)

    const searchParams = useSearchParams();
    const formId = searchParams.get('formId');

    const { creatorModeIsActive, setCreatorModeIsActive, sortableItems, setSortableItems, addSortableItem } = useFormEditorStore((state) => ({
        creatorModeIsActive: state.creatorModeIsActive,
        setCreatorModeIsActive: state.setCreatorModeIsActive,
        sortableItems: state.sortableItems,
        setSortableItems: state.setSortableItems,
        addSortableItem: state.addSortableItem,
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

    useEffect(() => {
        const fetchForm = async () => {
          if (formId) {
            setCreatorModeIsActive(false);

            try {
                const response = await fetch(`/api/form?id=${formId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch form');
                }
                const data = await response.json();
                
                setTitle(data.title)
                setSortableItems(data.fields)
            } catch (error) {
                console.error('Error fetching form:', error);
            }
          }
        };

        fetchForm();
      }, [formId]);

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

    const handleAddQuestion = () => {
        if (creatorModeIsActive) {
            addSortableItem({ id: Date.now().toString(), question: '', responseType: 'text', response: '' })
        }
    }

    const handleSave = async () => {
        try {
            const formData = {
                title,
                fields: sortableItems.map((s, index) => ({
                    question: s.question,
                    responseType: s.responseType,
                    response: s.response,
                    placeholder: s.placeholder,
                    config: s.config,
                    sequenceNumber: index + 1
                }))
            };

            const response = await fetch('/api/form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to save form');
            }

            const result = await response.json();
            console.log('Form saved successfully:', result);
        } catch (error) {
            console.error('Error saving form:', error);
        }
    };

    return (
        <Skeleton options={['myForms', 'statistics', 'settings']}>
            <div
                ref={containerRef}
                className="w-[595px] h-[842px] bg-[#151515] origin-center relative mt-40"
                style={{ transform: 'scale(1)' }}
            >
                <div className="h-full p-8 flex overflow-auto">
                    <div className="flex-grow">
                        <div className="relative mb-8">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Untitled Form"
                                className="text-3xl font-bold mb-2 text-gray-200 w-full bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-500 hover:bg-gray-800 transition-colors duration-200 ease-in-out px-2 py-1 rounded"
                            />
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-gray-400 to-transparent"></div>
                        </div>
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
                                {sortableItems.map((s, index) => (
                                    <div id={`question-${s.id}`} key={s.id}>
                                        <SortableItemRender 
                                            // id={s.id} 
                                            // question={s.question}
                                            // responseType={s.responseType}
                                            // number={index + 1}
                                            // response={s.response}
                                            item={s}
                                            seqNumber={index + 1}
                                        />
                                    </div>
                                ))}
                            </SortableContext>
                        </DndContext>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-8 right-8 flex space-x-4">
                <button
                    onClick={handleSave}
                    className="group relative w-16 h-16 bg-transparent border-none focus:outline-none"
                    aria-label="Save form"
                >
                    <Save/>
                    <span className="absolute inset-0 flex items-center justify-center text-transparent group-hover:text-white transition-all duration-300 ease-in-out">
                        Save
                    </span>
                </button>

                {creatorModeIsActive && (
                    <button
                        onClick={handleAddQuestion}
                        className="group relative w-16 h-16 bg-transparent border-none focus:outline-none"
                        aria-label="Add new form"
                    >
                        <Plus/>
                        <span className="absolute inset-0 flex items-center justify-center text-transparent group-hover:text-white transition-all duration-300 ease-in-out">
                            New
                        </span>
                    </button>
                )}
            </div>
        </Skeleton>
    )
}

export default CreateForm