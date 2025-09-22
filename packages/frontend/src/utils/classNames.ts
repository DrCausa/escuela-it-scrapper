export function flattenClasses(rawClassName: string) {
  return rawClassName.split(/\s+/).filter(Boolean).join(" ");
}
