import { clampedNum } from './clamp'

// constructs tcode strings for channel/value combos (0 <= value <= 0.999)
export const tCode = (channel, value) => {
  if (value < 0) value = 0
  if (value > 999) value = 999
  const scaledValue = Math.floor(value)
  const paddedValue = String(scaledValue).padStart(3, '0')
  return channel + paddedValue
}

// assumes interval in seconds, convert to tcode string
export const intervalTCode = interval => {
  // convert interval to 1-9999 ms
  const millisecondInterval = clampedNum(Math.floor(interval * 1000), 1, 9999)
  const paddedInterval = String(millisecondInterval).padStart(4, '0')
  return 'I' + String(paddedInterval)
}

// return tcode for all supplied axes in destination, with interval if supplied
export const constructTCodeCommand = (destination, interval) => {
  // create tcode for each axis we have
  let commands = {}
  if (typeof interval === 'object') {
    commands = Object.keys(destination).map(
      axis =>
        tCode(axis, destination[axis]) + intervalTCode(interval[axis])
    )
  } else {
    commands = Object.keys(destination).map(
      axis =>
        tCode(axis, destination[axis]) + (interval ? intervalTCode(interval) : '')
    )
  }

  return commands.join(' ')
}

// given axial movement and output range, scales outputs to the range
export const scaleAxes = (axes, outputRange) => {
  const {
    L0Min,
    L0Max,
    L1Min,
    L1Max,
    L2Min,
    L2Max,
    R0Min,
    R0Max,
    R1Min,
    R1Max,
    R2Min,
    R2Max,
    V0Min,
    V0Max,
    V1Min,
    V1Max,
    V2Min,
    V2Max,
    A0Min,
    A0Max,
    Intensity,
  } = outputRange
  return {
    ...(axes.L0 !== undefined && {
      L0: clampedNum((axes.L0 / 1000 - 0.5) * (L0Max - L0Min) * Intensity / 100 + (L0Max - L0Min) / 2, 0, 1000),
    }),
    ...(axes.L1 !== undefined && {
      L1: clampedNum((axes.L1 / 1000 - 0.5) * (L1Max - L1Min) * Intensity / 100 + (L1Max - L1Min) / 2, 0, 1000),
    }),
    ...(axes.L2 !== undefined && {
      L2: clampedNum((axes.L2 / 1000 - 0.5) * (L2Max - L2Min) * Intensity / 100 + (L2Max - L2Min) / 2, 0, 1000),
    }),
    ...(axes.R0 !== undefined && {
      R0: clampedNum((axes.R0 / 1000 - 0.5) * (R0Max - R0Min) * Intensity / 100 + (R0Max - R0Min) / 2, 0, 1000),
    }),
    ...(axes.R1 !== undefined && {
      R1: clampedNum((axes.R1 / 1000 - 0.5) * (R1Max - R1Min) * Intensity / 100 + (R1Max - R1Min) / 2, 0, 1000),
    }),
    ...(axes.R2 !== undefined && {
      R2: clampedNum((axes.R2 / 1000 - 0.5) * (R2Max - R2Min) * Intensity / 100 + (R2Max - R2Min) / 2, 0, 1000),
    }),
    ...(axes.V0 !== undefined && {
      V0: clampedNum((axes.V0 / 1000 - 0.5) * (V0Max - V0Min) * Intensity / 100 + (V0Max - V0Min) / 2, 0, 1000),
    }),
    ...(axes.V1 !== undefined && {
      V1: clampedNum((axes.V1 / 1000 - 0.5) * (V1Max - V1Min) * Intensity / 100 + (V1Max - V1Min) / 2, 0, 1000),
    }),
    ...(axes.V2 !== undefined && {
      V2: clampedNum((axes.V2 / 1000 - 0.5) * (V2Max - V2Min) * Intensity / 100 + (V2Max - V2Min) / 2, 0, 1000),
    }),
    ...(axes.A0 !== undefined && {
      A0: clampedNum((axes.A0 / 1000 - 0.5) * (A0Max - A0Min) * Intensity / 100 + (A0Max - A0Min) / 2, 0, 1000),
    }),
  }
}
