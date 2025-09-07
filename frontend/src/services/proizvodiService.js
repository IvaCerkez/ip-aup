import axios from 'axios'

const API_URL = 'http://localhost:5000/api/proizvodi'
const KATEGORIJE_URL = 'http://localhost:5000/api/proizvodi/kategorije'


export const getProizvodi = params => {
  return axios.get(API_URL, { params })
}

export const getProizvodById = id => {
  return axios.get(`${API_URL}/${id}`)
}

export const addProizvod = proizvod => {
  return axios.post(API_URL, proizvod)
}

export const updateProizvod = (id, proizvod) => {
  return axios.put(`${API_URL}/${id}`, proizvod)
}

export const deleteProizvod = id => {
  return axios.delete(`${API_URL}/${id}`)
}


export const getKategorije = () => {
  return axios.get(KATEGORIJE_URL)
}
