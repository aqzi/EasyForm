'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">My Forms</h1>
      {forms.length === 0 ? (
        <p className="text-center text-gray-600">No forms found. Create your first form!</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-blue-100">
          <table className="min-w-full table-auto">
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
  );
};

export default UserForms;
