<template>
<div>
  <v-data-table
    :headers="headers"
    :items="items"
    :loading="loading"
    class="elevation-1"
  >
    <v-progress-linear slot="progress" color="secondary" indeterminate></v-progress-linear>
    <template slot="items" slot-scope="props">
      <td class="readonly">{{ props.item.id }}</td>
      <td>
        <v-edit-dialog
          :return-value.sync="props.item.name"
          lazy
          @save="saveData(props.item)">
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
          @save="saveData(props.item)">
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
          @save="saveData(props.item)">
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
export default {
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
      items: [],
      loading: false,
      max25chars: v => v.length <= 25 || 'Use less letters!'
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData: _.debounce(async function () {
      this._toggleLoading()
      const d = await this.$axios.$get('https://jsonplaceholder.typicode.com/users')

      this.items = d
      this._toggleLoading()
    }, 200),
    async saveData (payload) {
      this._toggleLoading()
      const item = await this.$axios.$put(`https://jsonplaceholder.typicode.com/users/${payload.id}`, {
        body: JSON.stringify({ title: 'Change', userId: payload.id, ...payload })
      })

      this._setItem(JSON.parse(item.body))
      this._toggleLoading()
    },
    _setItem (editedItem) {
      const newItems = this.items.map(item => item.id === editedItem.id ? editedItem : item)
      this.items = newItems
    },
    _toggleLoading() {
      this.loading = !this.loading
    }
  }
}
</script>

<style scoped>
td.readonly {
  cursor: default;
}
</style>
