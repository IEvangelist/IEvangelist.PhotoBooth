using System;
using System.Threading.Tasks;

namespace IEvangelist.PhotoBooth.Services
{
    public interface IImageRepository
    {
        Task UploadImageAsync(string id, string filePath);

        Task<Uri> GetImageUriAsync(string id);
    }
}