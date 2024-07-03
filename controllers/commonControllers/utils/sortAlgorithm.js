function createNGrams(str, n) {
    const nGrams = [];
    for (let i = 0; i <= str.length - n; i++) {
        nGrams.push(str.slice(i, i + n));
    }
    return nGrams;
}

function buildInvertedIndex(books, n) {
    const index = {};
    books.forEach((book, idx) => {
        const searchableFields = [
            book.book.title.toLowerCase(),
            book.author_name.toLowerCase(),
            book.sub_name.toLowerCase()
        ];
        searchableFields.forEach(field => {
            const nGrams = createNGrams(field, n);
            nGrams.forEach(nGram => {
                if (!index[nGram]) {
                    index[nGram] = new Set();
                }
                index[nGram].add(idx);
            });
        });
    });
    return index;
}

function computeScore(mainString, keyword) {
    if (mainString.includes(keyword)) {
        return 1;
    }
    let matchedLength = 0;
    let keywordIndex = 0;

    for (let char of mainString) {
        if (char === keyword[keywordIndex]) {
            matchedLength++;
            keywordIndex++;
            if (keywordIndex === keyword.length) {
                break;
            }
        }
    }
    return matchedLength / keyword.length;
}

function scoreBooks(books, searchTerms, index, n, sortBy = 'string_matching') {
    const scores = books.map(book => {
        let stringMatchScore = 0;
        const searchableFields = [
            book.book.title.toLowerCase(),
            book.author_name.toLowerCase(),
            book.sub_name.toLowerCase()
        ];
        
        searchTerms.forEach(term => {
            let termScore = 0;
            const termNGrams = createNGrams(term.toLowerCase(), n);
            const potentialMatches = new Set();
            
            termNGrams.forEach(nGram => {
                if (index[nGram]) {
                    index[nGram].forEach(idx => potentialMatches.add(idx));
                }
            });
            
            potentialMatches.forEach(idx => {
                searchableFields.forEach(field => {
                    const score = computeScore(field, term);
                    if (score > termScore) {
                        termScore = score;
                    }
                });
            });

            stringMatchScore += termScore;
        });

        const popularityScore = book.book.popularity;
        const editionScore = book.book.edition;

        return { book, stringMatchScore, popularityScore, editionScore };
    });

    const maxStringMatchScore = Math.max(...scores.map(s => s.stringMatchScore));
    const maxPopularityScore = Math.max(...scores.map(s => s.popularityScore));
    const maxEditionScore = Math.max(...scores.map(s => s.editionScore));

    const weights = {
        string_matching: 1,
        popularity: sortBy === 'popularity' ? 1 : 0,
        edition: sortBy === 'edition' ? 1 : 0
    };

    return scores.map(score => {
        const normalizedStringMatchScore = score.stringMatchScore / maxStringMatchScore || 0;
        const normalizedPopularityScore = score.popularityScore / maxPopularityScore || 0;
        const normalizedEditionScore = score.editionScore / maxEditionScore || 0;

        const combinedScore = 
            weights.string_matching * normalizedStringMatchScore +
            weights.popularity * normalizedPopularityScore +
            weights.edition * normalizedEditionScore;

        return { book: score.book, combinedScore };
    });
}

export function sortBooks(books, searchTerms, sortBy = 'string_matching',n = 3) {
    const index = buildInvertedIndex(books, n);
    const scoredBooks = scoreBooks(books, searchTerms, index, n, sortBy);
    scoredBooks.sort((a, b) => b.combinedScore - a.combinedScore);
    return scoredBooks.map(item => item.book);
}
