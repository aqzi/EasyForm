import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
// import FormDisplay from '@/components/FormDisplay';
import useFormEditorStore from '@/store/formEditor';

export default function RespondPage() {
    const [title, setTitle] = useState("")
    const [form, setForm] = useState(null);

    const searchParams = useSearchParams();
    const formId = searchParams.get('formId');

    const { creatorModeIsActive, setCreatorModeIsActive } = useFormEditorStore((state) => ({
        creatorModeIsActive: state.creatorModeIsActive,
        setCreatorModeIsActive: state.setCreatorModeIsActive,
    }))

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
                    // setSortableItems(data.fields)
                } catch (error) {
                    console.error('Error fetching form:', error);
                }
            }
        };

        fetchForm();
    }, [formId]);

    if (!form) return <div>Loading...</div>;

    // return <FormDisplay form={form} />;
    return <div>{title}</div>
}
