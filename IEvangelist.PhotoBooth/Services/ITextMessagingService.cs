using System.Threading.Tasks;

namespace IEvangelist.PhotoBooth.Services
{
    public interface ITextMessagingService
    {
        Task SendTextAsync(string toPhoneNumber, string body);
    }
}