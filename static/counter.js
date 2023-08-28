const http = require('http')
const refresh1 = () => {
  http.get('http://localhost:1337/api/activeclients?city=1', function (response) {
    return response
  })
}
refresh1()
