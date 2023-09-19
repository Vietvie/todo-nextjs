class TodoState {
    id: number;
    name: string;
    createTime: number;
    deadlineTime: number;
    status: string;
    createBy: string;
    processBy: string;
    constructor(
        name: string,
        deadlineTime: number,
        status: string,
        createBy: string,
        processBy: string
    ) {
        this.id = Date.now();
        this.name = name;
        this.createTime = Date.now();
        this.deadlineTime = deadlineTime;
        this.status = status || 'pending';
        this.createBy = createBy;
        this.processBy = processBy;
    }
}

export default TodoState;
