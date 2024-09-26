import useFormEditorStore from "@/store/formEditor"

export const RulesEditor = () => {
    const { rules, setRules } = useFormEditorStore((state) => ({
        rules: state.rules,
        setRules: state.setRules,
    }))

    return (
        <div className="mt-14">
            <textarea
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                className="w-full h-96 bg-transparent text-gray-200 focus:outline-none 
                    resize-none overflow-hidden border border-gray-500 rounded p-4 text-xl
                "
                placeholder={"Enter your set of requirements here..."}
            />
        </div>
    )
}