'use client'

import React, { useState, useRef, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus } from 'lucide-react'
import TextResponse from '@/components/formResponseActions/text'
import YesOrNoResponse from '@/components/formResponseActions/yesOrNo'

interface Question {
  id: string;
  question: string;
  responseType: 'text' | 'multipleChoice' | 'checkbox' | 'image' | 'file' | 'date' | 'yesOrNo';
  options?: string[];
  response: string;
}

const SortableItem = ({ id, question, responseType, onChange, onAddQuestion, number, response, onResponseChange }: { 
  id: string; 
  question: string; 
  responseType: 'text' | 'multipleChoice' | 'checkbox' | 'image' | 'file' | 'date' | 'yesOrNo';
  onChange: (id: string, newQuestion: string, newResponseType: 'text' | 'multipleChoice' | 'checkbox' | 'image' | 'file' | 'date' | 'yesOrNo') => void;
  onAddQuestion: (id: string) => void;
  number: number;
  response: string;
  onResponseChange: (id: string, newResponse: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  
  const renderResponseComponent = () => {
    switch (responseType) {
      case 'text':
        return (
          <TextResponse
            question={question}
            response={response}
            onResponseChange={(newResponse) => onResponseChange(id, newResponse)}
          />
        );
      case 'yesOrNo':
        return (
          <YesOrNoResponse
            question={question}
            response={response}
            onResponseChange={(newResponse) => onResponseChange(id, newResponse)}
          />
        );
      // Add cases for 'multipleChoice' and 'checkbox' if needed
      default:
        return null;
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="group flex flex-col p-4 hover:bg-gray-800 rounded">
      <div className="flex items-center mb-2">
        <div {...attributes} {...listeners} className="opacity-0 group-hover:opacity-100 cursor-move mr-2">
          <GripVertical size={16} className="text-gray-400" />
        </div>
        <span className="text-gray-400 mr-2">{number}.</span>
        <input
          type="text"
          value={question}
          onChange={(e) => onChange(id, e.target.value, responseType)}
          placeholder="Enter your question"
          className="flex-grow bg-transparent text-gray-200 p-1 focus:outline-none"
        />
      </div>
      <div className="ml-8">
        <select
          value={responseType}
          onChange={(e) => onChange(id, question, e.target.value as 'text' | 'multipleChoice' | 'checkbox' | 'image' | 'file' | 'date' | 'yesOrNo')}
          className="bg-gray-700 text-gray-200 p-1 rounded"
        >
          <option value="text">Text</option>
          <option value="yesOrNo">Yes or No</option>
          <option value="multipleChoice">Multiple Choice</option>
          <option value="checkbox">Checkbox</option>
          <option value="image">Image</option>
          <option value="file">File</option>
          <option value="date">Date</option>
        </select>
        {renderResponseComponent()}
      </div>
    </div>
  )
}

const CreateForm: React.FC = () => {
  const [title, setTitle] = useState("")
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', question: '', responseType: 'text', response: '' },
  ])
  const containerRef = useRef<HTMLDivElement>(null)

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
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleQuestionChange = (id: string, newQuestion: string, newResponseType: 'text' | 'multipleChoice' | 'checkbox' | 'image' | 'file' | 'date' | 'yesOrNo') => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, question: newQuestion, responseType: newResponseType } : q
    ))
  }

  const handleResponseChange = (id: string, newResponse: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, response: newResponse } : q
    ))
  }

  const handleAddQuestion = (id: string) => {
    const index = questions.findIndex(q => q.id === id)
    const newQuestion: Question = { id: Date.now().toString(), question: '', responseType: 'text', response: '' }
    setQuestions([...questions.slice(0, index + 1), newQuestion, ...questions.slice(index + 1)])
  }

  return (
    <div className="flex items-center justify-center h-full bg-[#151515] p-4 border border-[#474b5f] shadow-lg overflow-hidden">
      <div 
        ref={containerRef}
        className="w-[595px] h-[842px] bg-[#151515] overflow-hidden origin-center"
        style={{ transform: 'scale(1)' }}
      >
        <div className="h-full p-8 overflow-auto">
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
          >
            <SortableContext 
              items={questions.map(q => q.id)}
              strategy={verticalListSortingStrategy}
            >
              {questions.map((q, index) => (
                <SortableItem 
                  key={q.id} 
                  id={q.id} 
                  question={q.question}
                  responseType={q.responseType}
                  onChange={handleQuestionChange}
                  onAddQuestion={handleAddQuestion}
                  number={index + 1}
                  response={q.response}
                  onResponseChange={handleResponseChange}
                />
              ))}
            </SortableContext>
          </DndContext>
          <button 
            onClick={() => handleAddQuestion(questions[questions.length - 1].id)}
            className="mt-4 flex items-center text-gray-400 hover:text-gray-200 transition-colors duration-200"
            title="Add a question"
          >
            <Plus size={20} className="mr-2" />
            Add a question
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateForm