using BusinessLayer.Abstract;
using BusinessLayer.Constants;
using DataAccessLayer.Abstract;
using Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Concrete
{
    public class StudentManager : IStudentService
    {
        
        private readonly IStudentRepository _studentRepository;

        public StudentManager(IStudentRepository studentRepository)
        {
            _studentRepository = studentRepository;
        }

        public void TAdd(Student t)
        {
            var varMi = _studentRepository.GetListAll(x => x.StudentNumber == t.StudentNumber && x.DeletedAt == null);

            if (varMi.Count > 0)
            {
                throw new Exception(Messages.StudentNumberExists);
            }
            _studentRepository.Insert(t);
        }

        public void TDelete(Student t)
        {
            _studentRepository.Delete(t);
        }

        public Student TGetById(int id)
        {
            return _studentRepository.GetById(id);
        }

        public List<Student> TGetList()
        {
            return _studentRepository.GetListAll(x => x.DeletedAt == null);
        }

        public void TUpdate(Student t)
        {
            _studentRepository.Update(t);
        }
    }
}
