export const currentFiscalBimonthly = () => {
  const month = new Date().getMonth() + 1

  // Definindo o bimestre com base no ano fiscal, que começa em fevereiro
  if (month === 2 || month === 3) return 1 // Fevereiro e Março (1º Bimestre Fiscal)
  if (month === 4 || month === 5) return 2 // Abril e Maio (2º Bimestre Fiscal)
  if (month === 6 || month === 7) return 3 // Junho e Julho (3º Bimestre Fiscal)
  if (month === 8 || month === 9) return 4 // Agosto e Setembro (4º Bimestre Fiscal)
  if (month === 10 || month === 11) return 5 // Outubro e Novembro (5º Bimestre Fiscal)
  return 6 // Dezembro e Janeiro (6º Bimestre Fiscal)
}
