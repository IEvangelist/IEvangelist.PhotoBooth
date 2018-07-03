using IEvangelist.PhotoBooth.Providers;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading.Tasks;

namespace IEvangelist.PhotoBooth.Services
{
    public class ImageRepository : IImageRepository
    {
        private readonly IContainerProvider _containerProvider;
        private readonly ILogger<ImageRepository> _logger;

        public ImageRepository(
            IContainerProvider containerProvider,
            ILogger<ImageRepository> logger)
        {
            _containerProvider = containerProvider ?? throw new ArgumentNullException(nameof(containerProvider));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<Uri> GetImageUriAsync(string id)
        {
            var container = await _containerProvider.GetContainerAsync();
            var reference = await container.GetBlobReferenceFromServerAsync(id);
            return reference.Uri;
        }

        public async Task UploadImageAsync(string id, string filePath)
        {
            var container = await _containerProvider.GetContainerAsync();
            var blob = container.GetBlockBlobReference(id);
            await blob.UploadFromFileAsync(filePath);
            File.Delete(filePath);
        }
    }
}