using System;
using System.Threading.Tasks;
using IEvangelist.PhotoBooth.Models;
using IEvangelist.PhotoBooth.Services;
using Microsoft.AspNetCore.Mvc;

namespace IEvangelist.PhotoBooth.Controllers
{
    [Route("api/image")]
    public class ImageController : Controller
    {
        [HttpPost, Route("generate")]
        public async Task<IActionResult> Generate(
            [FromBody] ImagesPostRequest imagesPostRequest,
            [FromServices] IImageProcessorService imageProcessor)
            => Json(await imageProcessor.ProcessImagesAsync($"{Request.Scheme}://{Request.Host}{Request.PathBase}", imagesPostRequest));

        [HttpGet, Route("options")]
        public IActionResult GetOptions(
            [FromServices] IImageProcessorService imageProcessor)
            => Json(imageProcessor.GetImageOptions());

        [HttpGet, Route("{id}")]
        public async Task<IActionResult> Get(
            [FromRoute] Guid id,
            [FromServices] IImageRepository imageRepository)
            => Json(new { Url = await imageRepository.GetImageUriAsync(id.ToString()) });
    }
}