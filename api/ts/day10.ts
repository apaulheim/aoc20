const input =
  "138;3;108;64;92;112;44;53;27;20;23;77;119;62;121;11;2;37;148;34;83;24;10;79;96;98;127;7;115;19;16;78;133;61;82;91;145;39;33;13;97;55;141;1;134;40;71;54;103;101;26;47;90;72;126;124;110;131;58;12;142;105;63;75;50;95;69;25;68;144;86;132;89;128;135;65;125;76;116;32;18;6;38;109;111;30;70;143;104;102;120;31;41;17";
//const input = "16;10;15;5;1;11;7;19;6;12;4";
//const input =
//  "28;33;18;42;31;14;46;20;48;47;24;23;49;45;19;38;39;11;1;32;25;35;8;17;7;9;4;2;34;10;3";
let adapters = input
  .split(";")
  .map((line: string) => parseInt(line))
  .sort((a: number, b: number) => a - b);

let one = 0;
let three = 0;
let i = 1;
while (i < adapters.length) {
  let val = adapters[i] - adapters[i - 1];
  if (val == 1) one++;
  else if (val == 3) three++;
  i++;
}
three++;
one++;
// console.log(one);
// console.log(three);
// console.log(one * three);

let gold = 0;

const isValidAdapter = (a: number, b: number): boolean => {
  return b - a == 1 || b - a == 2 || b - a == 3;
};

adapters = [0].concat(adapters);
console.log(adapters);

const possibilities = [];

for (let i = 0; i < adapters.length - 1; i++) {
  let poss = 0;
  if (i < adapters.length - 1 && isValidAdapter(adapters[i], adapters[i + 1]))
    poss++;
  if (i < adapters.length - 2 && isValidAdapter(adapters[i], adapters[i + 2]))
    poss++;
  if (i < adapters.length - 3 && isValidAdapter(adapters[i], adapters[i + 3]))
    poss++;
  possibilities.push(poss);
}
possibilities.push(1);

console.log(possibilities);

// for (let poss of possibilities) gold = gold * poss;
// 1 1 3 2 1 1 2 1 1 1 1
//----------------------
// 1 1 3 2 1 1 2 1 1 1 1
// 1 1 3   1 1 2 1 1 1 1
// 1 1 3   1 1 2   1 1 1
// 1 1 3     1 2 1 1 1 1
// 1 1 3     1 2   1 1 1
// 1 1 3 2 1 1 2   1 1 1
// 1 1 3 2   1 2 1 1 1 1
// 1 1 3 2   1 2   1 1 1
//----------------------
//             2 1 1 1 1     1+1
//             2   1 1 1
//       2 1 1 2 1 1 1 1
//       2   1 2 1 1 1 1
// 8 8 8 4 2 2 2 1 1 1 1
//     3   2 2 2 1 1 1 1
//     3     2 2 1 1 1 1
//     3 2 1 1 2 1 1 1 1
//

for (let i = possibilities.length - 2; i >= 0; i--) {
  if (possibilities[i] == 1) {
    possibilities[i] = possibilities[i + 1];
  } else if (possibilities[i] == 2) {
    possibilities[i] =
      possibilities[i + 1] +
      (i + 2 < possibilities.length ? possibilities[i + 2] : 0);
  } else if (possibilities[i] == 3) {
    possibilities[i] =
      possibilities[i + 1] +
      possibilities[i + 2] +
      (i + 3 < possibilities.length ? possibilities[i + 3] : 0);
  }
}
console.log(possibilities);
console.log(possibilities[0]);

// const findNextAdapter = (i: number) => {
//   if (i == 0) gold = possibilities[];
//   if (possibilities[i] == 1) findNextAdapter(i + 1);
//   else if (possibilities[i] == 2) {
//     findNextAdapter(i + 1);
//     findNextAdapter(i + 2);
//   } else if (possibilities[i] == 3) {
//     findNextAdapter(i + 1);
//     findNextAdapter(i + 2);
//     findNextAdapter(i + 3);
//   }
// };
// findNextAdapter(0);

// const findNextAdapter = (currentIndex: number) => {
//   if (currentIndex == adapters.length - 1) gold++;
//   else {
//     if (isValidAdapter(adapters[currentIndex], adapters[currentIndex + 1]))
//       findNextAdapter(currentIndex + 1);
//     if (isValidAdapter(adapters[currentIndex], adapters[currentIndex + 2]))
//       findNextAdapter(currentIndex + 2);
//     if (isValidAdapter(adapters[currentIndex], adapters[currentIndex + 3]))
//       findNextAdapter(currentIndex + 3);
//   }
// };

// findNextAdapter(0);

// too high 5997013881313296000
//          14173478093824
// console.log(gold);
