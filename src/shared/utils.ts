export const duplicateItemsUniqueKey = <T>(arr: T[], Attributes: Array<keyof T>) => {
  return arr.filter(
    (item, index) => arr.findIndex((itemFound) => Attributes.every((key) => item[key] === itemFound[key])) !== index,
  )
}

export const removeDuplicateItems = <T>(arr: T[], Attributes: Array<keyof T>) => {
  return arr.filter(
    (item, index) => arr.findIndex((itemFound) => Attributes.every((key) => item[key] === itemFound[key])) === index,
  )
}
