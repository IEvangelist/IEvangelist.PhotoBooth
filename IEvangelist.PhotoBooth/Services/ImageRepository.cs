using IEvangelist.PhotoBooth.Providers;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading.Tasks;

namespace IEvangelist.PhotoBooth.Services
{
    public class ImageRepository : IImageRepository
    {
        private readonly IContainerProvider _containerProvider;
        private readonly IMemoryCache _cache;
        private readonly ILogger<ImageRepository> _logger;

        public ImageRepository(
            IContainerProvider containerProvider,
            IMemoryCache cache,
            ILogger<ImageRepository> logger)
        {
            _containerProvider = containerProvider ?? throw new ArgumentNullException(nameof(containerProvider));
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<Uri> GetImageUriAsync(string id)
        {
            var cachedUri = await _cache.GetOrCreateAsync(id, async entry =>
            {
                entry.SlidingExpiration = TimeSpan.FromHours(6);

                var container = await _containerProvider.GetContainerAsync();
                var reference = await container.GetBlobReferenceFromServerAsync(id);

                return reference.Uri;
            });

            return cachedUri;
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