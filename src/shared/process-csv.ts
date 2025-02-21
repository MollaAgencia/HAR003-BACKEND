import xlsx from 'node-xlsx'

export const processCSV = <I, O>(buffer: Buffer, callback: (value: I) => O): Array<O> => {
  const workSheetsFromBuffer = xlsx.parse(buffer)
  const columns = workSheetsFromBuffer[0].data[0]
  const datas = workSheetsFromBuffer[0].data.slice(1).filter((data) => data.length > 0)
  const dataWithColumns = datas.map((data) => {
    const obj = {} as Record<string, string>
    columns.forEach((column, index) => {
      obj[column] = data[index]
    })
    return obj
  })

  const results = [] as Array<O>

  dataWithColumns.forEach((data) => {
    results.push(callback(data as I))
  })

  return results
}
