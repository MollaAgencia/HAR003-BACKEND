export const currentFiscalSemester = (): number => {
  const month = new Date().getMonth() + 1
  return month >= 2 && month <= 7 ? 1 : 2
}
