// keyof T ,T 可以是任意值

// 求值为never
type Ty1 = keyof void; //never
type Ty2 = keyof unknown; //never
type Ty3 = keyof null; //never
type Ty4 = keyof undefined; //never

// 空对象
type Ty11 = keyof {}; //never
type Ty21 = keyof object; //never
type Ty31 = keyof (() => void); //never
type Ty41 = keyof (new () => void); //never

// 求值为string | number | symbol
type Ty5 = keyof any; //string | number | symbol
type Ty6 = keyof never; //string | number | symbol

// 原始类型
type Ty7 = keyof "a"; // 单类型：包装类('a', string, String, ...)
/**
 * number | "toString" | typeof Symbol.iterator | "valueOf" | "charAt" | "charCodeAt" | "concat" | "indexOf" | "lastIndexOf" | "localeCompare" | "match" | "replace" | "search" | ... 37 more ... | "at"
 */