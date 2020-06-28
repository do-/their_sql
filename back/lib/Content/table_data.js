module.exports = {
    
////////////////////////////////////////////////////////////////////////////////

select_table_data: 
    
    async function () {
   
        let filter = this.w2ui_filter ()
        
        let [portion, start] = filter.LIMIT

        let {id_table} = this.rq
        
        let [all, cnt] = await Promise.all ([

			this.db_o.select_all (`SELECT * FROM ${id_table} LIMIT ${start}, ${portion}`),

			this.db_o.select_scalar (`SELECT COUNT(*) FROM ${id_table}`),

        ])

		return {all, cnt}

    },

}