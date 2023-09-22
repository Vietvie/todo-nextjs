const convertUserToSelectOption = (
    user: { id: number | string; name: string }[]
) => {
    return user.map((el) => ({
        value: el.id,
        label: el.name,
    }));
};

export default convertUserToSelectOption;
