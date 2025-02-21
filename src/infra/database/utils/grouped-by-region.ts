type GroupedByRegionProps<T> = Array<
  T & {
    region: string
  }
>

export const groupedByRegion = <T>(datas: GroupedByRegionProps<T>) => {
  return datas.reduce(
    (acc, data) => {
      const { region } = data

      let regionGroup = acc.find((group) => group.region === region)

      if (!regionGroup) {
        regionGroup = { region, performances: [] }
        acc.push(regionGroup)
      }

      regionGroup.performances.push(data)

      return acc
    },
    [] as Array<{ region: string; performances: Array<T> }>,
  )
}
