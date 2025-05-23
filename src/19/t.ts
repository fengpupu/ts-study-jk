/*
 * @Description:
 * @Author: fengpu 1126120965@qq.com
 * @Date: 2024-10-23 13:17:34
 * @LastEditors: fengpu 1126120965@qq.com
 * @LastEditTime: 2025-05-21 15:15:18
 * @FilePath: \ts-study-jk\src\19\t.ts
 * Endless Story. - NANA
 */
/* 第17讲
type X = T1 & T2; // 交叉
type T4 = X['c']; // 求值X

type U = T1 | T2; // 联合
type T81 = U['c'|'b']; // 1、检查 ('c' | 'b') in (keyof U)
type T82 = (U | {a: boolean})['a']; // 2、T1['a'] | T2 ['a'] | .. | Tn ['a']
*/

/* 第18讲
// 一般用法
type T3 = T1['a']; // 单类型, subtype of string|number|symbol

type X = T1 & T2; // 交叉
type T7 = T1[X]; // （先求值T）求值X
type T8 = T1['a'|'c']; // 联合  
type T81 = T1['a'] | T1['c'];
*/
interface T {
  a: string;
  c: number;
}

type U = keyof T; // 结果是string|number|...

// keyof anything
type T1 = keyof never;
type T2 = keyof any;
type T3 = keyof void; // 单类型：void, unknown, undefined, null
type T4 = keyof "a"; // 单类型：包装类('a', string, String, 1, ...)
type T5 = keyof T; // 单类型：接口类型(interfaces, lists, object, function, class, ...)
type T51 = keyof {}; // never, and `interface Empty { }`
type T52 = keyof object; // never
type T53 = keyof (() => void); // never
type T54 = keyof (new () => void); // never, and `class Empty { }`
class MyClass {
  a: 100;
  static b: number;
  constructor() {
    this.a = 100;
  }
}
type T555 = keyof MyClass; // 'a'
type T55 = keyof typeof MyClass; //  "b" | "prototype"

let v = { a: 1, b: "abc" };
type T6 = keyof typeof v; // 表达式类型：非联合，总是求值
type U1 =
  | {
      // 表达式类型：联合（ex: T1 | T2  |.. | Tn）
      a: string;
      b: string;
    }
  | {
      a: string;
      c: number;
    };
type T7 = keyof U1; // ex: keyof T1 & keyof T2 ... & keyof Tn

// 索引存取运算中的枚举类型（T[...]）
// - 1、检查 ... in (keyof T)
// - 2、T1['a'] | T2 ['a'] | .. | Tn ['a']
// 其它3：T[K]中，T是枚举类型
enum T101 {
  a,
  b,
  c,
  d = "abc",
} // Enum
enum T102 {
  d = "abc",
} // Enum
// enum T10 {a = 0, b = 1, c = 2, d='abc'};   // Enum
type T11 = keyof T101;
type T111 = keyof T102;

type T12 = T101["toString"];
type T121 = String["toString"] | Number["toString"];

enum EE {}
type T123123 = keyof EE;
type T1231231 = keyof Number;

/*
enum T10 {
  a,
  b,
  c,
  d = "abc",
} // Enum
keyof T10 =
  keyof (T10.a | T10.b | T10.c | T10.d)
  (keyof T10.a) & (keyof T10.b) & (keyof T10.c) & (keyof T10.d)
  (keyof 0) & (keyof 1) & (keyof 2) & (keyof 'abc')
  (keyof Number) & (keyof Number) & (keyof Number) & (keyof String)
  (keyof Number) & (keyof String)

  // (keyof Number) <=> // enum EE { } 空的枚举

  枚举 keyof三种结果 keyof Number (keyof Number) & (keyof String) (keyof String)
*/
type X1 = Exclude<keyof Number, never>; // 数字枚举(keyof Number)
type X2 = Exclude<keyof String, never>; // 字符串枚举(keyof String)
type T122 = keyof Number & keyof String;
// 常量枚举
const enum Direction {
  Up = "UP",
  Down = "DOWN",
}
type lalal = keyof Direction; // 数字枚举(keyof Number)
type lalal2 = keyof typeof Direction; // 数字枚举(keyof Number)

// 带索引签名的接口类型
// 元组、数组 都有缺省签名 {[k: number]: XXX}
type T13 = [string, number, 1]; // {[k: number]: string | number}
type T131 = Exclude<keyof T13, never>;
type T14 = object[]; // {[k: number]: object}
type T141 = Exclude<keyof T14, never>;

type T15 = {
  [k: string]: any; //实际上 包含了number这种索引签名 在类型计算中 但是在兼容性赋值中 不知道如何规定的
  a: 1;
  b: "string";
};
type T151 = Exclude<keyof T15, never>; //string | number
type T152 = Pick<T15, keyof T15>;
// {
//   [x: string]: any;
//   [x: number]: any;
// };
type T153 = Omit<T15, never>;
// {
//   [x: string]: any;
//   [x: number]: any;
// };

type A = { a: number; b: 1 };
type B = { a: number; c: 1 };
type C = keyof A; //接口或者说结构类型 是惰性求值
type TC = Exclude<C, never>; // "a" | "b"

type D = keyof (A | B); // 表达式类型 是立即求值
