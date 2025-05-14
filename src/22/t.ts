// 条件类型：类型检查
type L = 'abc';
type R = string;
type T = L extends R ? true : false;  // L extends R ? X : Y

// 示例，从映射中去除签名
type T1 = { // jike/20/t.ts
  [k: string]: string | number;
  a: string;
  b: number;
  c: 1;
}

type T2 = {
  [k in keyof T1 as (//去掉了一部分值 keyof T1 因为在in的右边，所以结果不会先合并
    string extends k ? never : k
  )]: T1[k];
}

type T21 = Exclude<keyof T1, string>;// 并不能达到上文结果，这里keyof T1是合并结果

// 两种语义（基础类型，注意交换L/R与交换X/Y是不同的）
type Is<T, target> = T extends target ? 'true' : 'false';// T 可以赋值给 target 即 T是一种Target
type Equal<T, target> = target extends T ? Is<T, target> : 'false'; // WARNING! target能复制给T T又能赋值个Target
type C1 = Is<'abc', string>
type C2 = Equal<string, string>

// 非裸类型参数
type X<T> = T; //这里的T是“裸类型参数”
//以下都不是裸类型参数，都有修饰
type XN1 = `${U}`;
type XN2 = U[];
type XN3 = [U];
type XN4 = X<U>;
type XN5 = Promise<U>;

// 两种特殊的“裸类型参数（naked type parameter）”：联合类型 与 never
// 两个限制条件
//   - 1、作为“泛型参数”传入
//   - 2、以“祼类型参数”的形式参与extends左侧运算
type U = 'a' | 2;
type X1 = Is<U, string>;   // X, Y, X|Y
type X2 = Is<never, string>; // never，直接返回never


// any是特殊的（boolean与enum并不特殊，它们都是按联合来处理的）

type X3 = Is<any, false>;
type X31 = any extends false ? 'true' : 'false';
type X32 = never extends false ? 'true' : 'false';//true never 还是有裸类型参数的 


type X4 = Is<boolean, true>;//裸类型参数 （boolean相当于 true|false的联合） 返回 ‘true'|'false'
type X41 = boolean extends true ? 'true' : 'false';//不是以裸类型参数的形式参与运算 只返回‘false’

enum E {a, b, c}
type X5 = Is<E, 1>;//裸类型参数
type X51 = E extends 1 ? 'true' : 'false';//不是裸类型参数


// 【问题】在类型集合（Collections）中，将基础类型与结构类型分开处理
//  - 表达式类型：联合（包括boolean/enum）
//  - 单类型：数组、元组、string、number、symbol、bigint
//  - 单类型（特殊类型）：any和never
type O1 = { a: 'a' };
class O2 { a: 'a'};
enum O3 {a, b};
function O4() { };
interface O5 { };

type Arr = string[];
type Tuple = [1,2,3];

type B1 = Exclude<
  'a' | 1 | null | 223 | bigint | O1 | O2 | O3 | O5 | Arr | Tuple | typeof O4 | typeof O2,
  object>; //排除所有结构类型
type B2 = Extract<
  'a' | 1 | null | 223 | bigint | O1 | O2 | O3 | O5 | Arr | Tuple | typeof O4 | typeof O2,
  object>;// 抽取所有对象类型


// 作业
type TT =  {
  [k:string | number | symbol] : string | number,
  a:string,
  b:number,
  c:1
}
type Check<T,U> = T extends U ? U : never 
type ReChecked<T,U> = T extends U ? never : U

type signal = {[k1 in keyof TT as (ReChecked<symbol,k1> & ReChecked<number,k1> & ReChecked<string,k1> ) ]:TT[k1]}// 注意这里的逻辑
type sk = Exclude <keyof signal,never>


type keys = {[k in keyof TT as Check<string|symbol|number,k> ]:TT[k]}
type sk2 = Exclude<keyof keys,never>


 
