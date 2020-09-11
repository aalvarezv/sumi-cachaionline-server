

const paginateResults = (req, res) => {
    

    let { model_name, model_data} = res
    
    const page  = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total_registros = model_data.length

    const results = {}

  
   
    if(endIndex < total_registros){
        results.next = {
            page: page + 1,
            limit: limit
        }
    }
    
    if(startIndex > 0){
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }
    
    results[model_name] = model_data.slice(startIndex, endIndex)
     
    res.json({
         results,
    })

}


module.exports = paginateResults
