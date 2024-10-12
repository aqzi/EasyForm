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
                stroke="#8f9bd4"
                strokeWidth="2"
                className="transition-all duration-300 ease-in-out group-hover:stroke-[#8f9bd4]"
            />
            <path
                d="M50 25v50M25 50h50"
                stroke="#8f9bd4"
                strokeWidth="4"
                strokeLinecap="round"
                className="transition-all duration-300 ease-in-out group-hover:stroke-[#8f9bd4]"
            />
            <circle
                cx="50"
                cy="50"
                r="0"
                fill="#8f9bd4"
                className="transition-all duration-300 ease-in-out group-hover:r-[45]"
            />
        </svg>
    )
}

export default Plus