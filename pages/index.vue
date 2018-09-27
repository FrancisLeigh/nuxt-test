<template>
<div>
  <v-data-table
    :headers="headers"
    :items="items"
    :loading="$apollo.loading"
    class="elevation-1"
  >
    <v-progress-linear slot="progress" color="secondary" indeterminate></v-progress-linear>
    <template slot="items" slot-scope="props">
      <td class="readonly">{{ props.item.id }}</td>
      <td>
        <v-edit-dialog
          :return-value.sync="props.item.name"
          lazy
          @save="saveUserData(props.item)">
            {{ props.item.name }}
            <v-text-field
              slot="input"
              v-model="props.item.name"
              :rules="[max25chars]"
              label="Edit"
              single-line
              counter>
            </v-text-field>
        </v-edit-dialog>
      </td>
      <td>
        <v-edit-dialog
          :return-value.sync="props.item.email"
          lazy
          @save="saveUserData(props.item)">
            {{ props.item.email }}
            <v-text-field
              slot="input"
              v-model="props.item.email"
              :rules="[max25chars]"
              label="Edit"
              single-line
              counter>
            </v-text-field>
        </v-edit-dialog>
      </td>
      <td>
        <v-edit-dialog
          :return-value.sync="props.item.company.name"
          lazy
          @save="saveUserData(props.item)">
            {{ props.item.company.name }}
            <v-text-field
              slot="input"
              v-model="props.item.company.name"
              label="Edit"
              single-line
              counter>
            </v-text-field>
        </v-edit-dialog>
      </td>
    </template>
  </v-data-table>
  <div class="text-xs-center pt-2">
    <v-btn color="secondary" @click.native="getData">Refresh Table</v-btn>
  </div>
</div>
</template>


<script>
import _ from 'lodash'
import { getUsers } from '../gql/querys'
import { editUser } from '../gql/mutations'

export default {
  apollo: {
    items: {
      query: getUsers,
      update: data => data.users
    }
  },
  data () {
    return {
      headers: [{
        text: 'ID',
        align: 'left',
        sortable: false,
        value: 'id'
      }, {
        text: 'Name',
        align: 'left',
        sortable: false,
        value: 'name'
      }, {
        text: 'Email',
        align: 'left',
        sortable: false,
        value: 'email'
      }, {
        text: 'Company name',
        align: 'left',
        sortable: false,
        value: 'company'
      }],
      loading: false,
      max25chars: v => v.length <= 25 || 'Use less letters!',
      items: []
    }
  },
  methods: {
    getData: _.debounce(function () {
      this.$apollo.queries.items.refetch()
    }, 200),
    saveUserData (payload) {
      const itemsCopy = this.items

      this.$apollo.mutate({
        mutation: editUser,
        variables: {
          id: payload.id,
          user: payload
        },
        update: (store, { data: { updateUser }}) => {
          const data = store.readQuery({ query: getUsers })

          data.users.push(updateUser)

          store.writeQuery({ query: getUsers, data })
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateUser: {
            __typename: 'UserInput',
            id: payload.id || -1,
            name: payload.name || '',
            email: payload.email || '',
            company: {
              __typename: 'Company',
              name: payload.company.name || ''
            }
          },
        }
      })
      .catch(e => {
        this.items = itemsCopy
        console.log('error', e)
      })
    },
  }
}
</script>

<style scoped>
td.readonly {
  cursor: default;
}
</style>
