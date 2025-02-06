declare function me(): Promise<any>;
declare function update(data: object): Promise<any>;
declare const account: {
    me: typeof me;
    update: typeof update;
};
export default account;
