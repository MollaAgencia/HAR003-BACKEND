export const monthPeriodBySemiannualPeriod = (period: number): number[] => {
  switch (period) {
    case 1:
      return [2, 3, 4, 5, 6, 7]
    case 2:
      return [8, 9, 10, 11, 12, 1]
    default:
      throw new Error('Período inválido. Deve estar entre 1 e 2 para períodos semestrais.')
  }
}

export const bimonthlyPeriodBySemiannualPeriod = (period: number): number[] => {
  switch (period) {
    case 1:
      return [1, 2]
    case 2:
      return [3, 4]
    default:
      throw new Error('Período inválido. Deve estar entre 1 e 2 para períodos semestrais.')
  }
}
