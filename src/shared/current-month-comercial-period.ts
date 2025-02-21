export const currentCommercialPeriod = (month?: number) => {
  const currentMonth = month || new Date().getMonth() + 1
  const adjustedMonth = currentMonth >= 9 ? currentMonth - 8 : currentMonth + 4
  return adjustedMonth
}
