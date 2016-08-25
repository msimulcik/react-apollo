"use strict";
var chai_1 = require('chai');
var graphql_tag_1 = require('graphql-tag');
var parser_1 = require('../src/parser');
describe('parser', function () {
    it('should dynamically create `FragmentDefinition` for included fragments', function () {
        var query = (_a = ["\n      fragment bookInfo on Book { name }\n      query getBook {\n        books {\n          ...bookInfo\n        }\n      }\n    "], _a.raw = ["\n      fragment bookInfo on Book { name }\n      query getBook {\n        books {\n          ...bookInfo\n        }\n      }\n    "], graphql_tag_1.default(_a));
        var parsed = parser_1.parser(query);
        chai_1.expect(parsed.fragments.length).to.equal(1);
        var _a;
    });
    it('should error if both a query and a mutation is present', function () {
        var query = (_a = ["\n      query { user { name } }\n      mutation ($t: String) { addT(t: $t) { user { name } } }\n    "], _a.raw = ["\n      query { user { name } }\n      mutation ($t: String) { addT(t: $t) { user { name } } }\n    "], graphql_tag_1.default(_a));
        try {
            parser_1.parser(query);
        }
        catch (e) {
            chai_1.expect(e).to.match(/Invariant Violation/);
        }
        var _a;
    });
    it('should error if multiple operations are present', function () {
        var query = (_a = ["\n      query One { user { name } }\n      query Two { user { name } }\n    "], _a.raw = ["\n      query One { user { name } }\n      query Two { user { name } }\n    "], graphql_tag_1.default(_a));
        try {
            parser_1.parser(query);
        }
        catch (e) {
            chai_1.expect(e).to.match(/Invariant Violation/);
        }
        var _a;
    });
    it('should return the name of the operation', function () {
        var query = (_a = ["query One { user { name } }"], _a.raw = ["query One { user { name } }"], graphql_tag_1.default(_a));
        chai_1.expect(parser_1.parser(query).name).to.eq('One');
        var mutation = (_b = ["mutation One { user { name } }"], _b.raw = ["mutation One { user { name } }"], graphql_tag_1.default(_b));
        chai_1.expect(parser_1.parser(mutation).name).to.eq('One');
        var _a, _b;
    });
    it('should return data as the name of the operation if not named', function () {
        var query = (_a = ["query { user { name } }"], _a.raw = ["query { user { name } }"], graphql_tag_1.default(_a));
        chai_1.expect(parser_1.parser(query).name).to.eq('data');
        var unnamedQuery = (_b = ["{ user { name } }"], _b.raw = ["{ user { name } }"], graphql_tag_1.default(_b));
        chai_1.expect(parser_1.parser(unnamedQuery).name).to.eq('data');
        var mutation = (_c = ["mutation { user { name } }"], _c.raw = ["mutation { user { name } }"], graphql_tag_1.default(_c));
        chai_1.expect(parser_1.parser(mutation).name).to.eq('data');
        var _a, _b, _c;
    });
    it('should return the type of operation', function () {
        var query = (_a = ["query One { user { name } }"], _a.raw = ["query One { user { name } }"], graphql_tag_1.default(_a));
        chai_1.expect(parser_1.parser(query).type).to.eq(parser_1.DocumentType.Query);
        var unnamedQuery = (_b = ["{ user { name } }"], _b.raw = ["{ user { name } }"], graphql_tag_1.default(_b));
        chai_1.expect(parser_1.parser(unnamedQuery).type).to.eq(parser_1.DocumentType.Query);
        var mutation = (_c = ["mutation One { user { name } }"], _c.raw = ["mutation One { user { name } }"], graphql_tag_1.default(_c));
        chai_1.expect(parser_1.parser(mutation).type).to.eq(parser_1.DocumentType.Mutation);
        var _a, _b, _c;
    });
    it('should return the variable definitions of the operation', function () {
        var query = (_a = ["query One($t: String!) { user(t: $t) { name } }"], _a.raw = ["query One($t: String!) { user(t: $t) { name } }"], graphql_tag_1.default(_a));
        var definition = query.definitions[0];
        chai_1.expect(parser_1.parser(query).variables).to.deep.equal(definition.variableDefinitions);
        var mutation = (_b = ["mutation One($t: String!) { user(t: $t) { name } }"], _b.raw = ["mutation One($t: String!) { user(t: $t) { name } }"], graphql_tag_1.default(_b));
        definition = mutation.definitions[0];
        chai_1.expect(parser_1.parser(mutation).variables).to.deep.equal(definition.variableDefinitions);
        var _a, _b;
    });
    it('should not error if the operation has no variables', function () {
        var query = (_a = ["query { user(t: $t) { name } }"], _a.raw = ["query { user(t: $t) { name } }"], graphql_tag_1.default(_a));
        var definition = query.definitions[0];
        chai_1.expect(parser_1.parser(query).variables).to.deep.equal(definition.variableDefinitions);
        var mutation = (_b = ["mutation { user(t: $t) { name } }"], _b.raw = ["mutation { user(t: $t) { name } }"], graphql_tag_1.default(_b));
        definition = mutation.definitions[0];
        chai_1.expect(parser_1.parser(mutation).variables).to.deep.equal(definition.variableDefinitions);
        var _a, _b;
    });
});
//# sourceMappingURL=parser.js.map