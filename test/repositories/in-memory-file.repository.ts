import { FileRepository } from '@root/domain/library/applications/repositories/file.repository'
import { File } from '@root/domain/library/enterprise/entities/file.entity'
import { Slug } from '@root/domain/library/enterprise/object-value/slug'

import { InMemoryFolderRepository } from './in-memory-folder.repository'

export class InMemoryFileRepository implements FileRepository {
  constructor(private readonly folderRepository: InMemoryFolderRepository) {}
  public files: Array<File> = []

  async register(data: File): Promise<null> {
    const file = File.create(data)

    this.files.push(file)

    return
  }

  async findManyByParentSlug(slug?: Slug): Promise<Array<File>> {
    if (!slug) return this.files

    const folder = this.folderRepository.folders.find((folder) => folder.slug.equals(slug))

    const file = this.files.filter((file) => file.folderId.equals(folder.id))

    return file
  }
}
