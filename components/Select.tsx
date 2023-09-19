import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { id } from 'date-fns/locale';
import React, { MouseEvent, useState } from 'react';

const Select: React.FC<{
    isClearable?: boolean | false;
    titleStyle?: string;
    id?: number;
    options: { value: string; label: string }[];
    placehodler?: string | undefined;
    onSelect: (
        select: { value: string; label: string } | null,
        id?: number
    ) => void;
    value: { value: string; label: string } | null;
}> = ({
    options,
    placehodler,
    value,
    onSelect,
    id,
    titleStyle,
    isClearable,
}) => {
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

    const handleRemoveSelect = (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        onSelect(null);
    };

    return (
        <div
            onClick={handleOpen}
            onBlur={handleBlur}
            className="h-full whitespace-nowrap relative flex justify-between px-2 items-center cursor-defaul "
            tabIndex={1}
        >
            <span className={`rounded-lg py-[2px] px-1 ${titleStyle}`}>
                {value ? value.label : placehodler || 'select...'}
            </span>
            {isClearable && value && (
                <span onClick={handleRemoveSelect}>
                    <FontAwesomeIcon
                        className="pointer-events-none p-1"
                        icon={faXmark}
                    />
                </span>
            )}
            <ul
                onClick={(e) => e.stopPropagation()}
                className={`absolute z-10 top-full mt-1 w-full bg-white ${
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
