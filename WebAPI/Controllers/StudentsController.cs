using BusinessLayer.Abstract;
using Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly IStudentService _studentService;

        public StudentsController(IStudentService studentService)
        {
            _studentService = studentService;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var values = _studentService.TGetList();
            return Ok(values);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var value = _studentService.TGetById(id);
            if (value == null) return NotFound();
            return Ok(value);
        }

        [HttpPost]
        public IActionResult Add(Student student)
        {
            try
            {
                _studentService.TAdd(student);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var value = _studentService.TGetById(id);
            if (value == null) return NotFound();

            _studentService.TDelete(value);
            return Ok();
        }

        [HttpPut]
        public IActionResult Update(Student student)
        {
            try
            {
                _studentService.TUpdate(student);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
