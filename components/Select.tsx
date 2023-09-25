import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { MouseEvent, useState } from 'react';

export type SelectOption = {
    value: string | number;
    label: string;
};
type MultipleSelectProps = {
    multiple: true;
    value: SelectOption[];
    onSelect: (select: SelectOption[], id?: number) => void;
};

type SingleSelectProps = {
    multiple?: false;
    value: SelectOption | null;
    onSelect: (select: SelectOption | null, id?: number) => void;
};

type SelectProps = {
    onRemove?: (select: SelectOption, id: number) => void;
    isClearable?: boolean | false;
    titleStyle?: string;
    id?: number;
    options: SelectOption[];
    placehodler?: string | undefined;
    zIndex?: number;
} & (SingleSelectProps | MultipleSelectProps);

const Select: React.FC<SelectProps> = ({
    options,
    placehodler,
    value,
    onSelect,
    id,
    titleStyle,
    isClearable,
    multiple,
    onRemove,
    zIndex,
}) => {
    const [openSelect, setOpenSelect] = useState<boolean>(false);
    const handleOpen = () => {
        setOpenSelect((prev) => !prev);
    };
    const handleBlur = () => {
        setOpenSelect(false);
    };

    const handleSelect = (select: SelectOption, id?: number) => {
        if (multiple) {
            if (value.map((el) => el.value).includes(select.value)) {
                handleRemoveMultipleSelect(select, id);
            } else {
                onSelect([...value, select], id);
            }
        } else {
            onSelect(select, id);
        }
        setOpenSelect(false);
    };

    const handleRemoveMultipleSelect = async (
        select: SelectOption,
        id?: number
    ) => {
        if (multiple) {
            if (onRemove && id) {
                return onRemove(select, id);
            }
            onSelect(
                value.filter((el) => el.value !== select.value),
                id
            );
        }
    };

    const handleRemoveSelect = (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        multiple ? onSelect([]) : onSelect(null);
    };

    return (
        <div
            onClick={handleOpen}
            onBlur={handleBlur}
            className="h-full whitespace-nowrap relative flex justify-between px-2 items-center cursor-defaul "
            tabIndex={1}
        >
            <div
                className={`rounded-lg py-[2px] px-1 flex flex-wrap gap-1 ${titleStyle}`}
            >
                {multiple &&
                    value.map((el, index) => (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveMultipleSelect(el, id);
                            }}
                            className="p-1 text-sm bg-gray-200 rounded-lg hover:bg-green-600 hover:text-white"
                            key={index}
                        >
                            {el.label}
                        </button>
                    ))}
                {!multiple && value && <span>{value.label}</span>}
                {((multiple && value.length === 0) || !value) &&
                    (placehodler || 'select...')}
            </div>
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
                className={`absolute ${
                    zIndex ? `z-50` : 'z-10'
                } top-full mt-1 w-full bg-white ${!openSelect && 'hidden'}`}
            >
                {options.map((el, index) => (
                    <li
                        onClick={(e) => {
                            handleSelect(el, id);
                        }}
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
