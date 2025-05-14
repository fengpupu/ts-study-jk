// 三种思路的“可辨识联合类型”

enum Transportations {motorcycle, car, truck}

interface T1 {
  type: Transportations.motorcycle;
  make: number;
}

interface T2 {
  type: Transportations.car;
  transmission: string;
  pow: number;
  id: 'T2';
}

interface T3 {
  type: Transportations.truck;
  capacity: number;
}

type Transporter = T1 | T2 | T3;//可辨识联合类型

let x!: Transporter;
if ("id" in x && x.id === "T2") {//通过某个字段，识别类型
  x
}
