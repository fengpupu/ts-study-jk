/* 前置知识
1、keyof只返回 string|number|symbol|never 以及它们的子类型的联合。
2、'a' 能赋值给 string，但反过来string不能赋值给'a'；etc. 
3、A extends B ? X ：Y的简单语义。
*/
type T = {
  [k: string]: string | number;
  readonly a: string;
  b: number;
  c: 1;
  2: 12;
};

// 一般使用
type T1 = {
  [k in keyof T]: T[k]; // readonly or optional ..
  // -readonly [k in keyof T]: T[k]; // readonly or optional ..
  //这里是减掉readonly修饰字的意思
};

// 自定义的联合
// type U = Exclude<keyof T, 'b'>; // or any union type
type U = "c" | "b"; // or any union type
type T2 = {
  [k in U]: any; // or any types
};

// 断言语法
type T3 = {
  [k in U as string]: any; // k as string
};
// 等于T31
type T312 = {
  [k in U as 1]: any; // k as string
};
// type T312 = {
//   1: any;
// }

type T31 = {
  [k in string]: any;
};

type T32 = {
  [k: string]: any;
};

// 联合成员的过滤1：extends
type keys = keyof T;
type U1 = "a" | "b";

type T4 = {
  //type T4 = {} 合并成string
  [k in keys as k extends U1 ? k : never]: T[k]; // make a accepted list
};
type T41 = {
  //   type T41 = {
  //     readonly a: string;
  //     b: number;
  // }
  [k in keyof T as k extends U1 ? k : never]: T[k]; // make a accepted list
};
/*
// 当声明string类型的签名时，number是隐式声明的
type T5 = Omit<T, never>;
type T6 = Exclude<keyof T, never>

// 数组或元组是带索引签名的，并且keyof中的数字索引是转换成字符串key的
type T7 = Exclude<keyof [string, number, boolean], never>;
*/

// 联合成员的过滤2：keyof T 在in的右侧时，求值但不合并
type T9 = {
  [k in keyof T as k extends "c" | "a" ? k : never]: T[k]; // keyof T 在in的右侧时，求值但不合并 //never 表示被废弃掉的
};

type keys91 = keyof T;
type T91 = {
  [k in keys91 as k extends "c" | "a" ? k : never]: T[k]; // keyof T 在in的右侧时，求值但不合并 //never 表示被废弃掉的
};

// 非联合成员：模板字符串字面类型
type P = `a${string}b`;
type T10 = {
  [k in P]: any;
};

type XO = {
  c: 12;
};
type X1 = {
  a: 121;
};
type X = "a";
type XX = {
  // type XX = {
  //   b: 121;
  // }
  [m1 in X as "b"]: X1[m1]; //m1 取 “b”，但类型是“a"
  // [x in X as "c"] : XO[x] //报错 x虽然取”c“,但类型并不是"c",所以报错
};

type TT = [1, 2, 3, string, "a", false]; //全量映射又是什么个场景呢？
type XT = {
  [k in keyof TT]: TT[k];
};
// [x: number]: string | false | 1 | 2 | 3;
// 0: 1;
// 1: 2;
// 2: 3;
// 3: string;
// 4: "a";
// 5: false; ...
type MapT<T> = {
  [k in keyof T]: T[k];
};
type XT1 = MapT<TT>; // [1, 2, 3, string, "a", false]

type TO = {
  a: "a";
  b: "b";
};
type TO1 = {
  [k in keyof TO as "a"]: TO[k]; // as 取值的时候不影响，但影响映射的key
};
// type TO1 = {
//   a: "a" | "b";
// };

type TO2 = {
  [k in keyof TO as "other"]: TO[k]; // as 取值的时候不影响，但影响映射的key
};
// type TO2 = {
//   other: "a" | "b";
// };

type DeepPartialWithGetters<T> = {
  [K in keyof T as
     (`get${Capitalize<string & K>}`|`set${Capitalize<string & K>}`)]: T[K] extends object
    ? DeepPartialWithGetters<T[K]>
    : T[K];
};

// 原始类型
interface User {
  id: number;
  profile: {
    name: string;
    age: number;
  };
}

// 应用映射类型
type OptionalUser = DeepPartialWithGetters<User>;