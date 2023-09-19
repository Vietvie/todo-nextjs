import Select from '@/components/Select';
import { Status } from '@/constants';
import statusOptions from '@/dev-data/stauts';
import { AppDispatch, useAppSelector } from '@/store';
import { filterAction } from '@/store/filterSlice';
import convertStatus from '@/utils/convertStatus';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FormEvent } from 'react';
import { useDispatch } from 'react-redux';

const Search = () => {
    const filter = useAppSelector((state) => state.filter);
    const dispatch = useDispatch<AppDispatch>();
    const handleSetTask = (e: FormEvent<HTMLInputElement>) => {
        dispatch(filterAction.changeTask(e.currentTarget.value));
    };

    const handleSetStatus = (value: Status | '') => {
        dispatch(filterAction.filterStatus(value));
    };

    return (
        <div className="flex bg-white shadow-lg rounded-lg relative">
            <input
                type="text"
                value={filter.task}
                onChange={handleSetTask}
                className="p-2 w-full rounded-lg pl-8"
            />
            <div className="w-40 border-l">
                <Select
                    isClearable={true}
                    options={statusOptions}
                    onSelect={(value) =>
                        handleSetStatus((value?.value as Status | '') || '')
                    }
                    value={
                        filter.status
                            ? {
                                  label: convertStatus(filter.status).label,
                                  value: filter.status,
                              }
                            : null
                    }
                    placehodler="Trạng thái.."
                />
            </div>
            <span className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-gray-400">
                <FontAwesomeIcon icon={faSearch} />
            </span>
        </div>
    );
};

export default Search;
