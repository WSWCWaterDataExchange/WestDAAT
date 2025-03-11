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

/**
 * TODO: JN
 * upload accessor
 * 
 * 1. go get the sas tokens from the API
 * 2. use the sas tokens to upload the files to the blob storage
 * 
 * - this will be called from a useMutation from the component
 * - need to create this accessor
 */
