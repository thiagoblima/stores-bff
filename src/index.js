import { GraphQLServer } from 'graphql-yoga'

// Scalar types - String, Boolean, Int, Float, ID

// Demo user data
const users = [{
    id: '1',
    name: 'Andrew',
    email: 'andrew@example.com',
    age: 27
}, {
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com'
}, {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com'
}]

const posts = [{
    id: '10',
    title: 'GraphQL 101',
    body: 'This is how to use GraphQL...',
    published: true
}, {
    id: '11',
    title: 'GraphQL 201',
    body: 'This is an advanced GraphQL post...',
    published: false
}, {
    id: '12',
    title: 'Programming Music',
    body: '',
    published: false
}]

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        greeting(name: String, position: String): String!
        order(item: String, qtd: Int, price: Float!): String!
        add(numbers: [Float!]!): Float!
        grades: [Int!]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users
            }

            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts
            }

            return posts.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
                return isTitleMatch || isBodyMatch
            })
        },
        greeting(parent, args, ctx, info) {
            if (args.name && args.position) {
                return `Hello, ${args.name}! You are my favoriate ${args.position}.`
            } else {
                return 'Hello!'
            }
        },
        order(parent, args, ctx, info) {
           if(args.item && args.qtd && args.price) {
               return `Your order: ${args.qtd} - ${args.item} - ${args.price}`
           }
        },
        add(parent, args, ctx, info) {
            if (args.numbers.length === 0) {
                return 0
            }

            return args.numbers.reduce((accumulator, currentValue) => {
                return accumulator + currentValue
            })
        },
        grades(parent, args, ctx, info) {
            return [99, 80, 93]
        },
        me() {
            return {
                id: '123098',
                name: 'Mike',
                email: 'mike@example.com'
            }
        },
        post() {
            return {
                id: '092',
                title: 'GraphQL 101',
                body: '',
                published: false
            }
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is up!')
})