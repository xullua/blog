let currentArticleIndex = 0;
const initialArticlesPerLoad = 11;
const additionalArticlesPerLoad = 9;
const currentYear = new Date().getFullYear();

// 記事データを取得
fetch('articles/articles.json')
    .then(response => response.json())
    .then(data => {
        loadArticles(data, initialArticlesPerLoad, false);
        document.getElementById('loadMore').addEventListener('click', () => {
            currentArticleIndex += additionalArticlesPerLoad;
            loadArticles(data, additionalArticlesPerLoad, false);
        });
        document.querySelectorAll('.filter input[type=checkbox]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                currentArticleIndex = 0;
                document.getElementById('articles').innerHTML = '';
                loadArticles(data, initialArticlesPerLoad, true);
            });
        });
        document.querySelectorAll('.filter input[type=date]').forEach(input => {
            input.addEventListener('change', () => {
                currentArticleIndex = 0;
                document.getElementById('articles').innerHTML = '';
                loadArticles(data, initialArticlesPerLoad, true);
            });
        });
        document.querySelector('.search input[type=text]').addEventListener('input', () => {
            currentArticleIndex = 0;
            document.getElementById('articles').innerHTML = '';
            loadArticles(data, initialArticlesPerLoad, true);
        });
    });

function loadArticles(data, articlesPerLoad, applyFilters) {
    const articlesDiv = document.getElementById('articles');
    let loadedArticles = 0;
    for (let i = currentArticleIndex; loadedArticles < articlesPerLoad && i < data.length; i++) {
        const article = data[i];
        if (!applyFilters || matchesFilters(article)) {
            const tags = article.tags.split(',').map(tag => `<span>${tag.trim()}</span>`).join('');
            const date = formatDate(article.date);
            const articleHTML = `
                <article>
                    <a href="${article.url}">
                        <img src="${article.image}" alt="${article.title}">
                        <div class="text">
                            <div class="detail">
                                <p class="tags">${tags}</p>
                                <p class="date">${date}</p>
                            </div>
                            <h3>${article.title}</h3>
                        </div>
                    </a>
                </article>
            `;
            articlesDiv.innerHTML += articleHTML;
            loadedArticles++;
        }
    }
    if (currentArticleIndex + articlesPerLoad >= data.length) {
        document.getElementById('loadMore').style.display = 'none';
    }
}

function matchesFilters(article) {
    const selectedCategories = Array.from(document.querySelectorAll('.filter input[name="category"]:checked')).map(checkbox => checkbox.value);
    const selectedTags = Array.from(document.querySelectorAll('.filter input[name="tags"]:checked')).map(checkbox => checkbox.value);
    const dateFrom = document.querySelector('.filter input[name="date-from"]').value;
    const dateTo = document.querySelector('.filter input[name="date-to"]').value;
    const searchText = document.querySelector('.search input[type=text]').value.toLowerCase();

    let categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(article.category);
    let tagsMatch = selectedTags.length === 0 || selectedTags.some(tag => article.tags.includes(tag));
    let dateMatch = true;
    let textMatch = true;

    if (dateFrom) {
        dateMatch = dateMatch && (new Date(article.date) >= new Date(dateFrom));
    }
    if (dateTo) {
        dateMatch = dateMatch && (new Date(article.date) <= new Date(dateTo));
    }

    if (searchText) {
        textMatch = article.title.toLowerCase().includes(searchText) ||
            article.description.toLowerCase().includes(searchText) ||
            article.tags.toLowerCase().includes(searchText);
    }

    return categoryMatch && tagsMatch && dateMatch && textMatch;
}

function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return year === currentYear.toString() ? `${month}月${day}日` : `${year}年${month}月${day}日`;
}
