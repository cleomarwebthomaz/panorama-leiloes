const axios = require('axios')

const State = use('App/Models/State')
const City = use('App/Models/City')
const Neighborhood = use('App/Models/Neighborhood')

class ViacepController {

  async index({ response, params }) {
    let cep = params.cep

    const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/unicode/`)

    const state = await State.findBy('uf', data.uf)
    const city = await City.query()
                              .where('name', data.localidade)
                              .where('state_id', state.id)
                              .first()

    const neighborhood = await Neighborhood
                                        .findOrCreate({
                                          state_id: state.id,
                                          city_id: city.id,
                                          name: data.bairro
                                        })

    response.json({
      city,
      state,
      neighborhood,
      address: {
        cep,
        state_id: state.id,
        city_id: city.id,
        neighborhood_id: neighborhood.id,
        street: data.logradouro,
        complement: data.complemento,
        neighborhood: data.bairro,
        city: data.localidade,
        uf: data.uf,
        unity: data.unidade,
        ibge: data.ibge,
        gia: data.gia,
      }
     })
  }

}

module.exports = ViacepController
