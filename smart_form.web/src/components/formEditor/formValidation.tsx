import { validateForm } from "@/services/formValidatorService"
import useFormEditorStore from "@/store/formEditor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const FormValidation = () => {
    const { title, sortableItems, rules } = useFormEditorStore((state) => ({
        title: state.title,
        sortableItems: state.sortableItems,
        rules: state.rules,
    }))

    const {mutate, data, error, isPending, isSuccess} = useMutation({
        mutationFn: validateForm,
        onError: (error) => {
            console.error('Error adding formValidation:', error);
        },
    });

    const handleValidation = async () => {
        mutate({
            formData: {
                title,
                fields: sortableItems.map(({ question, response }) => ({ question, response }))
            },
            rules
        })
    };

    return (
        <>
            <button 
                className="px-4 py-2 bg-[#282828] text-white rounded-md mt-3 hover:bg-[#353535] transition-colors duration-300"
                onClick={handleValidation}
            >
                Validate form 
            </button>
            {isPending && <p>Validating...</p>}
            {isSuccess && <p>Form is {(data as any).isValid ? "valid" : "invalid"}</p>}
            {error && <p>Error validating form</p>}
        </>
    )
}

export default FormValidation