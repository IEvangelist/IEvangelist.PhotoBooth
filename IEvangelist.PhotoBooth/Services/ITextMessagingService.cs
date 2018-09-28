using System.Threading.Tasks;

namespace IEvangelist.PhotoBooth.Services
{
    public interface ITextMessagingService
    {
        void SendText(string toPhoneNumber, string body);
    }
}