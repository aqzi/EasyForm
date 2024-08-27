'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import FormOptionsDropdown from '@/components/layout/dropdown';

interface Form {
  id: string;
  name: string;
  createdAt: string;
  responses: number;
}

interface FormSelection {
  createdAt: string;
  form: Form;
}

const UserForms: React.FC = () => {
  const [forms, setForms] = useState<FormSelection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch('/api/form');
        if (!response.ok) {
          throw new Error('Failed to fetch forms');
        }
        const data = await response.json();
        setForms(data);
      } catch (err) {
        setError('Error fetching forms. Please try again later.');
        console.error('Error fetching forms:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForms();
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="mx-auto h-full bg-[#151515] p-4 border border-[#474b5f] shadow-lg relative">
      <div className="absolute top-6 right-6">
        <FormOptionsDropdown options={['createForm', 'statistics']} onSave={() => {}} />
      </div>
      <div className='max-w-3xl mx-auto mt-8'> {/* Added mx-auto here */}
          <div className="relative mb-12">
              <h1
                  className="text-4xl font-bold mb-2 text-gray-200 w-full bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-500 hover:bg-gray-800 transition-colors duration-200 ease-in-out px-2 py-4 rounded"
              >
                  My Forms
              </h1>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-gray-400 to-transparent"></div>
          </div>
          {forms.length === 0 ? (
              <p className="text-center text-gray-600">No forms found. Create your first form!</p>
          ) : (
              <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-blue-100">
              <table className="w-full table-auto"> {/* Changed min-w-full to w-full */}
                  <thead className="bg-blue-50">
                  <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Responses</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Actions</th>
                  </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-blue-100">
                  {forms.map((form) => (
                      <tr key={form.form.id} className="hover:bg-blue-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-900">{form.form.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-blue-600">{new Date(form.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-blue-600">{form.form.responses ?? 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/forms/${form.form.id}`} className="text-blue-600 hover:text-blue-800 mr-4 transition-colors duration-200">
                          Edit
                          </Link>
                          <Link href={`/forms/${form.form.id}/responses`} className="text-green-600 hover:text-green-800 transition-colors duration-200">
                          View Responses
                          </Link>
                      </td>
                      </tr>
                  ))}
                  </tbody>
              </table>
              </div>
          )}
      </div>
    </div>
  );
};

export default UserForms;
