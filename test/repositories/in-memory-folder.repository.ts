import { FolderRepository } from '@root/domain/library/applications/repositories/folder.repository'
import { Folder } from '@root/domain/library/enterprise/entities/folder.entity'
import { Slug } from '@root/domain/library/enterprise/object-value/slug'

export class InMemoryFolderRepository implements FolderRepository {
  public folders: Array<Folder> = []
  async register(folder: Folder): Promise<null> {
    this.folders.push(folder)

    return
  }

  async findBySlug(slug: Slug): Promise<Folder> {
    const folder = this.folders.find((folder) => folder.slug.equals(slug))

    if (!folder) return null

    return folder
  }

  async findManyByParentSlug(slug?: Slug): Promise<Array<Folder>> {
    if (!slug) return this.folders

    const folders = this.folders.filter((folder) => folder.slug.equals(slug))

    return folders
  }
}
