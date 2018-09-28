import gql from 'graphql-tag'

const editUser = gql`mutation ($id: ID, $user: UserInput) {
  updateUser(id: $id, user:$user) {
    id
    name
    email
    company {
      name
    }
  }
}`

export {
  editUser
}
