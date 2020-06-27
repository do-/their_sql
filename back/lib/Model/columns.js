module.exports = {

    label : 'Поля',

    columns : {
        id           : 'string                                      // Полное имя',
        is_pk        : 'int=0                                       // 1, если первичный ключ', 
        name         : 'string                                      // Имя',
        type         : 'string                                      // Тип',
        remark       : 'string                                      // Комментарий в БД',
//        id_table     : '(tables)                                    // Таблица',           
        id_ref_table : 'string                                      // Ссылка',           
    },

    triggers : {

        before_insert : `
        
        	DECLARE
        		stc text[];
        		
        	BEGIN
        	
        		stc := parse_ident (NEW.id);
        		
        		NEW.name = stc [3];
        		
        		RETURN NEW;
        	
        	END;        
        
        `

    },

}