using Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Abstract
{
    public interface IStudentService
    {
      
            void TAdd(Student t);

            void TDelete(Student t);

            void TUpdate(Student t);

            List<Student> TGetList();

            Student TGetById(int id);
        
    }
}
