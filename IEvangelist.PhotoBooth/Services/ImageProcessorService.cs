using System;
using System.Linq;
using System.Threading.Tasks;
using Centare.Extensions;
using IEvangelist.PhotoBooth.Configuration;
using IEvangelist.PhotoBooth.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Formats.Gif;
using SixLabors.ImageSharp.MetaData.Profiles.Exif;
using SixLabors.ImageSharp.PixelFormats;

namespace IEvangelist.PhotoBooth.Services
{
    public class ImageProcessorService : IImageProcessorService
    {
        private const string Base64PngImagePrefix = "data:image/png;base64,";

        private readonly IImageRepository _imageRepository;
        private readonly ITextMessagingService _textMessagingService;
        private readonly ImageProcessingOptions _processingOptions;
        private readonly ImageCaptureOptions _captureOptions;
        private readonly ILogger<ImageProcessorService> _logger;
        private readonly IImageEncoder _encoder = new GifEncoder();

        public ImageProcessorService(
            IImageRepository imageRepository,
            ITextMessagingService textMessagingService,
            IOptions<ImageProcessingOptions> processingOptions,
            IOptions<ImageCaptureOptions> captureOptions,
            ILogger<ImageProcessorService> logger)
        {
            _imageRepository = imageRepository ?? throw new ArgumentNullException(nameof(imageRepository));
            _textMessagingService = textMessagingService ?? throw new ArgumentNullException(nameof(textMessagingService));
            _processingOptions = processingOptions?.Value ?? throw new ArgumentNullException(nameof(processingOptions));
            _captureOptions = captureOptions?.Value ?? throw new ArgumentNullException(nameof(captureOptions));
            _logger = logger;
        }

        public async Task<ImagesPostResponse> ProcessImagesAsync(string baseUrl, ImagesPostRequest request)
        {
            try
            {
                var id = Guid.NewGuid().ToString();
                var imageBytes =
                    request.Images
                            .Select(img => img.Replace(Base64PngImagePrefix, string.Empty))
                            .Select(Convert.FromBase64String)
                            .ToArray();

                var image = Image.Load(imageBytes[0]);
                image.MetaData.RepeatCount = 0;

                for (var i = 1; i < imageBytes.Length; ++ i)
                {
                    image.Frames.AddFrame(Image.Load(imageBytes[i]).Frames[0]);
                }

                // Ensure that all the frames have the same delay
                foreach (var frame in image.Frames)
                {
                    frame.MetaData.FrameDelay = (int)(_processingOptions.FrameDelay * .1);
                }

                await UploadImageAsync(id, image);
                await _textMessagingService.SendTextAsync($"+{request.Phone}", $"Share your photo from Cream City Code! {baseUrl}/images/{id}");

                return new ImagesPostResponse { Id = id, IsSuccessful = true };
            }
            catch (Exception ex)
            {
                ex.TryLogException(_logger);
                return new ImagesPostResponse { IsSuccessful = false, Error = ex.Message }; 
            }
        }

        private async Task UploadImageAsync(string id, Image<Rgba32> image)
        {
            var fileName = $"./{id}.gif";
            var profile = new ExifProfile();
            profile.SetValue(ExifTag.Copyright, _processingOptions.Copyright);
            image.MetaData.ExifProfile = profile;
            image.Save(fileName, _encoder);

            await _imageRepository.UploadImageAsync(id, fileName);
        }

        public ImageOptionsResponse GetImageOptions()
            => new ImageOptionsResponse
               {
                   AnimationFrameDelay = _processingOptions.FrameDelay,
                   IntervalBetweenCountDown = _captureOptions.IntervalBetweenCountDown,
                   PhotoCountDownDefault = _captureOptions.PhotoCountDownDefault,
                   PhotosToTake = _captureOptions.PhotosToTake,
                   ImageHeight = _processingOptions.ImageHeight,
                   ImageWidth = _processingOptions.ImageWidth
               };
    }
}