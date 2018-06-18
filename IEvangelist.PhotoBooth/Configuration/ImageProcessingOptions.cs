namespace IEvangelist.PhotoBooth.Configuration
{
    public class ImageProcessingOptions
    {
        public int ImageWidth { get; set;  }

        public int ImageHeight { get; set; }

        public int RepeatCount { get; set; }

        public int FrameDelay { get; set; }

        public string Copyright { get; set; }
    }
}