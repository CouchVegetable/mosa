// clamps a number without rounding down
const clampedFloat = (num, min, max) => {
  return num <= min ? min : num >= max ? max : num
}

// constrains a number to a integer min/max range, inclusive
const clampedNum = (num, min, max) => {
  return Math.floor(clampedFloat(num, min, max))
}
