export const getEnumKey = (enumeration: object, key: string) => {
    const keys = Object.keys(enumeration);
    const index = Object.values(enumeration).indexOf(key);
    return keys[index];
};
