import {
    faBackward,
    faChevronLeft,
    faForward,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, MouseEvent } from 'react';
import { PageInfo } from './page';

interface Paginantion {
    page: number;
    limit: number;
    total: number;
    onChange: React.Dispatch<React.SetStateAction<PageInfo>>;
}

const Paginantion: FC<Paginantion> = ({ page, total, limit, onChange }) => {
    const handleChangePage = (e: MouseEvent<HTMLButtonElement>) => {
        const name: string = e.currentTarget.name;
        if (name === 'left') {
            if (page === 1) return;
            onChange((prev) => ({ ...prev, pageNum: page - 1 }));
        }
        if (name === 'right') {
            if (page === Math.ceil(total / limit)) return;
            onChange((prev) => ({ ...prev, pageNum: page + 1 }));
        }

        if (name === 'start') {
            if (page === 1) return;
            onChange((prev) => ({ ...prev, pageNum: 1 }));
        }

        if (name === 'end') {
            if (page === Math.ceil(total / limit)) return;
            onChange((prev) => ({
                ...prev,
                pageNum: Math.ceil(total / limit),
            }));
        }
    };

    const hadleChangeLimit = (limit: number) => {
        onChange((prev) => ({ ...prev, limit: limit, pageNum: 1 }));
    };

    return (
        <div className="px-8 py-4 w-full flex justify-end">
            <div className="flex items-center gap-4">
                <button
                    onClick={handleChangePage}
                    disabled={page === 1}
                    name="start"
                    className="hover:bg-green-600 hover:text-white w-8 aspect-square rounded-full disabled:text-gray-300"
                >
                    <FontAwesomeIcon
                        className="pointer-events-none"
                        icon={faBackward}
                    />
                </button>
                <button
                    disabled={page === 1}
                    onClick={handleChangePage}
                    name="left"
                    className="hover:bg-green-600 hover:text-white w-8 aspect-square rounded-full disabled:text-gray-300"
                >
                    <FontAwesomeIcon
                        className="pointer-events-none"
                        icon={faChevronLeft}
                    />
                </button>
                <button
                    disabled={Math.ceil(total / limit) === page}
                    onClick={handleChangePage}
                    name="right"
                    className="hover:bg-green-600 hover:text-white w-8 aspect-square rounded-full disabled:text-gray-300"
                >
                    <FontAwesomeIcon
                        className="rotate-180 pointer-events-none"
                        icon={faChevronLeft}
                    />
                </button>
                <button
                    disabled={Math.ceil(total / limit) === page}
                    onClick={handleChangePage}
                    name="end"
                    className="hover:bg-green-600 hover:text-white w-8 aspect-square rounded-full disabled:text-gray-300"
                >
                    <FontAwesomeIcon
                        className="pointer-events-none"
                        icon={faForward}
                    />
                </button>
                <span>{`${page}/${Math.ceil(total / limit)}`}</span>
                <select
                    onChange={(e) =>
                        hadleChangeLimit(parseInt(e.currentTarget.value))
                    }
                    className="bg-transparent"
                >
                    <option value="2">2/page</option>
                    <option value="1">1/page</option>
                    <option value="3">3/page</option>
                    <option value="4">4/page</option>
                </select>
            </div>
        </div>
    );
};

export default Paginantion;
