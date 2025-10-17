type VerifiedCallback = (error: any, user?: any, info?: any) => void;
interface LocalVerifyFn {
    (email: string, password: string, done: VerifiedCallback): Promise<void>;
}
export declare const verify: LocalVerifyFn;
export {};
//# sourceMappingURL=localStrategy.d.ts.map