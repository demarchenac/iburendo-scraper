const separatorRegex = /,/g;
const everyWhiteSpaceRegex = /\s+/g;
const singleQuoteBetweenLettersRegex = /([a-zA-ZñÑáéíóúÁÉÍÓÚ])'([a-zA-ZñÑáéíóúÁÉÍÓÚ])/;

export function parseStringToSlug(input: string) {
  return input
    .toLowerCase()
    .replace(separatorRegex, "")
    .replace(everyWhiteSpaceRegex, "-")
    .replace(singleQuoteBetweenLettersRegex, "$1$2");
}
