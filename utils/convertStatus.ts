const convertStatus = (status: string | number) => {
    let statusConverted: { label: string; style: string } = {
        label: 'Đang xử lý',
        style: 'bg-orange-100 text-orange-600',
    };
    switch (status) {
        case 'pending':
            statusConverted = {
                label: 'Đang xử lý',
                style: 'bg-orange-100 text-orange-600',
            };
            break;
        case 'completed':
            statusConverted = {
                label: 'Đã hoàn thành',
                style: ' !text-green-600 bg-green-100',
            };
            break;
        case 'cancelled':
            statusConverted = {
                label: 'Đã huỷ',
                style: 'text-gray-600 bg-gray-200',
            };
            break;

        default:
            break;
    }

    return statusConverted;
};

export default convertStatus;
