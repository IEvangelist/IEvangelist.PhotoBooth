using IEvangelist.PhotoBooth.Models;
using System.Threading.Tasks;

namespace IEvangelist.PhotoBooth.Services
{
    public interface IImageProcessorService
    {
        Task<ImagesPostResponse> ProcessImagesAsync(string baseUrl, ImagesPostRequest request);

        ImageOptionsResponse GetImageOptions();
    }
}
