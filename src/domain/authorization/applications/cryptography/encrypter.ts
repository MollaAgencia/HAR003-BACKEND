export type EncryptProps = {
  payload: Record<string, string>
}

export abstract class Encrypter {
  abstract encrypt(data: EncryptProps): Promise<string>
}
