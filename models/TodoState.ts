class TodoState {
    id: number;
    name: { value: string; editing: boolean };
    createTime: number;
    deadlineTime: number;
    status: string | number;
    createBy: string;
    processBy: { value: number | string; label: string }[];
    constructor(
        name: { value: string; editing: boolean },
        deadlineTime: number,
        status: string | number,
        createBy: string,
        processBy: { value: number | string; label: string }[]
    ) {
        this.id = Date.now();
        this.name = { value: name.value, editing: name.editing };
        this.createTime = Date.now();
        this.deadlineTime = deadlineTime;
        this.status = status || 'pending';
        this.createBy = createBy;
        this.processBy = processBy;
    }
}

export default TodoState;
