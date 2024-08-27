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
                stroke="#10b981"
                strokeWidth="2"
                className="transition-all duration-300 ease-in-out group-hover:stroke-[#34d399]"
            />
            <path
                d="M30 50l15 15l25 -25"
                stroke="#10b981"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300 ease-in-out group-hover:stroke-[#34d399]"
            />
            <circle
                cx="50"
                cy="50"
                r="0"
                fill="#10b981"
                className="transition-all duration-300 ease-in-out group-hover:r-[45]"
            />
        </svg>
    )
}

export default Save