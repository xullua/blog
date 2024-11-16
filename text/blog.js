let currentArticleIndex = 0;
const initialArticlesPerLoad = 11;
const additionalArticlesPerLoad = 9;

document.addEventListener('DOMContentLoaded', () => {
    console.log("ページがロードされました"); // ページロード確認

    const articlesDiv = document.getElementById('articles');
    if (articlesDiv) {
        console.log("#articles が見つかりました"); // 記事リスト要素があるか確認

        const articles = articlesDiv.querySelectorAll('article');
        if (articles.length === 0) {
            console.warn("記事が見つかりません"); // 記事が表示されていない場合の警告
        } else {
            console.log(`全${articles.length}件の記事が見つかりました`); // 記事の数を確認
        }
    } else {
        console.error("#articles が見つかりません"); // 記事リストのHTML要素が無い場合のエラー
    }

    // 初期ロード
    loadArticles(false);

    // ボタンのクリックイベント
    const loadMoreButton = document.getElementById('loadMore');
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', () => {
            currentArticleIndex += additionalArticlesPerLoad;
            console.log(`現在の記事インデックス: ${currentArticleIndex}`);
            loadArticles(false);
        });
    } else {
        console.error("もっと読むボタン (#loadMore) が見つかりません");
    }

    // フィルタ設定
    document.querySelectorAll('.filter input[type=checkbox], .filter input[type=date]').forEach(input => {
        input.addEventListener('change', () => {
            console.log("フィルタが変更されました");
            applyFilters();
        });
    });

    // 検索ボックスのフィルタリング
    const searchInput = document.querySelector('.search input[type=text]');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            console.log("検索フィルタが適用されました");
            applyFilters();
        });
    } else {
        console.error("検索入力ボックスが見つかりません");
    }
});

// 記事をロード
function loadArticles(applyFilters) {
    const articlesDiv = document.getElementById('articles');
    if (!articlesDiv) {
        console.error("#articles が存在しません");
        return;
    }

    const allArticles = Array.from(articlesDiv.querySelectorAll('article'));
    allArticles.forEach((article, index) => {
        console.log(`記事${index + 1}のデータ:`, {
            category: article.getAttribute('data-category'),
            tags: article.getAttribute('data-tags'),
            date: article.getAttribute('data-date'),
            title: article.querySelector('h3')?.textContent || "タイトルがありません",
        });
    });

    if (allArticles.length === 0) {
        console.warn("記事がありません。データが正しいか確認してください");
        return;
    }

    console.log(`全記事数: ${allArticles.length}`);

    let loadedArticles = 0;
    allArticles.forEach((article, index) => {
        if (!applyFilters || matchesFilters(article)) {
            const shouldDisplay = index >= currentArticleIndex && loadedArticles < additionalArticlesPerLoad;
            article.style.display = shouldDisplay ? 'block' : 'none';

            if (shouldDisplay) {
                console.log(`記事${index + 1}（${article.querySelector('h3').textContent}）を表示`);
                loadedArticles++;
            }
        }
    });

    const loadMoreButton = document.getElementById('loadMore');
    if (currentArticleIndex + additionalArticlesPerLoad >= allArticles.length) {
        if (loadMoreButton) {
            loadMoreButton.style.display = 'none';
        }
        console.log("全ての記事が表示されました");
    } else {
        if (loadMoreButton) {
            loadMoreButton.style.display = 'block';
        }
        console.log("もっと読むボタンが表示されています");
    }
}

// フィルタの適用
function applyFilters() {
    console.log("フィルタ処理を開始");
    currentArticleIndex = 0;
    loadArticles(true);
}

// フィルタ条件の判定
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

    console.log(`記事フィルタ判定: Category=${matchesCategory}, Tags=${matchesTags}, Date=${matchesDate}, Text=${matchesText}`);
    return matchesCategory && matchesTags && matchesDate && matchesText;
}
