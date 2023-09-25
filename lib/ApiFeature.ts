interface QueryStringType {
    id?: number;
    create_time?: number;
    deadline_time?: number;
    sort?: string;
    limit?: number;
    fields?: string;
    page?: number;
    skip?: number;
}

interface QueryPrisma {
    where?: {};
    skip?: number;
    take?: number;
}

type KeyQuery = 'sort' | 'page' | 'limit' | 'fields';
type NumberFiedls = 'id' | 'create_time' | 'deadline_time';
type ConditionQuery = 'contains' | 'gt' | 'gte';

class APIFeature {
    query: QueryPrisma;
    queryString: QueryStringType;
    constructor(queryString: QueryStringType) {
        this.query = {};
        this.queryString = queryString;
    }

    filter() {
        //1A, Filter basic
        let queryObj: { [key: string]: any } = { ...this.queryString };
        const excludeObj = ['sort', 'page', 'limit', 'fields'];
        const filedIsNumber = ['id', 'create_time', 'deadline_time'];

        excludeObj.forEach((element) => {
            if (queryObj[element as KeyQuery])
                delete queryObj[element as KeyQuery];
        });

        Object.keys(queryObj).forEach((el) => {
            if (filedIsNumber.includes(el)) {
                queryObj[el as NumberFiedls] =
                    queryObj[el as NumberFiedls]! * 1;
            }
        });

        //1B, Fitler advance
        const hasCondition = /\[(.*?)\]/;
        Object.keys(queryObj).forEach((el) => {
            const match = el.match(hasCondition);
            if (match) {
                const renameFiled = el.split('[')[0];
                queryObj[renameFiled] = {
                    [match[1]]: filedIsNumber.includes(el.split('[')[0])
                        ? queryObj[el] * 1
                        : queryObj[el],
                };
                delete queryObj[el];
            }
        });

        this.query.where = queryObj;

        return this;
    }

    // sort() {
    //     //2, Sort
    //     if (this.queryString.sort) {
    //         let sortBy = this.queryString.sort.split(',');
    //         sortBy = sortBy.map((el) => {
    //             if (el.startsWith('-')) {
    //                 el = el.replace('-', '');
    //                 return [el, 'desc'];
    //             }
    //             return [el, 'asc'];
    //         });
    //         this.query.order = sortBy;
    //     }
    //     return this;
    // }

    // fields() {
    //     //3,Limit Fields
    //     if (this.queryString.fields) {
    //         const limitFields = this.queryString.fields.split(',');
    //         this.query.attributes = limitFields;
    //     }
    //     return this;
    // }

    //4, pagination
    pagination() {
        const page = this.queryString.page ? this.queryString.page * 1 : 1;
        const limit = this.queryString.limit ? this.queryString.limit * 1 : 100;
        const skip = (page - 1) * limit;
        this.query.skip = skip;
        this.query.take = limit;
        return this;
    }
}

export default APIFeature;
