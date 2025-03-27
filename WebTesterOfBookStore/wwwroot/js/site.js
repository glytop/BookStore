$(document).ready(function () {
    var currentLanguage = "";
    var currentSeed = parseInt($("#seedInput").val()) || 0;
    var currentLikes = parseFloat($("#rangeInput").val()) || 0;
    var currentReviews = parseFloat($("#reviews").val()) || 0;
    var currentPage = 1;
    var isLoading = false;

    loadBooks(1, true);

    $("#rangeInput").on('input', function () {
        var likesValue = $(this).val();
        $("#numberInput").val(likesValue);
        currentLikes = parseFloat(likesValue) || 0;
        refreshBooks();
    });

    $("#reviews").on('change', function () {
        currentReviews = parseFloat($(this).val()) || 0;
        refreshBooks();
    });

    $("#randomSeedButton").on('click', function () {
        var randomSeed = Math.floor(Math.random() * 100000000);
        $("#seedInput").val(randomSeed);
        currentSeed = randomSeed;
        refreshBooks();
    });

    $("#seedInput").on('change', function () {
        currentSeed = parseInt($(this).val()) || 0;
        refreshBooks();
    });

    $('#countrySelect').on('change', function () {
        currentLanguage = $(this).val();
        refreshBooks();
    });

    $(window).on('scroll', function () {
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
            if (!isLoading) {
                isLoading = true;
                currentPage++;
                loadBooks(currentPage, false);
                setTimeout(function () { isLoading = false; }, 500);
            }
        }
    });

    $('body').on('click', '.toggle-details', function (e) {
        e.preventDefault();
        var bookId = $(this).closest('.book-row').data('book-id');
        var detailsRow = $(`#details-${bookId}`);

        if (detailsRow.is(':visible')) {
            detailsRow.hide();
            $(this).html('<i class="bi bi-chevron-down"></i>');
        } else {
            $(".book-details-row").hide();
            $(".toggle-details").html('<i class="bi bi-chevron-down"></i>');
            detailsRow.show();
            $(this).html('<i class="bi bi-chevron-up"></i>');
        }
    });

    function loadBooks(page, clearExisting) {
        var booksPerPage = page === 1 ? 20 : 10;
        var startIndex = (page === 1) ? 1 : ((page - 1) * 10) + 11;

        $.ajax({
            url: '/api/Books',
            type: 'GET',
            data: {
                language: currentLanguage,
                seed: currentSeed,
                likesAvg: currentLikes,
                reviewsAvg: currentReviews,
                count: booksPerPage,
                startIndex: startIndex
            },
            success: function (books) {
                if (!books || !Array.isArray(books)) {
                    return;
                }

                if (clearExisting) $("#userTableBody").empty();

                books.forEach(function (book) {
                    var reviewsHtml = Array.isArray(book.Reviews)
                        ? book.Reviews.map(function (review) {
                            return `<div class="review-item">
                                <p class="review-text">${review.Text}</p>
                                <p class="reviewer">- ${review.Author}</p>
                            </div>`;
                        }).join('')
                        : '<p>Пока нет отзывов.</p>';

                    var bookRow = `
                        <tr class="book-row" data-book-id="${book.Id}">
                            <td>
                                <button class="toggle-details btn btn-sm btn-outline-secondary">
                                    <i class="bi bi-chevron-down"></i>
                                </button>
                            </td>
                            <td>${book.Id}</td>
                            <td>${book.ISBN}</td>
                            <td>${book.Title}</td>
                            <td>${book.Author}</td>
                            <td>${book.Publisher.split(',')[0]}</td>
                        </tr>
                        <tr class="book-details-row" id="details-${book.Id}" style="display: none;">
                            <td colspan="6" class="p-0">
                                <div class="book-details p-4">
                                    <div class="row">
                                        <div class="col-md-2">
                                            <img src="https://placehold.co/200x300/e9ecef/495057?text=${encodeURIComponent(book.Title)}" class="img-fluid book-cover" alt="Book cover">
                                            <div class="mt-3 text-center">
                                                <span class="likes-badge">
                                                    ${book.Likes.toFixed(1)} <i class="bi bi-hand-thumbs-up"></i>
                                                </span>
                                            </div>
                                        </div>
                                        <div class="col-md-10">
                                            <h3 class="book-title">${book.Title} <span class="book-format">(Paperback)</span></h3>
                                            <p class="book-author">${book.Author}</p>
                                            <p class="book-publisher">${book.Publisher}</p>
                                            
                                            <div class="mt-4">
                                                <h4 class="review-heading">Reviews (${book.Reviews.length})</h4>
                                                ${reviewsHtml || '<p>No reviews yet.</p>'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `;

                    $("#userTableBody").append(bookRow);
                });
            },
        });
    }

    function refreshBooks() {
        currentPage = 1;
        loadBooks(1, true);
    }
});
