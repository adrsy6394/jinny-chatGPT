export function chackHeading(str) {
  return /^(\*)(\*)(.*)\*$/.test(str);
}

export function replaceHeadingStars(str) {
  return str.replace(/^(\*)(\*)|(\*)\*$/g, "");
}
