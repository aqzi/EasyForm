const Plus = () => {
    return (
        <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                className="transition-all duration-300 ease-in-out stroke-blue-accent stroke-2"
            />
            <path
                d="M50 25v50M25 50h50"
                strokeWidth="4"
                strokeLinecap="round"
                className="transition-all duration-300 ease-in-out stroke-blue-accent"
            />
        </svg>
    )
}

export default Plus