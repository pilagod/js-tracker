function test (count) {
  console.log(count);
  return count < 10
}

let count = 1

do {
  continue
} while (test(count++))
