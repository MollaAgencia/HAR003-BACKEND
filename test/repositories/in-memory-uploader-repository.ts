import {
  UploaderRepository,
  UploadImageParams,
  UploadOutput,
} from '@root/domain/upload/applications/repositories/uploader.repository'
import { randomUUID } from 'crypto'

export class InMemoryUploaderRepository implements UploaderRepository {
  async upload({ fileName, folder }: UploadImageParams): Promise<UploadOutput> {
    const uploadId = randomUUID()

    const uniqueName = `${folder}/${uploadId}-${fileName}`

    return {
      url: `https://s3.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${uniqueName}`,
      signedUrl: `https://s3.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${uniqueName}`,
    }
  }
}
