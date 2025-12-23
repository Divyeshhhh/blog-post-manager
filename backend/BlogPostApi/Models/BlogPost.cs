namespace BlogPostApi.Models
{
    public class BlogPost
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public int UserId { get; set; } // Foreign key
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int FlagCount { get; set; } = 0;
        
        // Navigation properties
        public User User { get; set; } = null!;
    }
}