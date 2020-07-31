module.exports = {

    label : 'Поля',

    columns : {
        id           : 'string                                      // Полное имя',
        is_pk        : 'int=0                                       // 1, если первичный ключ', 
        name         : 'string                                      // Имя',
        type         : 'string                                      // Тип',
        remark       : 'string                                      // Комментарий в БД',
        note         : 'string                                      // Наш комментарий',
        id_table     : '(tables)                                    // Таблица',           
        id_ref_table : 'string                                      // Ссылка',           
        is_confirmed : 'int=0                                       // 1, если есть в БД', 
    },
    
    keys: {
    	id_ref_table: 'id_ref_table',
    },

    triggers : {

        before_insert : `
        
        	DECLARE
        		stc text[];
        		
        	BEGIN
        	
        		stc := parse_ident (NEW.id);
        		
        		NEW.id_table = stc [1] || '.' || stc [2];
        		NEW.name = stc [3];
        		
        		RETURN NEW;
        	
        	END;        

        `

    },

    on_after_add_column: {

        is_confirmed: [{sql: `UPDATE columns SET is_confirmed = 1`, params: []}],

    }

}