import {atom} from "recoil";

export const userState = atom({
    key: 'userState',
    default: undefined,
});

export const customerState = atom({
    key: 'customerState',
    default: undefined,
});

export const riderState = atom({
    key: 'riderState',
    default: undefined,
});