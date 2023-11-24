export const formatPhoneNumber = (string) => {
  const startsWith = string.at(0) === '+'
  const match = startsWith
    ? string.match(/^(\+\d{1}|)?(\d{3})(\d{3})(\d{2})(\d{2})$/)
    : string.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/)

  if (!match) {
    return string
  } else {
    return (
      match[1] +
      ' ' +
      match[2] +
      ' ' +
      match[3] +
      ' ' +
      match[4] +
      ' ' +
      match[5]
    )
  }
}
