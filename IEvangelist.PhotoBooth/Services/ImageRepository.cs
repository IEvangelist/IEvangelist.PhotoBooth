using Centare.Extensions;
using IEvangelist.PhotoBooth.Configuration;
using IEvangelist.PhotoBooth.Threading;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace IEvangelist.PhotoBooth.Services
{
    public class ImageRepository : IImageRepository
    {
        private static AsyncLazy<CloudBlobContainer> _initialization;

        private readonly ImageRepositoryOptions _repositoryOptions;
        private readonly ILogger<ImageRepository> _logger;

        public ImageRepository(
            IOptions<ImageRepositoryOptions> repositoryOptions,
            ILogger<ImageRepository> logger)
        {
            _repositoryOptions = repositoryOptions?.Value ?? throw new ArgumentNullException(nameof(repositoryOptions));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));

            Interlocked.Exchange(ref _initialization, new AsyncLazy<CloudBlobContainer>(InitializeAsync));

            async Task<CloudBlobContainer> InitializeAsync()
            {
                var connectionString = Environment.GetEnvironmentVariable(_repositoryOptions.ConnectionStringKey);
                if (CloudStorageAccount.TryParse(connectionString, out var account))
                {
                    try
                    {
                        var client = account.CreateCloudBlobClient();
                        var container = client.GetContainerReference(_repositoryOptions.ContainerName);
                        await container.CreateIfNotExistsAsync();
                        await container.SetPermissionsAsync(new BlobContainerPermissions
                        {
                            PublicAccess = BlobContainerPublicAccessType.Blob
                        });

                        return container;
                    }
                    catch (Exception ex)
                    {
                        ex.TryLogException(_logger);
                        throw ex;
                    }
                }

                throw new Exception("Unable to connect to Azure Storage Account Container!");
            };
        }

        public async Task<Uri> GetImageUriAsync(string id)
        {
            var container = await _initialization.Value;
            var reference = await container.GetBlobReferenceFromServerAsync(id);
            return reference.Uri;
        }

        public async Task UploadImageAsync(string id, string filePath)
        {
            var container = await _initialization.Value;
            var blob = container.GetBlockBlobReference(id);
            await blob.UploadFromFileAsync(filePath);
            File.Delete(filePath);
        }
    }
}