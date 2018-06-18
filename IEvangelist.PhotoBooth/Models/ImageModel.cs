using System.Collections.Generic;

namespace IEvangelist.PhotoBooth.Models
{
    public class ImagesPostRequest
    {
        public string Phone { get; set; }

        public List<string> Images { get; set; }
    }

    public class ImagesPostResponse
    {
        public bool IsSuccessful { get; set; }

        public string Error { get; set; }

        public string Id { get; set; }
    }

    public class ImageOptionsResponse
    {
        public int PhotosToTake { get; set; }

        public int PhotoCountDownDefault { get; set; }

        public int IntervalBetweenCountDown { get; set; }

        public int AnimationFrameDelay { get; set; }

        public int ImageHeight { get; set; }

        public int ImageWidth { get; set; }
    }
}