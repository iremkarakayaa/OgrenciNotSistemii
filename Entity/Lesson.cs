using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity
{
    public class Lesson : BaseEntity
    {
        public string Name { get; set; }
        public string Code  { get; set; }
        public List<Grade>? Grades { get; set; }
    }
}
