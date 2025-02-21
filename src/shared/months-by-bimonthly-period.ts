export const monthPeriodByBimonthlyPeriod = (period: number): number[] => {
  switch (period) {
    case 1:
      return [2, 3] // Fevereiro e Março
    case 2:
      return [5, 6] // Maio e Junho
    case 3:
      return [8, 9] // Agosto e Setembro
    case 4:
      return [10, 11] // Outubro e Novembro
    default:
      throw new Error('Período inválido. Deve estar entre 1 e 6 para períodos bimestrais.')
  }
}
