import { BlobServiceClient, BlockBlobUploadResponse } from '@azure/storage-blob';
import { BlobUpload } from '../data-contracts/BlobUpload';

export enum ContainerName {
  ApplicationDocuments = 'application-documents',
}

export const uploadFilesToBlobStorage = async (
  containerName: ContainerName,
  uploadDetails: BlobUpload[]
): Promise<BlockBlobUploadResponse[]> => {
  let uploadPromises: Promise<BlockBlobUploadResponse>[] = [];

  uploadDetails.forEach(async (upload) => {
    const sasQueryParam = upload.sasToken.split('?')[1];
    const blobServiceClient = new BlobServiceClient(`${upload.hostname}?${sasQueryParam}`);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(upload.blobname);
    uploadPromises.push(blockBlobClient.upload(upload.data, upload.contentLength));
  });

  return await Promise.all(uploadPromises);
};
