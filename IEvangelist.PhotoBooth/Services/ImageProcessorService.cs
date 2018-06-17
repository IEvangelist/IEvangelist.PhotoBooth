using System;
using System.Linq;
using System.Threading.Tasks;
using IEvangelist.PhotoBooth.Configuration;
using IEvangelist.PhotoBooth.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Formats.Gif;

namespace IEvangelist.PhotoBooth.Services
{
    public class ImageProcessorService : IImageProcessorService
    {
        private const string Base64PngImagePrefix = "data:image/png;base64,";

        private readonly ImageProcessingOptions _processingOptions;
        private readonly ImageCaptureOptions _captureOptions;
        private readonly ILogger<ImageProcessorService> _logger;
        private readonly IImageEncoder _encoder = new GifEncoder();

        public ImageProcessorService(
            IOptions<ImageProcessingOptions> processingOptions,
            IOptions<ImageCaptureOptions> captureOptions,
            ILogger<ImageProcessorService> logger)
        {
            _processingOptions = processingOptions?.Value ?? throw new ArgumentNullException(nameof(processingOptions));
            _captureOptions = captureOptions?.Value ?? throw new ArgumentNullException(nameof(captureOptions));
            _logger = logger;
        }

        public async Task<ImagesPostResponse> ProcessImagesAsync(ImagesPostRequest request)
        {
            try
            {
                var id = Guid.NewGuid().ToString();
                await Task.Run(() =>
                {
                    var imageBytes = 
                        request.Images
                               .Select(img => img.Replace(Base64PngImagePrefix, string.Empty))
                               .Select(Convert.FromBase64String)
                               .ToArray();

                    var firstImage = Image.Load(imageBytes[0]);
                    firstImage.MetaData.RepeatCount = 0;

                    for (int i = 1; i < imageBytes.Length; ++ i)
                    {
                        firstImage.Frames.AddFrame(Image.Load(imageBytes[i]).Frames[0]);
                    }

                    // Ensure that all the frames have the same delay
                    foreach (var frame in firstImage.Frames)
                    {
                        frame.MetaData.FrameDelay = (int)(_processingOptions.FrameDelay * .1);
                    }

                    // TODO: do not save the images here.
                    // Put them in blob storage in Azure.
                    // Later, we will build a page that will load these images 
                    // on a page with a unique identifier, ideally
                    // it can be shared with anyone around the world.
                    firstImage.Save($"./{id}.gif", _encoder);
                });

                return new ImagesPostResponse { Id = id, IsSuccessful = true };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, ex);
                return new ImagesPostResponse { IsSuccessful = false, Error = ex.Message }; 
            }
        }

        public ImageOptionsResponse GetImageOptions()
            => new ImageOptionsResponse
               {
                   AnimationFrameDelay = _processingOptions.FrameDelay,
                   IntervalBetweenCountDown = _captureOptions.IntervalBetweenCountDown,
                   PhotoCountDownDefault = _captureOptions.PhotoCountDownDefault,
                   PhotosToTake = _captureOptions.PhotosToTake
               };
    }
}
