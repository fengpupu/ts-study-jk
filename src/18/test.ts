/*
 * @Description:
 * @Author: fengpu 1126120965@qq.com
 * @Date: 2025-05-22 10:23:44
 * @LastEditors: fengpu 1126120965@qq.com
 * @LastEditTime: 2025-05-23 11:36:54
 * @FilePath: \ts-study-jk\src\18\test.ts
 * Endless Story. - NANA
 */
// T 是 任意类型
type T1 = any["a"]; // any
type T2 = never["a"]; //never

type T3 = void["a"]; // 报错 keyof void => never 只有never
type T4 = void[never]; // void是一个特殊的类型
type T51 = "a"["toString"]; //() => string 变成其包装类

enum T5 {
  a,
  b,
  c = "122",
}
type T6 = keyof T5; // "toString" | "valueOf"
type T7 = keyof typeof T5; //  "a" | "b" | "c"

type T8 = T5["a"]; // 报错
type T9 = T5[T5.a]; // 报错

type T10 = (typeof T5)["a"]; //T5.a

interface O1 {
  a: number;
  b: string;
}
type O2 = {
  [...O1]: number;
  c: string;
};

type Name = { name: string };
type Age = { age: number };
type NameOrAge =Name & Age; 