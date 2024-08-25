import React from 'react';
import { FormResponseActionProps } from './FormResponseActionProps';

const YesOrNoResponse: React.FC<FormResponseActionProps> = ({ question, response, onResponseChange }) => {
  return (
    <div className="flex space-x-4 mt-4">
      <button
        onClick={() => onResponseChange('Yes')}
        className={`px-4 rounded-md ${
          response === 'Yes' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
        } transition-colors duration-200`}
      >
        Yes
      </button>
      <button
        onClick={() => onResponseChange('No')}
        className={`px-4 rounded-md ${
          response === 'No' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
        } transition-colors duration-200`}
      >
        No
      </button>
    </div>
  );
};

export default YesOrNoResponse;
