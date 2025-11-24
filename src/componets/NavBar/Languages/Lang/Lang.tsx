import React from "react";

type Props = {
    flag?: string;
    description?: string;
    active?: boolean;
    onClick?: () => void;
};

const Lang: React.FC<Props> = ({ flag, description, active = false, onClick }) => {
    const borderClass = active ? "border-primary" : "border-secondary";
    const accentClass = active ? "bg-primary-subtle" : "bg-body";

    return (
        <>
            <button
                type="button"
                onClick={onClick}
                className="w-100 bg-transparent border-0 p-0 text-start"
            >
                <div className={`border border-1 ${borderClass} ${accentClass} p-1 mt-1 rounded-md shadow-sm text-center`}>
                    <img src={`https://flagsapi.com/${flag}/flat/64.png`} alt={description}/>
                    <p className="mb-0">{description}</p>
                </div>
            </button>
        </>
    );
};

export default Lang;