import useFormEditorStore from "@/store/formEditor"
import { formActivity } from "../protocol"


const EditorHeader = ({formActivity}: {formActivity: formActivity}) => {
    const { title, setTitle } = useFormEditorStore((state) => ({
        title: state.title,
        setTitle: state.setTitle,
    }))

    return (
        <div 
            className="relative mb-12"
        >
            {
                formActivity === 'createOrEdit' ?
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Untitled Form"
                    className="text-5xl font-bold mb-2 text-gray-200 w-full bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-500 hover:bg-gray-800 transition-colors duration-200 ease-in-out px-2 py-1 rounded"
                />
                :
                <p className="text-5xl pb-3 font-bold mb-2 text-gray-200 w-full bg-transparent border-none px-2 py-1 rounded cursor-default">{title}</p>
            }
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-gray-400 to-transparent"/>
        </div>
    )
}

export default EditorHeader