const Save = () => {
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
                strokeWidth="2"
                className="transition-all duration-300 ease-in-out stroke-green-accent"
            />
            <path
                d="M30 50l15 15l25 -25"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300 ease-in-out stroke-green-accent"
            />
        </svg>
    )
}

export default Save