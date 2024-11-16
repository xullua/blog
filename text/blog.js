let currentArticleIndex = 0;
const initialArticlesPerLoad = 11;
const additionalArticlesPerLoad = 9;

// 初期ロードとボタンクリックのイベントを設定
document.addEventListener('DOMContentLoaded', () => {
    console.log("ページがロードされました");  // ページロード確認
    loadArticles(false);  // 初期表示
    document.getElementById('loadMore').addEventListener('click', () => {
        currentArticleIndex += additionalArticlesPerLoad;
        loadArticles(false);
    });

    // フィルタ設定
    document.querySelectorAll('.filter input[type=checkbox], .filter input[type=date]').forEach(input => {
        input.addEventListener('change', applyFilters);
    });

    // 検索ボックスのフィルタリング
    document.querySelector('.search input[type=text]').addEventListener('input', applyFilters);
});

// 記事をロードし、初期または追加のものを表示
function loadArticles(applyFilters) {
    const articlesDiv = document.getElementById('articles');
    const allArticles = Array.from(document.querySelectorAll('#articles article'));

    if (allArticles.length === 0) {
        console.log("記事が見つかりません");  // 記事が取得されていない場合の確認
        return;
    } else {
        console.log(`全${allArticles.length}件の記事が見つかりました`);  // 記事数確認
    }

    // 記事の表示処理
    let loadedArticles = 0;
    allArticles.forEach((article, index) => {
        if (!applyFilters || matchesFilters(article)) {
            article.style.display = (index >= currentArticleIndex && loadedArticles < additionalArticlesPerLoad) ? 'block' : 'none';
            loadedArticles++;
            console.log(`記事${index}を表示`);  // 表示される記事の確認
        }
    });

    // もっと読むボタンの表示設定
    if (currentArticleIndex + additionalArticlesPerLoad >= allArticles.length) {
        document.getElementById('loadMore').style.display = 'none';
        console.log("全ての記事が表示されました");  // 記事が全て表示されたかどうかの確認
    } else {
        console.log("もっと読むボタンが表示されました");  // もっと読むボタンが表示されているか確認
    }
}

// フィルタの設定
function applyFilters() {
    console.log("フィルタが適用されました");  // フィルタが適用されたか確認
    currentArticleIndex = 0;
    loadArticles(true);
}

// フィルタ条件の確認
function matchesFilters(article) {
    const selectedCategories = Array.from(document.querySelectorAll('.filter input[name="category"]:checked')).map(checkbox => checkbox.value);
    const selectedTags = Array.from(document.querySelectorAll('.filter input[name="tags"]:checked')).map(checkbox => checkbox.value);
    const dateFrom = document.querySelector('.filter input[name="date-from"]').value;
    const dateTo = document.querySelector('.filter input[name="date-to"]').value;
    const searchText = document.querySelector('.search input[type="text"]').value.toLowerCase();

    const articleCategory = article.getAttribute('data-category');
    const articleTags = article.getAttribute('data-tags').split(',');
    const articleDate = new Date(article.getAttribute('data-date'));
    const articleTitle = article.querySelector('h3').textContent.toLowerCase();

    let matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(articleCategory);
    let matchesTags = selectedTags.length === 0 || selectedTags.some(tag => articleTags.includes(tag));
    let matchesDate = true;
    let matchesText = articleTitle.includes(searchText);

    if (dateFrom) matchesDate = matchesDate && (articleDate >= new Date(dateFrom));
    if (dateTo) matchesDate = matchesDate && (articleDate <= new Date(dateTo));

    return matchesCategory && matchesTags && matchesDate && matchesText;
}
