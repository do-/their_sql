const Dia = require ('./Ext/Dia/Dia.js')

module.exports = class extends Dia.DB.Model {

    trg_check_column_values (tab) {
    	let sql = ''
    	for (let name in tab.columns) sql += this.trg_check_column_value (tab, name)
    	return sql
    }
    
    trg_check_column_value (tab, name) {
    
    	let col = tab.columns [name]
    	let sql = ''

    	let re = col.PATTERN; if (re) sql += `
			IF NEW.${name} IS NOT NULL AND NEW.${name} !~ '${re}' THEN
				RAISE '#${name}#: Проверьте, пожалуйста, правильность заполнения поля "${col.REMARK}"';
			END IF;
    	`

    	return sql

    }

    on_before_parse_table_columns (table) {

        let cols = table.columns
        
        if (cols.id) {
            table.pk = 'id'
        } 
        else {
            cols [table.pk = 'uuid'] = 'uuid'
        }
        
    }

}