import { HashGenerator } from '@domain/authorization/applications/cryptography/hash-generator'

export class FakeHasher implements HashGenerator {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return plain === hashed
  }
}
