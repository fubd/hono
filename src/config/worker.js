export default async function (_input) {
  let sum = 0;
  for (let i = 0; i < 1e8; i++) sum += i;
  return sum;
}
