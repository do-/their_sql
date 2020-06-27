module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_tables: 

    function () {

        return this.db.add_vocabularies ({_fields: this.db.model.tables.tables.columns}, {
        })

    },
    
////////////////////////////////////////////////////////////////////////////////

select_tables: 
    
    function () {
   
        this.rq.sort = this.rq.sort || [{field: "id", direction: "asc"}]

        if (this.rq.searchLogic == 'OR') {

            let q = this.rq.search [0].value

            this.rq.search = [
                {field: 'id',     operator: 'contains', value: q},
                {field: 'remark', operator: 'contains', value: q},
                {field: 'note',   operator: 'contains', value: q},
            ]

        }
    
        let filter = this.w2ui_filter ()
        
        return this.db.add_all_cnt ({}, [{tables: filter}])

    },

////////////////////////////////////////////////////////////////////////////////
    
get_item_of_tables: 

    async function () {
    
    	let {id} = this.rq

        let data = await this.db.get ([{tables: {id}}])

        data._fields = this.db.model.tables.tables.columns
        
        return data

    },
    
////////////////////////////////////////////////////////////////////////////////

do_update_tables: 

    async function () {
    
        let {id, data} = this.rq
        
        data.id = id
        
        await this.db.update ('tables', data)

	},

}