import { EncryptProps, Encrypter } from '@domain/authorization/applications/cryptography/encrypter'

export class FakeEncrypter implements Encrypter {
  async encrypt({ payload }: EncryptProps): Promise<string> {
    return JSON.stringify(payload)
  }
}
