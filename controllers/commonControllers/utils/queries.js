export const availableQuery = `
    UNWIND $regex AS term
    WITH DISTINCT term
    MATCH (book:Book)
    , (author:Author)-[wr:WROTE]->(book)
    , (subject:Subject) -[:CONTAINS]-> (book)
    WHERE ((book.title =~ "(?i).*"+term+".*")
    OR (author.author_name =~ "(?i).*"+term+".*")
    OR (subject.sub_name =~ "(?i).*"+term+".*"))
    AND book.no_of_copies > 0 
    RETURN DISTINCT book,author.author_name AS author_name,subject.sub_name AS sub_name
    LIMIT $limit
`;

export const generalQuery = `
    UNWIND $regex AS term
    WITH DISTINCT term
    MATCH (book:Book)
    , (author:Author)-[wr:WROTE]->(book)
    , (subject:Subject) -[:CONTAINS]-> (book)
    WHERE ((book.title =~ "(?i).*"+term+".*")
    OR (author.author_name =~ "(?i).*"+term+".*")
    OR (subject.sub_name =~ "(?i).*"+term+".*"))
    RETURN DISTINCT book,author.author_name AS author_name,subject.sub_name AS sub_name
    LIMIT $limit
`;

export const defaultAll = ` 
MATCH (book:Book)
, (author:Author)-[wr:WROTE]->(book)
, (subject:Subject) -[:CONTAINS]-> (book)
RETURN book,author.author_name AS author_name,subject.sub_name AS sub_name
`;

/*

UNWIND $regex AS term
WITH DISTINCT term
MATCH (book:Book)
, (author:Author)-[wr:WROTE]->(book)
, (subject:Subject) -[:CONTAINS]-> (book)
WHERE ((book.title =~ "(?i).*"+term+".*")
OR (author.author_name =~ "(?i).*"+term+".*")
OR (subject.sub_name =~ "(?i).*"+term+".*"))
WITH book,author,subject
RETURN book, author.author_name AS author_name, subject.sub_name AS sub_name
ORDER BY book.popularity DESC
LIMIT $limit

*/