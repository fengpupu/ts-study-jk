// 基本语法与惯例
// --------------------------------------
// 1
type TNT = never; //单个成员的联合
type TNT2 = "a" | never;

// 2
type TTT<T> = T extends T ? T : never; // 这里tue分支的T，是分量的T，不是原始的T

// 3
type TRT<T, R = T> = T extends R ? Exclude<R, T> : never;
type aaaa = TRT<"a" | "b" | "c" | never>;

// 4
type TUT<U> = [U] extends [any] ? true : false; //这里的U不是裸类型参数，因为在L的位置，U做了修饰
type TUT2<U> = [U] extends [never] ? true : false; // 避免never在分布式条件中，直接返回never

// 与其它表达式的关系与应用（1）
// --------------------------------------

// keyof T
//      ===> keyof T1 & .. & keyof Tn
interface Bird {
  weight: number;
  leg: number;
  wings: number;
}

interface Horse {
  [x: string]: any; //添加索引签名，会导致不符合预期
  [x: symbol]: any; //添加索引签名，会导致不符合预期

  weight: number;
  leg: number;
  id: string;
}

type U = Bird | Horse; // Animal
type X = Bird & Horse; // BirdAndHorse
type T1 = keyof U; // "weight" | "leg"
type T2 = keyof X; // "weight" | "leg" | "wings" | "id"
// BUT, when X equal never ????!

// U extends ...
type AllKeys<T> = T extends T ? keyof T : never;
type T11 = AllKeys<U>; //分解成两个成员，取得所有的key
type T21 = AllKeys<X>; //

// remove index signatrues
//  - 映射是处理一个结果集合中存在“可能被联合合并掉的成员”的唯一有效方法
type NoSign<T> = {
  [k in keyof T as string | symbol | number extends k ? never : k]: T[k]; // 这里需要分布式联合，但却并没有作为祼类型参数（所以不能用）
};
type T22 = NoSign<Horse>; //没有去掉string

type AllKeys2<T, X = PropertyKey> = T extends T // 这里的T是裸类型参数,分解成员
  ? keyof {
      [k in keyof T as (X extends k ? k : never) extends never
        ? k
        : never]: T[k];
    }
  : never;

type AllKeys21<T, X = PropertyKey> = T extends T // 这里的T是裸类型参数,分解成员
  ?  {
      [k in keyof T as (X extends k ? k : never)]: 1;
    }
  : never;

type AllKeys3<T, X = PropertyKey> = AllKeys<
  T extends T
    ? {
        [k in keyof T as (X extends k ? k : never) extends never
          ? k
          : never]: T[k];
      }
    : never
>;

type T3 = AllKeys<any>;
type T4 = AllKeys2<any, number>; // string | number

type T411 = AllKeys21<any, number>; // never any 的 破坏性
type Test1 = AllKeys21<{ a: 1; 2: 2 }, number>; // never（符合预期）
type Test2 = AllKeys21<{ [k: number]: string }, number>; // number（符合预期）

type T41 = AllKeys3<U>;
type T22aaa = AllKeys3<Horse, string | number | symbol>; //去掉string
type T22bbb = AllKeys2<Horse, string | number | symbol>; //去掉string

// 与其它表达式的关系与应用（2）
// --------------------------------------

// T[k]
//      ===> T[k1] | .. | T[kn]
//      ===> T1[k] | .. | Tn[k], k in keyof T
type AllValues<T, K = keyof T> = T extends object
  ? K extends keyof T
    ? T[K]
    : never
  : never;

type AllValues2<T, K = AllKeys2<T>> = T extends object
  ? K extends keyof T
    ? T[K]
    : never
  : never;

type T5 = AllValues2<X>;
type T51 = AllKeys2<X>;

// `_${T}_`
//      ===> `_${T1}_` | .. | `_${Tn}_`
type U6 = "a" | "b";
type T6 = `_${U6}_`;
type PatX<U> = U extends string ? `_${U}_` : never;
// type PatX1<U> = `_${U extends string ? U : never}_`;
// type PatX2<U extends string> = `_${U}_`;
type T61 = PatX<U6>;

// Naked，不管L的位置，是怎么样的复杂计算，只要计算结果是裸类型，那么就会被认为是裸类型参数参与运算
type PatX3<U extends string> = `${U}` extends "a" ? `--${U}--` : "nonono"; // `${U}`是特例，不是裸类型参数
type T63 = PatX3<U6>; //’nonono‘

type PatX4<U> = U extends "a" ? [U] : "no"; // （与上例相似的语义）
type T64 = PatX4<U6>; // ["a"] | "no"

type Trans<T> = T;
type Trans2<T> = T[][number]; //计算结果是T
type Trans3<T> = boolean extends true ? never : Trans<T>; // 计算结果还是T
type PatX5<U> = Trans3<U> extends "a" | "b" ? [U] : "no";
type T65 = PatX5<U6 | "c">;

type Trans6<T> = T extends T ? T : never; // 这里的结果，是T所有分量的联合，不等同于T，所以不是裸类型
type PatX6<U> = Trans6<U> extends string ? [U] : never;
type T66 = PatX6<U6 | "c">; //不是一个联合类型

// [...T]
//      ===> [...T1] | .. | [...Tn]
//      ===> [...T1, ...T2, .., ...Tn]   << 这绝对是一个史诗级别的大难题！
// NOTE: 从联合中取出/列举出成员：从多重签名中推断，并使用递归来生成元组（Union To Tuple）
type U7 = ["a"] | ["b"]; // U6 = 'a' | 'b';
type T7a = ["c", ...U7];
type T71qq<U> = U extends any[] ? ["c", ...U] : never;
type T72 = T71qq<U7>;

// { [k in U as 0]: k }
//      ===> { 0: U1| .. |Un }
type X8 = {
  [k in U6 as 0]: k; // NOTE: 这里将会出现{ 0: U1| .. |Un }
};

type X81 = {
  0: "a";
  //  0: "b";
  //  ...
};
