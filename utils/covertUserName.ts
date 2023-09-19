const convertUserName = (name: string) => {
    let userName: string = '';
    switch (name) {
        case 'dao':
            userName = 'Đạo';
            break;
        case 'viet':
            userName = 'Việt';
            break;
        case 'thinh':
            userName = 'Thịnh';
            break;
        case 'dong':
            userName = 'Đông';
            break;
        default:
            break;
    }
    return userName;
};

export default convertUserName;
