import React, { useRef, useEffect } from 'react';
import { FormResponseActionProps } from './FormResponseActionProps';

const TextResponse: React.FC<FormResponseActionProps> = ({ question, response, onResponseChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [response]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onResponseChange(e.target.value);
  };

  return (
    <div className="text-response relative w-full text-white text-sm">
      <textarea
        ref={textareaRef}
        value={response}
        onChange={handleChange}
        className="w-full min-h-[1.5em] py-2 pr-2 resize-none overflow-hidden focus:outline-none bg-transparent"
        style={{ width: '100%' }}
        rows={1}
        placeholder='Type / for commands.'
      />
    </div>
  );
};

export default TextResponse;