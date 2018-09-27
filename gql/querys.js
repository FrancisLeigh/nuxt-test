import gql from 'graphql-tag'

const getUsers = gql`{
  users {
    id
    name
    email
    company {
      name
    }
  }
}`

export {
  getUsers
}
