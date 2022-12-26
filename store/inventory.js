export const state = () => ({
  operatorList: [],
  materials: [],
  materialList: [],
  materialTypes: [],
  materialHistoryList: [],
  paginationMaterialList: {},
  paginationMaterialHistoryList: {},
  materialHistoryTypeList: [],
  materialHistoryTypeListReturn: [],
  withdrawList: []
})
export const mutations = {
  getOperatorList (state, operatorList) {
    try {
      state.operatorList = operatorList
    } catch (error) {
      throw new Error(`OPERATOR LIST MUTATE ${error}`)
    }
  },
  getMaterials (state, { materials }) {
    try {
      state.materials = materials
    } catch (error) {
      throw new Error(`MATERIAL LIST MUTATE ${error}`)
    }
  },
  getMaterialList (state, { materials, pagination }) {
    try {
      state.materialList = materials
      state.paginationMaterialList = pagination
    } catch (error) {
      throw new Error(`MATERIAL LIST MUTATE ${error}`)
    }
  },
  getMaterialTypes (state, materialTypes) {
    try {
      state.materialTypes = materialTypes
    } catch (error) {
      throw new Error(`MATERIAL TYPES LIST MUTATE ${error}`)
    }
  },
  getMaterialHistoryList (state, { materialHistories, pagination }) {
    try {
      state.materialHistoryList = materialHistories
      state.paginationMaterialHistoryList = pagination
    } catch (error) {
      throw new Error(`MATERIAL HISTORY LIST MUTATE ${error}`)
    }
  },
  getMaterialHistoryTypeList (state, materialhistorytypes) {
    try {
      state.materialHistoryTypeList = materialhistorytypes.filter(item => item.name.includes('SALIDA'))
      state.materialHistoryTypeListReturn = materialhistorytypes.filter(item => item.name.includes('ENTRADA'))
    } catch (error) {
      throw new Error(`MATERIAL HISTORY TYPE LIST MUTATE ${error}`)
    }
  },
  updateWithdrawList (state, data) {
    try {
      state.withdrawList[data.index].details = data.material.details
      state.withdrawList[data.index].quantity = data.material.quantity
      state.withdrawList[data.index].materialtype = data.material.materialtype
      state.withdrawList[data.index].description = data.material.description
    } catch (error) {
      throw new Error(`WITHDRAW LIST MUTATE ${error}`)
    }
  },
  updateWithdrawListMaterial (state, data) {
    try {
      state.withdrawList[data.index].details = data.material
    } catch (error) {
      throw new Error(`WITHDRAW LIST MUTATE ${error}`)
    }
  },
  updateWithdrawListQuantity (state, data) {
    try {
      state.withdrawList[data.index].quantity = data.quantity
    } catch (error) {
      throw new Error(`WITHDRAW LIST MUTATE ${error}`)
    }
  },
  updateWithdrawListMaterialType (state, data) {
    try {
      state.withdrawList[data.index].materialtype = data.materialtype
    } catch (error) {
      throw new Error(`WITHDRAW LIST MUTATE ${error}`)
    }
  },
  updateWithdrawListDescription (state, data) {
    try {
      state.withdrawList[data.index].description = data.description
    } catch (error) {
      throw new Error(`WITHDRAW LIST MUTATE ${error}`)
    }
  },
  addWithdrawItem (state, withdrawItem) {
    try {
      state.withdrawList.push(withdrawItem)
    } catch (error) {
      throw new Error(`WITHDRAW LIST MUTATE ${error}`)
    }
  },
  removeWithdrawList (state, index) {
    try {
      state.withdrawList.splice(index, 1)
    } catch (error) {
      throw new Error(`WITHDRAW LIST MUTATE ${error}`)
    }
  },
  emptyWithdrawList (state) {
    try {
      state.withdrawList = []
    } catch (error) {
      throw new Error(`WITHDRAW LIST MUTATE ${error}`)
    }
  }
}
export const actions = {
  async getOperatorList ({ commit }, payload) {
    const qs = require('qs')
    const query = qs.stringify({
      pagination: {
        page: 1,
        pageSize: 1000
      }
    },
    {
      encodeValuesOnly: true
    })
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}users?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then((users) => {
          commit('getOperatorList', users)
        })
    } catch (error) {
      throw new Error(`OPERATOR ACTION ${error}`)
    }
  },
  async getMaterials ({ commit }, payload) {
    const qs = require('qs')
    const query = qs.stringify({
      pagination: {
        pageSize: 1000
      },
      populate: ['materialquantities', 'materialquantities.materialtype'],
      sort: ['id:desc']
    },
    {
      encodeValuesOnly: true
    })
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}materials?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then((materials) => {
          commit('getMaterials', { materials: materials.data })
        })
    } catch (error) {
      throw new Error(`MATERIALS ACTION ${error}`)
    }
  },
  async getMaterialList ({ commit }, payload) {
    const qs = require('qs')
    const query = qs.stringify({
      filters: payload.search
        ? {
          name: {
            $contains: payload.search
          }
        }
        : {},
      pagination: payload.pagination,
      populate: ['materialquantities', 'materialquantities.materialtype'],
      sort: payload.sort || payload.sort ? [`${payload.sort.sortBy}:${payload.sort.sortDesc ? 'desc' : 'asc'}`] : ['id:desc']
    },
    {
      encodeValuesOnly: true
    })
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}materials?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then((materials) => {
          commit('getMaterialList', { materials: materials.data, pagination: materials.meta.pagination })
        })
    } catch (error) {
      throw new Error(`MATERIALS ACTION ${error}`)
    }
  },
  async getMaterialTypes ({ commit }, payload) {
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}materialtypes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then((materialTypes) => {
          commit('getMaterialTypes', materialTypes.data)
        })
    } catch (error) {
      throw new Error(`MATERIAL TYPES ACTION ${error}`)
    }
  },
  async getMaterialHistoryList ({ commit }, payload) {
    const qs = require('qs')
    const query = qs.stringify({
      filters: payload.search ? {
        $or: [
          {
            material: {
              name: {
                $contains: payload.search
              }
            }
          },
          {
            technician: {
              username: {
                $contains: payload.search
              }
            }
          }
        ]
      } : {},
      pagination: payload.pagination,
      populate: ['material', 'materialtype', 'material.materialquantities', 'materialhistorytype', 'operator', 'technician'],
      sort: payload.sort || payload.sort ? [`${payload.sort.sortBy}:${payload.sort.sortDesc ? 'desc' : 'asc'}`] : []
    },
    {
      encodeValuesOnly: true
    })
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}materialhistories?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then((materialHistories) => {
          commit('getMaterialHistoryList', { materialHistories: materialHistories.data, pagination: materialHistories.meta.pagination })
        })
    } catch (error) {
      throw new Error(`MATERIALS HISTORY ACTION ${error}`)
    }
  },
  async getMaterialHistoryTypeList ({ commit }, payload) {
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}materialhistorytypes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then((materialhistorytypes) => {
          commit('getMaterialHistoryTypeList', materialhistorytypes.data)
        })
    } catch (error) {
      throw new Error(`MATERIALS ACTION ${error}`)
    }
  },
  async createOperationHistory (_, payload) {
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}materialhistories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        },
        body: JSON.stringify({
          data: {
            quantity: payload.material.quantity,
            description: payload.material.description.toString(),
            material: payload.material.details.id,
            materialtype: payload.material.materialtype.id,
            materialhistorytype: payload.material.materialhistorytype.id,
            operator: payload.material.operator,
            technician: payload.material.technician
          }
        })
      })
    } catch (error) {
      this.$toast.error(error, { position: 'bottom-center' })
      throw new Error(`MATERIALS ACTION ${error}`)
    }
  },
  async createItem (_, payload) {
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}materials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        },
        body: JSON.stringify({
          data: {
            name: payload.data.name,
            city: payload.city.id
          }
        })
      }).then((res) => {
        if (res.status === 200) {
          this.$toast.success('Material creado con éxito', { duration: 3000, position: 'bottom-center' })
        } else {
          this.$toast.error(res.statusText, { position: 'bottom-center' })
        }
      })
    } catch (error) {
      this.$toast.error(error, { position: 'bottom-center' })
      throw new Error(`CREATE ITEM ACTION ${error}`)
    }
  },
  setMaterialQuantity (_, payload) {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}materialquantities/${payload.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          },
          body: JSON.stringify({
            data: {
              quantity: payload.quantity
            }
          })
        })
          .then(res => res.json())
          .then((_) => {
            this.$toast.success(`OPERACION DE INVENTARIO EXITOSA, AHORA HAY ${payload.quantity}`, { duration: 2000, position: 'bottom-center' })
            resolve()
          })
      })
    } catch (error) {
      this.$toast.error(error, { position: 'bottom-center' })
      throw new Error(`MATERIALS ACTION ${error}`)
    }
  },
  async updateCurrentMaterialQuantity (_, payload) {
    const finalQuantity = payload.action === 'add' ? payload.availableQuantity[0].quantity - payload.newQuantity.quantity : payload.availableQuantity[0].quantity + payload.newQuantity.quantity
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}materialquantities/${payload.availableQuantity[0].id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        },
        body: JSON.stringify({
          data: {
            quantity: finalQuantity
          }
        })
      })
        .then(res => res.json())
        .then((_) => {
          this.$toast.success(`OPERACION DE INVENTARIO EXITOSA, AHORA HAY ${finalQuantity} ${payload.material.details.name}`, { duration: 5000, position: 'bottom-center' })
        })
    } catch (error) {
      this.$toast.error(error, { position: 'bottom-center' })
      throw new Error(`MATERIALS ACTION ${error}`)
    }
  },
  async createMaterialQuantity (_, payload) {
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}materialquantities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        },
        body: JSON.stringify({
          data: {
            quantity: payload.data.quantity,
            material: payload.data.material.id,
            materialtype: payload.data.materialtype.id
          }
        })
      })
        .then(res => res.json())
        .then((_) => {
          this.$toast.success('OPERACION DE INVENTARIO EXITOSA, AHORA HAY ' + payload.data.quantity, { duration: 5000, position: 'bottom-center' })
        })
    } catch (error) {
      this.$toast.error(error, { position: 'bottom-center' })
      throw new Error(`MATERIALS ACTION ${error}`)
    }
  }
}
