using Bogus;
using Microsoft.AspNetCore.Mvc;
using WebTesterOfBookStore.Models;

namespace WebTesterOfBookStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private static object LockObj = new();
        private static Faker _faker;
        private static int _currentSeed;
        private static string _currentLocale;
        private static List<BookViewModel> _cachedBooks;

        [HttpGet]
        public IActionResult GetBooks(string? language, int seed, double likesAvg, double reviewsAvg, int count = 20, int startIndex = 1)
        {
            var locale = string.IsNullOrEmpty(language) ? "" : language;

            lock (LockObj)
            {
                if (_cachedBooks is null || _currentSeed != seed || _currentLocale != locale)
                {
                    _currentSeed = seed;
                    _currentLocale = locale;
                    _faker = new Faker(locale);
                    Randomizer.Seed = new Random(seed);
                    _cachedBooks = GenerateStaticBooks(100);
                }

                var booksSlice = _cachedBooks.Skip(startIndex - 1).Take(count).ToList();

                foreach (var book in booksSlice)
                {
                    var baseLikes = (int)Math.Floor(likesAvg);
                    var likeFraction = likesAvg - baseLikes;
                    var rndLikes = new Random(_currentSeed + book.Id);
                    var extraLike = rndLikes.NextDouble() < likeFraction ? 1 : 0;
                    book.Likes = baseLikes + extraLike;

                    var baseReviews = (int)Math.Floor(reviewsAvg);
                    var reviewFraction = reviewsAvg - baseReviews;
                    var rndReviews = new Random(_currentSeed + book.Id + 1000);
                    var extraReview = rndReviews.NextDouble() < reviewFraction ? 1 : 0;
                    var totalReviews = baseReviews + extraReview;

                    book.Reviews = GenerateReviewsForBook(book.Id, totalReviews);
                }

                return Ok(booksSlice);
            }
        }

        private static List<BookViewModel> GenerateStaticBooks(int total)
        {
            var books = new List<BookViewModel>();
            for (int i = 0; i < total; i++)
            {
                var bookId = i + 1;
                var authorsCount = _faker.Random.Int(1, 3);
                var authors = Enumerable.Range(0, authorsCount)
                                        .Select(x => _faker.Name.FullName())
                                        .ToList();

                var book = new BookViewModel
                {
                    Id = bookId,
                    ISBN = _faker.Random.Replace("978-#-##-######-#"),
                    Title = _faker.Commerce.ProductName(),
                    Author = string.Join(", ", authors),
                    Publisher = _faker.Company.CompanyName(),
                    Likes = 0,
                    Reviews = new List<ReviewViewModel>()
                };
                books.Add(book);
            }
            return books;
        }


        private static List<ReviewViewModel> GenerateReviewsForBook(int bookId, int count)
        {
            var reviews = new List<ReviewViewModel>();
            var reviewFaker = new Faker<ReviewViewModel>(_currentLocale)
                .RuleFor(r => r.Author, f => f.Name.FullName())
                .RuleFor(r => r.Text, f => f.Lorem.Sentence());
            reviewFaker.UseSeed(_currentSeed + bookId + 5000);
            for (int i = 0; i < count; i++)
            {
                reviews.Add(reviewFaker.Generate());
            }
            return reviews;
        }
    }
}