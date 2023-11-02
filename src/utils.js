import loRound from 'lodash/round';

export function toRatio(zoom) {
  return loRound(zoom * 0.049 + 0.1, 1);
}

export function toZoom(ratio) {
  return loRound((ratio - 0.1) / 0.049);
}

export function toDegree(rotate) {
  return loRound(rotate * 3.6 - 180);
}

export function toRotate(angle) {
  return loRound((angle + 180) / 3.6);
}
