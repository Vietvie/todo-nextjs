import { id } from 'date-fns/locale';
import React, { useState } from 'react';

const Select: React.FC<{
    id?: number;
    options: { value: string; label: string }[];
    placehodler?: string | undefined;
    onSelect: (select: { value: string; label: string }, id?: number) => void;
    value: { value: string; label: string } | null;
}> = ({ options, placehodler, value, onSelect, id }) => {
    const [openSelect, setOpenSelect] = useState<boolean>(false);
    const handleOpen = () => {
        setOpenSelect((prev) => !prev);
    };
    const handleBlur = () => {
        setOpenSelect(false);
    };

    const handleSelect = (
        select: { value: string; label: string },
        id?: number
    ) => {
        onSelect(select, id);
        setOpenSelect(false);
    };

    return (
        <div
            onClick={handleOpen}
            onBlur={handleBlur}
            className="h-full whitespace-nowrap relative flex items-center cursor-default"
            tabIndex={1}
        >
            <span>{value ? value.label : placehodler || 'select...'}</span>
            <ul
                onClick={(e) => e.stopPropagation()}
                className={`absolute top-full mt-1 w-full bg-white ${
                    !openSelect && 'hidden'
                }`}
            >
                {options.map((el, index) => (
                    <li
                        onClick={() => handleSelect(el, id)}
                        key={index}
                        className="p-1 border-b last:border-none  hover:bg-slate-200"
                    >
                        {el.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Select;
