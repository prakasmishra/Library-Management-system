export const availableAndSortByEditionDesc = `MATCH (book:Book)
, (author:Author)-[wr:WROTE]->(book)
, (subject:Subject) -[:CONTAINS]-> (book)
WHERE (book.title =~ $regex 
OR author.author_name =~ $regex
OR subject.sub_name =~ $regex)
AND book.no_of_copies > 0 
RETURN book,author.author_name AS author_name,subject.sub_name AS sub_name
ORDER BY book.edition DESC
LIMIT $limit
`;

export const availableAndSortByEditionAsc = `MATCH (book:Book)
, (author:Author)-[wr:WROTE]->(book)
, (subject:Subject) -[:CONTAINS]-> (book)
WHERE (book.title =~ $regex 
OR author.author_name =~ $regex
OR subject.sub_name =~ $regex)
AND book.no_of_copies > 0 
RETURN book,author.author_name AS author_name,subject.sub_name AS sub_name
ORDER BY book.edition ASC
LIMIT $limit
`;

export const availableAndSortByPopularityDesc = `MATCH (book:Book)
, (author:Author)-[wr:WROTE]->(book)
, (subject:Subject) -[:CONTAINS]-> (book)
WHERE (book.title =~ $regex 
OR author.author_name =~ $regex
OR subject.sub_name =~ $regex)
AND book.no_of_copies > 0 
RETURN book,author.author_name AS author_name,subject.sub_name AS sub_name
ORDER BY book.popularity DESC
LIMIT $limit
`;

export const availableAndSortByPopularityAsc = `MATCH (book:Book)
, (author:Author)-[wr:WROTE]->(book)
, (subject:Subject) -[:CONTAINS]-> (book)
WHERE (book.title =~ $regex 
OR author.author_name =~ $regex
OR subject.sub_name =~ $regex)
AND book.no_of_copies > 0 
RETURN book,author.author_name AS author_name,subject.sub_name AS sub_name
ORDER BY book.popularity ASC
LIMIT $limit
`;

export const notAvailableAndSortByEditionDesc = `MATCH (book:Book)
, (author:Author)-[wr:WROTE]->(book)
, (subject:Subject) -[:CONTAINS]-> (book)
WHERE (book.title =~ $regex 
OR author.author_name =~ $regex
OR subject.sub_name =~ $regex)
AND book.no_of_copies = 0 
RETURN book,author.author_name AS author_name,subject.sub_name AS sub_name
ORDER BY book.edition DESC
LIMIT $limit
`;

export const notAvailableAndSortByEditionAsc = `MATCH (book:Book)
, (author:Author)-[wr:WROTE]->(book)
, (subject:Subject) -[:CONTAINS]-> (book)
WHERE (book.title =~ $regex 
OR author.author_name =~ $regex
OR subject.sub_name =~ $regex)
AND book.no_of_copies = 0 
RETURN book,author.author_name AS author_name,subject.sub_name AS sub_name
ORDER BY book.edition ASC
LIMIT $limit
`;

export const notAvailableAndSortByPopularityDesc = `MATCH (book:Book)
, (author:Author)-[wr:WROTE]->(book)
, (subject:Subject) -[:CONTAINS]-> (book)
WHERE (book.title =~ $regex 
OR author.author_name =~ $regex
OR subject.sub_name =~ $regex)
AND book.no_of_copies = 0 
RETURN book,author.author_name AS author_name,subject.sub_name AS sub_name
ORDER BY book.popularity DESC
LIMIT $limit
`;

export const notAvailableAndSortByPopularityAsc = `MATCH (book:Book)
, (author:Author)-[wr:WROTE]->(book)
, (subject:Subject) -[:CONTAINS]-> (book)
WHERE (book.title =~ $regex 
OR author.author_name =~ $regex
OR subject.sub_name =~ $regex)
AND book.no_of_copies = 0 
RETURN book,author.author_name AS author_name,subject.sub_name AS sub_name
ORDER BY book.popularity ASC
LIMIT $limit
`;

export const sortByEditionDesc = `MATCH (book:Book)
, (author:Author)-[wr:WROTE]->(book)
, (subject:Subject) -[:CONTAINS]-> (book)
WHERE (book.title =~ $regex 
OR author.author_name =~ $regex
OR subject.sub_name =~ $regex)
RETURN book,author.author_name AS author_name,subject.sub_name AS sub_name
ORDER BY book.edition DESC
LIMIT $limit
`;

export const sortByEditionAsc = `MATCH (book:Book)
, (author:Author)-[wr:WROTE]->(book)
, (subject:Subject) -[:CONTAINS]-> (book)
WHERE (book.title =~ $regex 
OR author.author_name =~ $regex
OR subject.sub_name =~ $regex)
RETURN book,author.author_name AS author_name,subject.sub_name AS sub_name
ORDER BY book.edition ASC
LIMIT $limit
`;

export const sortByPopularityAsc = `MATCH (book:Book)
, (author:Author)-[wr:WROTE]->(book)
, (subject:Subject) -[:CONTAINS]-> (book)
WHERE (book.title =~ $regex 
OR author.author_name =~ $regex
OR subject.sub_name =~ $regex)
RETURN book,author.author_name AS author_name,subject.sub_name AS sub_name
ORDER BY book.popularity ASC
LIMIT $limit
`;
export const sortByPopularityDesc = `MATCH (book:Book)
, (author:Author)-[wr:WROTE]->(book)
, (subject:Subject) -[:CONTAINS]-> (book)
WHERE (book.title =~ $regex 
OR author.author_name =~ $regex
OR subject.sub_name =~ $regex)
RETURN book,author.author_name AS author_name,subject.sub_name AS sub_name
ORDER BY book.popularity DESC
LIMIT $limit
`;


export const available = `MATCH (book:Book)
, (author:Author)-[wr:WROTE]->(book)
, (subject:Subject) -[:CONTAINS]-> (book)
WHERE (book.title =~ $regex 
OR author.author_name =~ $regex
OR subject.sub_name =~ $regex)
AND book.no_of_copies > 0 
RETURN book,author.author_name AS author_name,subject.sub_name AS sub_name
LIMIT $limit
`;


export const notAvailable = `MATCH (book:Book)
, (author:Author)-[wr:WROTE]->(book)
, (subject:Subject) -[:CONTAINS]-> (book)
WHERE (book.title =~ $regex 
OR author.author_name =~ $regex
OR subject.sub_name =~ $regex)
AND book.no_of_copies = 0 
RETURN book,author.author_name AS author_name,subject.sub_name AS sub_name
LIMIT $limit
`;

export const defaultQuery = `MATCH (book:Book)
, (author:Author)-[wr:WROTE]->(book)
, (subject:Subject) -[:CONTAINS]-> (book)
WHERE (book.title =~ $regex 
OR author.author_name =~ $regex
OR subject.sub_name =~ $regex)
RETURN book,author.author_name AS author_name,subject.sub_name AS sub_name
LIMIT $limit
`;

