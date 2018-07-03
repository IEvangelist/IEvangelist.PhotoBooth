using Microsoft.WindowsAzure.Storage.Blob;
using System.Threading.Tasks;

namespace IEvangelist.PhotoBooth.Providers
{
    public interface IContainerProvider
    {
        Task<CloudBlobContainer> GetContainerAsync();
    }
}