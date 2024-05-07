import { atom } from "jotai";

export const authTokenAtom = atom(null);
export const authStateAtom = atom(false);
export const authenticatedUserAtom = atom({});
