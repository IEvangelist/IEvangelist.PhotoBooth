using System.Threading.Tasks;
using IEvangelist.PhotoBooth.Configuration;
using IEvangelist.PhotoBooth.Models;
using IEvangelist.PhotoBooth.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace IEvangelist.PhotoBooth.Controllers
{
    [Route("api/image")]
    public class ImageController : Controller
    {
        [HttpPost, Route("generate")]
        public async Task<IActionResult> Generate(
            [FromBody] ImagesPostRequest imagesPostRequest,
            [FromServices] IImageProcessorService imageProcessor,
            [FromServices] IOptions<SocializeOptions> socializeOptions)
            => Json(await imageProcessor.ProcessImagesAsync(socializeOptions.Value.BaseUrl, imagesPostRequest));

        [HttpGet, Route("options")]
        public IActionResult GetOptions(
            [FromServices] IImageProcessorService imageProcessor)
            => Json(imageProcessor.GetImageOptions());
    }
}