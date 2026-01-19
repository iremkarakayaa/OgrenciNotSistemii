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
    public class LessonValidator : AbstractValidator<Lesson>
    {
        public LessonValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage(Messages.LessonNameNotEmpty)
                .MinimumLength(3).WithMessage(Messages.LessonNameMinLength)
                .MaximumLength(100).WithMessage(Messages.LessonNameMaxLength);

            RuleFor(x => x.Code)
                .NotEmpty().WithMessage(Messages.LessonCodeNotEmpty)
                .MinimumLength(2).WithMessage(Messages.LessonCodeMinLength)
                .MaximumLength(10).WithMessage(Messages.LessonCodeMaxLength)
                .Matches("^[A-Z0-9]+$").WithMessage(Messages.LessonCodeFormat);
        }
    }
}

