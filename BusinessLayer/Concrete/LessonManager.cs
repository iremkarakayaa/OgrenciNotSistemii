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
    public class LessonManager : ILessonService
    {
        private readonly ILessonRepository _lessonRepository;

        public LessonManager(ILessonRepository lessonRepository)
        {
            _lessonRepository = lessonRepository;
        }

        public void TAdd(Lesson t)
        {
            var codeExists = _lessonRepository.GetListAll(x => x.Code == t.Code && x.DeletedAt == null);
            if (codeExists.Count > 0)
            {
                throw new Exception(Messages.LessonCodeExists);
            }
            
            var nameExists = _lessonRepository.GetListAll(x => x.Name == t.Name && x.DeletedAt == null);
            if (nameExists.Count > 0)
            {
                throw new Exception(Messages.LessonNameExists);
            }
            
            _lessonRepository.Insert(t);
        }

        public void TDelete(Lesson t)
        {
            _lessonRepository.Delete(t);
        }

        public Lesson TGetById(int id)
        {
            return _lessonRepository.GetById(id);
        }

        public List<Lesson> TGetList()
        {
            return _lessonRepository.GetListAll(x => x.DeletedAt == null);
        }

        public void TUpdate(Lesson t)
        {
            _lessonRepository.Update(t);
        }
    }
}
