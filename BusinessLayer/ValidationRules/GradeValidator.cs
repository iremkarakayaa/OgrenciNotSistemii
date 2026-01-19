using BusinessLayer.Constants;
using Entity;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.ValidationRules
{
    public class GradeValidator : AbstractValidator<Grade>
    {
        public GradeValidator()
        {
            RuleFor(x => x.ExamScore)
                .InclusiveBetween(0, 100).WithMessage(Messages.GradeRangeError) // <- Sabitten geliyor
                .When(x => x.ExamScore != null);
        }
    }
}
