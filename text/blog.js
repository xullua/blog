document.addEventListener('DOMContentLoaded', function () {
    const blogDisplay = document.getElementById('blogdisplay');

    // ファイルリストを取得
    fetch('articles/filelist.json')
        .then(response => response.json())
        .then(files => {
            files.forEach(file => {
                fetch(file)
                    .then(response => response.text())
                    .then(text => {
                        const [yamlPart, markdownPart] = text.split('---').slice(1, 3);
                        const metaData = jsyaml.load(yamlPart);
                        const article = document.createElement('article');
                        const articleHTML = `
                            <a href="${file.replace('.md', '.html')}">
                                <img src="${metaData.image}" alt="${metaData.title}">
                                <h3>${metaData.title}</h3>
                                <p class="date">${metaData.date.replace(/-/g, '/')}</p>
                                <p class="tags">${metaData.tags.map(tag => `<span>${tag}</span>`).join(' ')}</p>
                            </a>
                        `;
                        article.innerHTML = articleHTML;
                        blogDisplay.appendChild(article);
                    })
                    .catch(error => console.error('Error loading file:', error));
            });
        })
        .catch(error => console.error('Error loading file list:', error));
});