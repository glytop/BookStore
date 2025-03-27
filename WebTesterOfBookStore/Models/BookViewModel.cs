using Microsoft.AspNetCore.Mvc.ViewEngines;

namespace WebTesterOfBookStore.Models
{
    public class BookViewModel
    {
        public int Id { get; set; }
        public string ISBN { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string Publisher { get; set; }
        public double Likes { get; set; } 

        public List<ReviewViewModel> Reviews { get; set; }
    }
}
