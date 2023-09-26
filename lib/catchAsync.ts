import { NextRequest, NextResponse } from 'next/server';

const catchAsync = (fn: (req: NextRequest) => Promise<NextResponse<any>>) => {
    return (req: NextRequest) => {
        fn(req).catch((error) => {
            console.log(error);
            return NextResponse.json({
                status: 'fail',
                error,
            });
        });
    };
};

export default catchAsync;
