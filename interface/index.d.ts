export interface TodoCustomForFE {
    id: number;
    status: string;
    name: string;
    createTime: number;
    deadlineTime: number;
    processBy: { id: number; name: string }[];
    createBy: string;
}
