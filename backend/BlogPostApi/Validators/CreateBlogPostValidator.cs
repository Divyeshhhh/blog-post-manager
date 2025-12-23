using BlogPostApi.DTOs;
using FluentValidation;

namespace BlogPostApi.Validators
{
    public class CreateBlogPostValidator : AbstractValidator<CreateBlogPostDto>
    {
        public CreateBlogPostValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Content is required")
                .MinimumLength(10).WithMessage("Content must be at least 10 characters");
        }
    }

    public class UpdateBlogPostValidator : AbstractValidator<UpdateBlogPostDto>
    {
        public UpdateBlogPostValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Content is required")
                .MinimumLength(10).WithMessage("Content must be at least 10 characters");
        }
    }
}