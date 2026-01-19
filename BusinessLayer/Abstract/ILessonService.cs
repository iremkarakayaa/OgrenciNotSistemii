using Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Abstract
{
    public interface ILessonService
    {

        void TAdd(Lesson t);

        void TDelete(Lesson t);

        void TUpdate(Lesson t);

        List<Lesson> TGetList();

        Lesson TGetById(int id);
    }
}
