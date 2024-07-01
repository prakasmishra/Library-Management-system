const stopWordsList = [
    "a","an", "and", "are", "as", "at", "be", "but", "by", "for", "if", "in", "into", "is", "it",
    "no", "not", "of", "on", "or", "such", "that", "the", "their", "then", "there", "these", "they",
    "this", "to", "was", "will", "with"
  ];
const stopWordsSet = new Set(stopWordsList);

export function removeStopWords(words) {
    // Filter the original list, keeping only words not in the stop words set
    return words.filter(word => !stopWordsSet.has(word.toLowerCase()));
}
  