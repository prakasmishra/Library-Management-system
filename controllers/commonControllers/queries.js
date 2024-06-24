export const availableAndSortByEditionDesc = `
    UNWIND $regex AS term
    MATCH (book:Book)
    , (author:Author)-[wr:WROTE]->(book)
    , (subject:Subject) -[:CONTAINS]-> (book)
    WHERE ((book.title =~ "(?i).*"+term+".*")
    OR (author.author_name =~ "(?i).*"+term+".*")
    OR (subject.sub_name =~ "(?i).*"+term+".*"))
    AND book.no_of_copies > 0 
    RETURN book,author.author_name AS author_name,subject.sub_name AS sub_name
    ORDER BY book.edition DESC
    LIMIT $limit
`;

export const availableAndSortByPopularityDesc = ` 
    UNWIND $regex AS term
    MATCH (book:Book)
    , (author:Author)-[wr:WROTE]->(book)
    , (subject:Subject) -[:CONTAINS]-> (book)
    WHERE ((book.title =~ "(?i).*"+term+".*")
    OR (author.author_name =~ "(?i).*"+term+".*")
    OR (subject.sub_name =~ "(?i).*"+term+".*"))
    AND book.no_of_copies > 0 
    RETURN book,author.author_name AS author_name,subject.sub_name AS sub_name
    ORDER BY book.popularity DESC
    LIMIT $limit
`;


export const sortByEditionDesc =  ` 
UNWIND $regex AS term
MATCH (book:Book)
, (author:Author)-[wr:WROTE]->(book)
, (subject:Subject) -[:CONTAINS]-> (book)
WHERE ((book.title =~ "(?i).*"+term+".*")
OR (author.author_name =~ "(?i).*"+term+".*")
OR (subject.sub_name =~ "(?i).*"+term+".*"))
RETURN book,author.author_name AS author_name,subject.sub_name AS sub_name
ORDER BY book.edition DESC
LIMIT $limit
`;

export const sortByPopularityDesc = ` 
UNWIND $regex AS term
MATCH (book:Book)
, (author:Author)-[wr:WROTE]->(book)
, (subject:Subject) -[:CONTAINS]-> (book)
WHERE ((book.title =~ "(?i).*"+term+".*")
OR (author.author_name =~ "(?i).*"+term+".*")
OR (subject.sub_name =~ "(?i).*"+term+".*"))
RETURN book,author.author_name AS author_name,subject.sub_name AS sub_name
ORDER BY book.popularity DESC
LIMIT $limit
`;
