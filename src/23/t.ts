// BAD CASE
type SingleUnion = any | never | unknown | void | null | undefined | 1 | 'a' | string | true | false | boolean;
// 1、首先，联合类型计算返回结果无顺序 联合、枚举和元组都有列表语义
//  - 1.1 枚举以联合类型的形式参与运算，也是无序的
//  - 1.2 元组类型参与运算时，返回的结果是有顺序的
// 2、有any、never 会合并
type U1 = SingleUnion extends 'a' ? true : false;
type U2 = {
    [key in SingleUnion]: SingleUnion extends SingleUnion[key] ? true : false;
}

// Tuple based
type Singles = [any, never, unknown, void, null, undefined, 1, 'a', string, true, false, boolean];
type X = Omit<Singles, never>;

type T = {
    [k in keyof Singles as (  // Singles is Tuple 筛选
        k extends symbol //判断symbol
            ? never
            : k extends infer X extends string // 查看infer为string的键（number与string都会被infer为string）
                ? `${X}` extends `${number}` // 拿出number类型的键
                    ? k
                    : never
                : never
    )]: Singles[k] extends 'a' ? true : false
};

type T1 = {
    [k in keyof Singles as (
        k extends string
            ? `${k}` extends `${number}`  // k extends `${number}`
                ? k
                : never
            : never
    )]: Singles[k] extends 'a' ? true : false
};

type T2 = {
    [k in keyof Singles as (
        k extends string & `${number}`
            ? k
            : never
    )]: Singles[k] extends 'a' ? true : false
};

type T3 = {
    [k in keyof Singles as Extract<k, `${number}`>]: // `${number|'length'}`
        Singles[k] extends 'a' ? true : false
};

type T4 = {
    [k in keyof Singles]: k extends `${number}`
        ? Singles[k] extends 'a' ? true : false
        : Singles[k]
};


// -------------- 我是分隔线 --------------
// 元组可以被映射的，但元组只有在全量映射的时候，才会返回一个新的元组
// 全量映射的条件：元组以裸类型参数的形式参与运算，并且，映射的时候，使用keyof来操作裸类型参数
// type T6<T> = {//T4的参数化
//     [k in keyof T]: k extends `${number}`
//         ? T[k] extends 'a' ? true : false
//         : T[k]
// }
type T6<T> = {//T4的参数化
    [k in keyof T]:T[k] extends 'a' ? true : false
    // In the above example, MapToPromise takes a type T,
    //  and when that type is a tuple like Coordinate, only the numeric properties are converted.
}
type T61 = T6<[...Singles]>;

//-------------------------------------------不是参数
type T611 = {
    [k in keyof Singles]: Singles[k] extends 'a' ? true : false //并不是以参数传入
}
//-------------------------------------------不是裸类型

type T6111<T> = {//T4的参数化
    [k in keyof T as any]:T[k] extends 'a' ? true : false
    // In the above example, MapToPromise takes a type T,
    //  and when that type is a tuple like Coordinate, only the numeric properties are converted.
}
type T6222 = T6111<Singles>; //待检查的T 也就是extends后面的T 经过修饰 不是裸参数 不会返回一个元组


// 在泛型工具的出口，映射类型会做一些后续处理，例如将结果修正为元组或数组。参见如下
//  @see release-notes/typescript-3-1.html#mapped-types-on-tuples-and-arrays
//  @see https://devsuhas.com/2018/11/18/typescript-3-1/
// 必须是1、是用keyof来操作的裸类型参数；2、是完全映射（即使是`... as k`也是不行的）[k in keyof T] 不做转换和筛选
type MapT<T> = {
    [k in keyof T]: T[k]
}/*  */
type T7 = MapT<Singles>;
type T71 = MapT<T4>;

type MapTX<Source, T> = {
    [k in keyof Source]: k extends keyof T ? T[k] : Source[k]
}
type T72 = MapTX<Singles, T2>; // ObjectToTuple<>

type MapMartix<Source> = {
    [k in keyof Source]: k extends `${number}`
        ? MapTX<Source, {
            [i in Extract<keyof Source, `${number}`>]:
                Source[k] extends Source[i] ? true : false
          }>
        : Source[k]
}
type T8 = MapMartix<Singles>;
 